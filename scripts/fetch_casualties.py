#!/usr/bin/env python3
"""
fetch_casualties.py
Hämtar och strukturerar officiella ryska förlustsiffror från Minfin / Ukrainas Generalstab
(https://index.minfin.com.ua/en/russian-invading/casualties/).
Sparar data till data/output/casualties.json och uppdaterar statistics.json.
"""

import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
CASUALTIES_FILE = BASE_DIR / "data" / "output" / "casualties.json"
STATS_FILE = BASE_DIR / "data" / "output" / "statistics.json"

MINFIN_URL = "https://index.minfin.com.ua/en/russian-invading/casualties/"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
}

CATEGORY_MAPPING = [
    {
        "key": "personnel",
        "match_keys": ["military personnel"],
        "name_sv": "Personal (stupade och allvarligt sårade)",
        "name_en": "Military personnel (killed / wounded)",
        "unit_sv": "man",
        "unit_en": "troops",
        "icon": "🪖",
        "highlight": True
    },
    {
        "key": "artillery",
        "match_keys": ["artillery systems"],
        "name_sv": "Artillerisystem",
        "name_en": "Artillery systems",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "💥",
        "highlight": True
    },
    {
        "key": "uav",
        "match_keys": ["uav"],
        "name_sv": "Drönare (UAV)",
        "name_en": "UAVs / Drones",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🛸",
        "highlight": True
    },
    {
        "key": "vehicles",
        "match_keys": ["cars and cisterns"],
        "name_sv": "Transport- och tankfordon",
        "name_en": "Cars and fuel cisterns",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🚛",
        "highlight": True
    },
    {
        "key": "tanks",
        "match_keys": ["tanks"],
        "name_sv": "Stridsvagnar",
        "name_en": "Tanks",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🛡️",
        "highlight": False
    },
    {
        "key": "afv",
        "match_keys": ["armored fighting vehicle"],
        "name_sv": "Pansarskytte- och stridsfordon",
        "name_en": "Armored fighting vehicles",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🚜",
        "highlight": False
    },
    {
        "key": "mlrs",
        "match_keys": ["mlrs"],
        "name_sv": "Raketartilleri (MLRS)",
        "name_en": "Multiple launch rocket systems",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🚀",
        "highlight": False
    },
    {
        "key": "anti_air",
        "match_keys": ["anti-aircraft warfare"],
        "name_sv": "Luftvärnssystem",
        "name_en": "Anti-aircraft warfare",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "📡",
        "highlight": False
    },
    {
        "key": "special_equipment",
        "match_keys": ["special equipment"],
        "name_sv": "Special- och ingenjörsfordon",
        "name_en": "Special equipment",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🛠️",
        "highlight": False
    },
    {
        "key": "cruise_missiles",
        "match_keys": ["cruise missiles", "cruise <span"],
        "name_sv": "Kryssningsrobotar (nedskjutna)",
        "name_en": "Cruise missiles intercepted",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🎯",
        "highlight": False
    },
    {
        "key": "ground_robots",
        "match_keys": ["ground robotic systems"],
        "name_sv": "Markgående robotsystem",
        "name_en": "Ground robotic systems",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🤖",
        "highlight": False
    },
    {
        "key": "planes",
        "match_keys": ["planes"],
        "name_sv": "Flygplan",
        "name_en": "Planes",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "✈️",
        "highlight": False
    },
    {
        "key": "helicopters",
        "match_keys": ["helicopters"],
        "name_sv": "Helikoptrar",
        "name_en": "Helicopters",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🚁",
        "highlight": False
    },
    {
        "key": "ships",
        "match_keys": ["ships (boats)"],
        "name_sv": "Krigsfartyg och båtar",
        "name_en": "Warships and boats",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "🚢",
        "highlight": False
    },
    {
        "key": "submarines",
        "match_keys": ["submarines"],
        "name_sv": "Ubåtar",
        "name_en": "Submarines",
        "unit_sv": "st",
        "unit_en": "units",
        "icon": "⚓",
        "highlight": False
    }
]

