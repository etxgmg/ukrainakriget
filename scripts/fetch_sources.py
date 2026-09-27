#!/usr/bin/env python3
"""
fetch_sources.py
Automatiserad insamlare och klassificerare av informationsobjekt från definierade källor.
Stödjer RSS-flöden, JSON-input i data/input/, och klassificerar automatiskt
mot de 6 dimensionerna i Ukrainakriget.md.
"""

import json
import re
import sys
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCES_FILE = BASE_DIR / "data" / "sources.json"
INPUT_DIR = BASE_DIR / "data" / "input"
EVENTS_FILE = BASE_DIR / "data" / "output" / "events.json"

from archive_manager import run_archive_rotation
from validate_data import validate_event

def classify_text(text):
    """
    Klassificerar text och nyhetsinnehåll mot Ukrainakriget.md:s 6 dimensioner.
    """
    lower = text.lower()
    
    # 1. Geografi
    geografi = "fria_ukraina"
    if any(k in lower for k in ["crimea", "krym", "donetsk", "luhansk", "zaporizhzhia", "mariupol", "ockuperad"]):
        geografi = "ockuperade_ukraina"
    elif any(k in lower for k in ["russia", "moscow", "kursk", "belgorod", "rostov", "tver", "ryssland"]):
        geografi = "ryssland"
    elif any(k in lower for k in ["border", "belarus", "black sea", "svarta havet", "gräns"]):
        geografi = "ukrainas_granser"
    elif any(k in lower for k in ["eu", "brussels", "germany", "france", "poland", "sweden", "london", "uk"]):
        geografi = "eu_ees"
    elif any(k in lower for k in ["washington", "usa", "biden", "un", "china", "beijing"]):
        geografi = "resten_av_varlden"

    # 2. Parter
    parter = ["ukraina"]
    if any(k in lower for k in ["russia", "russian", "rysk", "ryssland", "moskva"]):
        parter.append("ryssland")
    if any(k in lower for k in ["eu", "europe", "europeiska"]):
        parter.append("eu")
    if any(k in lower for k in ["uk", "britain", "british", "storbritannien"]):
        parter.append("uk")
    if any(k in lower for k in ["usa", "us", "american", "washington"]):
        parter.append("usa")
    if any(k in lower for k in ["china", "chinese", "kina", "peking"]):
        parter.append("kina")

    # 3. Anfallsmål / Egenskaper
    mal = "militara_resurser"
    if any(k in lower for k in ["hospital", "school", "residential", "apartment", "civilian", "barn", "sjukhus", "skola", "bostad"]):
        mal = "helt_civila"
    elif any(k in lower for k in ["power", "energy", "grid", "substation", "elverk", "energi", "kraftverk"]):
        mal = "energiproduktion"
    elif any(k in lower for k in ["arsenal", "factory", "weapons", "ammunition", "depot", "drönarfabrik", "krigsmateriel"]):
        mal = "krigsmaterielproduktion"
    elif any(k in lower for k in ["bridge", "railway", "train", "gas station", "port", "spannmål", "hamn", "järnväg"]):
        mal = "civil_infrastruktur"
    elif any(k in lower for k in ["sanctions", "aid", "summit", "treaty", "toppmöte", "bistånd", "avtal"]):
        mal = "diplomatiskt_politiskt"

    # 4. Syfte
    syfte_kat = "taktiskt_mal"
    if mal == "helt_civila":
        syfte_kat = "akta_syfte"
        beskrivning_sv = "Äkta syfte: Psykologisk påtryckning och terrorisering av civilbefolkningen."
        beskrivning_en = "Underlying purpose: Psychological attrition and terrorizing the civilian populace."
    elif mal == "energiproduktion":
        syfte_kat = "strategiskt_mal"
        beskrivning_sv = "Strategiskt mål: Slå ut Ukrainas civila energisystem och vinterförsörjning."
        beskrivning_en = "Strategic goal: Incapacitate civilian heating and electrical resilience ahead of winter."
    elif mal == "krigsmaterielproduktion":
        syfte_kat = "operationellt_mal"
        beskrivning_sv = "Operationellt mål: Slå ut motståndarens ammunitions- och vapenreserver."
        beskrivning_en = "Operational goal: Sever adversary weapon production and stockpile logistics."
    elif mal == "diplomatiskt_politiskt":
        syfte_kat = "strategiskt_mal"
        beskrivning_sv = "Strategiskt mål: Stärka internationella koalitioner och logistiskt stöd till Ukraina."
        beskrivning_en = "Strategic goal: Consolidate international alliances and defense procurement."
    else:
        beskrivning_sv = "Taktiskt mål: Neka fienden manöverutrymme och säkra territoriell kontroll."
        beskrivning_en = "Tactical goal: Interdict hostile maneuver and secure tactical positions."

    return {
        "geografi": geografi,
        "parter": list(set(parter)),
        "mal": mal,
        "syfte": {
            "kategori": syfte_kat,
            "beskrivning_sv": beskrivning_sv,
            "beskrivning_en": beskrivning_en
        }
    }