def fetch_casualties_html():
    req = urllib.request.Request(MINFIN_URL, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        return resp.read().decode("utf-8", errors="ignore")

def parse_casualties(html):
    # Leta upp datum och senaste dygnslistan
    date_m = re.search(r"<span class=[\x27\"]black[\x27\"]>(\d{2}\.\d{2}\.\d{4})</span>.*?<div class=[\x27\"]casualties[\x27\"]>.*?<ul>(.*?)</ul>", html, re.DOTALL)
    if not date_m:
        print("[VARNING] Kunde inte matcha primärt datumblock på Minfin. Försöker med sekundär metod.")
        date_m = re.search(r"(\d{2}\.\d{2}\.\d{4}).*?<div class=[\x27\"]casualties[\x27\"]>.*?<ul>(.*?)</ul>", html, re.DOTALL)
        if not date_m:
            raise ValueError("Kunde inte hitta förlusttabellen i Minfins HTML-svar.")

    raw_date = date_m.group(1)
    day, month, year = raw_date.split(".")
    iso_date = f"{year}-{month}-{day}"
    ul_content = date_m.group(2)

    raw_items = re.findall(r"<li>(.*?)</li>", ul_content, re.DOTALL)
    extracted_raw = {}

    for item in raw_items:
        daily_delta = 0
        delta_m = re.search(r"<small>\(\+?(\d+)\)</small>", item)
        if delta_m:
            daily_delta = int(delta_m.group(1))

        # Ta bort taggar och normalisera
        clean = re.sub(r"<[^>]+>", " ", item)
        clean = re.sub(r"&nbsp;", " ", clean)
        clean = re.sub(r"&mdash;", "—", clean)
        clean = re.sub(r"\s+", " ", clean).strip()

        # Dela vid tankstreck
        parts = re.split(r"[—–]", clean)
        if len(parts) >= 2:
            raw_title = parts[0].strip().lower()
            val_str = parts[1].strip()
            tot_m = re.search(r"(\d+)", val_str.replace(" ", "").replace(",", ""))
            total_val = int(tot_m.group(1)) if tot_m else 0
            extracted_raw[raw_title] = {
                "total": total_val,
                "daily": daily_delta
            }

    # Bygg strukturerad lista enligt CATEGORY_MAPPING
    categories = []
    total_equipment_daily = 0

    for mapping in CATEGORY_MAPPING:
        matched_val = None
        for mk in mapping["match_keys"]:
            for raw_k, val in extracted_raw.items():
                if mk in raw_k:
                    matched_val = val
                    break
            if matched_val:
                break

        if matched_val:
            total_count = matched_val["total"]
            daily_count = matched_val["daily"]
        else:
            total_count = 0
            daily_count = 0

        if mapping["key"] not in ["personnel", "cruise_missiles"]:
            total_equipment_daily += daily_count

        categories.append({
            "key": mapping["key"],
            "name_sv": mapping["name_sv"],
            "name_en": mapping["name_en"],
            "total": total_count,
            "daily": daily_count,
            "unit_sv": mapping["unit_sv"],
            "unit_en": mapping["unit_en"],
            "icon": mapping["icon"],
            "highlight": mapping["highlight"]
        })

    # Skapa slutligt strukturerat objekt
    personnel_cat = next((c for c in categories if c["key"] == "personnel"), None)
    artillery_cat = next((c for c in categories if c["key"] == "artillery"), None)
    uav_cat = next((c for c in categories if c["key"] == "uav"), None)
    vehicles_cat = next((c for c in categories if c["key"] == "vehicles"), None)

    summary = {
        "daily_personnel": personnel_cat["daily"] if personnel_cat else 0,
        "daily_artillery": artillery_cat["daily"] if artillery_cat else 0,
        "daily_drones": uav_cat["daily"] if uav_cat else 0,
        "daily_equipment_total": total_equipment_daily,
        "total_personnel": personnel_cat["total"] if personnel_cat else 0
    }

    now_utc = datetime.now(timezone.utc).isoformat()
    return {
        "date": iso_date,
        "last_updated": now_utc,
        "source": {
            "name": "Minfin – Russian Casualties Index",
            "url": MINFIN_URL,
            "origin": "Ukrainas Generalstab (Armed Forces of Ukraine / RNBO)",
            "credibility": "Officiell militär operativ uppskattning"
        },
        "methodology_note_sv": "Uppgifterna baseras på Ukrainas Generalstabs officiella dygnsrapporter och sammanställs av Minfin. Siffrorna återspeglar den ukrainska militärens operativa uppskattningar. Som komplement redovisas oberoende fotoverifierade minimiförluster via Oryx under Metod.",
        "methodology_note_en": "Data sourced from official daily reports of the General Staff of the Armed Forces of Ukraine, aggregated by Minfin. These represent Ukrainian military operational estimates. For comparison, conservative photo-verified equipment losses from Oryx are documented under Methodology.",
        "summary": summary,
        "categories": categories
    }

def update_statistics_file(data):
    if not STATS_FILE.exists():
        return
    try:
        with open(STATS_FILE, "r", encoding="utf-8") as f:
            stats = json.load(f)

        stats["russian_casualties_minfin"] = {
            "date": data["date"],
            "daily_personnel": data["summary"]["daily_personnel"],
            "daily_artillery": data["summary"]["daily_artillery"],
            "daily_drones": data["summary"]["daily_drones"],
            "daily_equipment_total": data["summary"]["daily_equipment_total"],
            "total_personnel": data["summary"]["total_personnel"],
            "source_url": data["source"]["url"]
        }

        with open(STATS_FILE, "w", encoding="utf-8") as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        print(f"✓ Uppdaterade {STATS_FILE} med ryska förlustsiffror från Minfin.")
    except Exception as e:
        print(f"[VARNING] Kunde inte uppdatera statistics.json med Minfin-data: {e}")

def run_casualties_collection():
    print("=== Samlar in ryska förlustsiffror från Minfin / Generalstaben ===")
    try:
        html = fetch_casualties_html()
        data = parse_casualties(html)
        
        # Spara till casualties.json
        with open(CASUALTIES_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✓ Sparade förlustdata för {data['date']} till {CASUALTIES_FILE}.")

        # Uppdatera statistics.json
        update_statistics_file(data)
        return data
    except Exception as e:
        print(f"[FEL] Kunde inte hämta eller tolka Minfin-data: {e}")
        return None

if __name__ == "__main__":
    result = run_casualties_collection()
    if result:
        print("Klar. Dagens siffror:")
        print(f" - Personal: +{result['summary']['daily_personnel']} (Totalt: {result['summary']['total_personnel']:,})")
        print(f" - Artilleri: +{result['summary']['daily_artillery']}")
        print(f" - Drönare: +{result['summary']['daily_drones']}")
        print(f" - Materiel totalt: +{result['summary']['daily_equipment_total']}")