def fetch_rss_feed(source):
    rss_url = source.get("rss")
    if not rss_url:
        return []

    print(f"Hämtar flöde från: {source['name']} ({rss_url})...")
    items = []
    try:
        req = urllib.request.Request(
            rss_url,
            headers={"User-Agent": "UkrainakrigetDashboard/1.0 (+https://ukrainakriget.github.io)"}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            
            # Find RSS channel items
            channel = root.find("channel")
            if channel is not None:
                for item in channel.findall("item")[:5]:
                    title = item.findtext("title", "").strip()
                    link = item.findtext("link", "").strip()
                    desc = item.findtext("description", "").strip()
                    # Strip html tags from description
                    desc_clean = re.sub(r"<[^>]+>", "", desc).strip()
                    pub_date = item.findtext("pubDate", "")

                    if title and link:
                        items.append({
                            "title": title,
                            "link": link,
                            "desc": desc_clean,
                            "source": source
                        })
    except Exception as e:
        print(f"  [OBS] Kunde inte hämta RSS för {source['name']} ({e}). Fortsätter...")
    return items

def process_custom_input():
    """
    Läser in eventuella manuellt inlagda JSON-filer i data/input/
    """
    new_events = []
    for file_path in INPUT_DIR.glob("*.json"):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    new_events.extend(data)
                elif isinstance(data, dict) and "events" in data:
                    new_events.extend(data["events"])
            print(f"Läste in {len(new_events)} händelser från {file_path.name}")
        except Exception as e:
            print(f"Kunde inte läsa {file_path}: {e}")
    return new_events

def main():
    print(f"[{datetime.now().isoformat()}] Startar informationsinsamling och klassificering...")
    
    with open(SOURCES_FILE, "r", encoding="utf-8") as f:
        sources_data = json.load(f)

    # 1. Kontrollera nätverksflöden från källkatalogen
    feed_items = []
    for s in sources_data.get("sources", []):
        if "rss" in s:
            items = fetch_rss_feed(s)
            feed_items.extend(items)

    print(f"Totalt insamlade artiklar från externa flöden: {len(feed_items)}")

    # 2. Bearbeta manuella inputs i data/input/
    custom_events = process_custom_input()

    # 3. Ladda befintliga händelser
    if EVENTS_FILE.exists():
        with open(EVENTS_FILE, "r", encoding="utf-8") as f:
            events_data = json.load(f)
    else:
        events_data = {"events": [], "total_active_events": 0}

    existing_ids = {e["id"] for e in events_data.get("events", [])}
    
    # 4. Arkivrotation (flytta >24h gamla händelser)
    run_archive_rotation(retention_hours=24)

    print("Körning av fetch_sources.py slutförd.")

if __name__ == "__main__":
    main()
