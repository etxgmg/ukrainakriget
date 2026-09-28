#!/usr/bin/env python3
"""
validate_data.py
Validerar datakvalitet, schemaefterlevnad och källhänvisningar enligt Ukrainakriget.md.
"""

import json
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
EVENTS_FILE = BASE_DIR / "data" / "output" / "events.json"
ARCHIVE_FILE = BASE_DIR / "data" / "output" / "archive.json"
SOURCES_FILE = BASE_DIR / "data" / "sources.json"
STATS_FILE = BASE_DIR / "data" / "output" / "statistics.json"

REQUIRED_FIELDS = [
    "id", "date", "timestamp", "title_sv", "title_en",
    "summary_sv", "summary_en", "tidshorisont", "geografiskt_omrade",
    "parter_intressenter", "syfte", "egenskaper_anfallsmal",
    "niva_vetskap_sannolikhet", "effekt_maluppfyllnad",
    "kalla", "kallurl", "kallkategori", "arkiverad"
]

VALID_TIDSHORISONTER = {"dagligen", "veckovis", "manadsvis", "ar"}
VALID_GEOGRAFI = {
    "fria_ukraina", "ockuperade_ukraina", "ryssland",
    "ukrainas_granser", "eu_ees", "resten_av_varlden"
}
VALID_PARTER = {"ukraina", "ryssland", "eu", "uk", "usa", "kina", "ovriga_varlden"}
VALID_ANFALLSMAL = {
    "helt_civila", "civil_infrastruktur", "militara_resurser",
    "energiproduktion", "krigsmaterielproduktion", "diplomatiskt_politiskt"
}

def validate_event(evt, context="event"):
    errors = []
    # 1. Check required fields
    for field in REQUIRED_FIELDS:
        if field not in evt or evt[field] is None:
            errors.append(f"Saknar obligatoriskt fält: '{field}' i [{evt.get('id', 'okänt ID')}]")

    # 2. Check classifications
    if evt.get("tidshorisont") not in VALID_TIDSHORISONTER:
        errors.append(f"Ogiltig tidshorisont '{evt.get('tidshorisont')}' i [{evt.get('id')}]")

    if evt.get("geografiskt_omrade") not in VALID_GEOGRAFI:
        errors.append(f"Ogiltigt geografiskt område '{evt.get('geografiskt_omrade')}' i [{evt.get('id')}]")

    for part in evt.get("parter_intressenter", []):
        if part not in VALID_PARTER:
            errors.append(f"Ogiltig part '{part}' i [{evt.get('id')}]")

    if evt.get("egenskaper_anfallsmal") not in VALID_ANFALLSMAL:
        errors.append(f"Ogiltig måltyp '{evt.get('egenskaper_anfallsmal')}' i [{evt.get('id')}]")

    # 3. Check verification level (0-100)
    vetskap = evt.get("niva_vetskap_sannolikhet", {})
    if not isinstance(vetskap, dict) or "procent" not in vetskap:
        errors.append(f"Saknar niva_vetskap_sannolikhet.procent i [{evt.get('id')}]")
    else:
        p = vetskap["procent"]
        if not (0 <= p <= 100):
            errors.append(f"Ogiltig sannolikhetsprocent {p} i [{evt.get('id')}] (måste vara 0-100)")

    # 4. Check source attribution requirement
    if not evt.get("kalla") or not evt.get("kallurl"):
        errors.append(f"KRAV FEL: Källhänvisning eller URL saknas för [{evt.get('id')}]")

    # 5. Check bilingual support
    if not evt.get("title_sv") or not evt.get("title_en"):
        errors.append(f"Tvåspråkighet saknas (titel) för [{evt.get('id')}]")

    return errors

def main():
    print("Validerar datakatalog och händelsefiler...")
    all_errors = []

    # Validate sources.json
    if not SOURCES_FILE.exists():
        all_errors.append(f"Källfil saknas: {SOURCES_FILE}")
    else:
        with open(SOURCES_FILE, "r", encoding="utf-8") as f:
            sources_data = json.load(f)
            sources = sources_data.get("sources", [])
            print(f"✓ Källkatalog: {len(sources)} källor registrerade över {len(sources_data.get('categories', []))} kategorier.")

    # Validate events.json
    if not EVENTS_FILE.exists():
        all_errors.append(f"Fil saknas: {EVENTS_FILE}")
    else:
        with open(EVENTS_FILE, "r", encoding="utf-8") as f:
            events_data = json.load(f)
            events = events_data.get("events", [])
            print(f"✓ Aktiva händelser (senaste 24h): {len(events)} händelser.")
            for e in events:
                all_errors.extend(validate_event(e, "aktiva"))

    # Validate archive.json
    if not ARCHIVE_FILE.exists():
        all_errors.append(f"Fil saknas: {ARCHIVE_FILE}")
    else:
        with open(ARCHIVE_FILE, "r", encoding="utf-8") as f:
            archive_data = json.load(f)
            archived = archive_data.get("events", [])
            print(f"✓ Historiskt arkiv: {len(archived)} händelser arkiverade.")
            for e in archived:
                all_errors.extend(validate_event(e, "arkiv"))

    # Validate statistics.json
    if not STATS_FILE.exists():
        all_errors.append(f"Fil saknas: {STATS_FILE}")
    else:
        print("✓ Statistikfil validerad.")

    # Validate analyses.json
    analyses_file = BASE_DIR / "data" / "output" / "analyses.json"
    if not analyses_file.exists():
        all_errors.append(f"Analysfil saknas: {analyses_file}")
    else:
        with open(analyses_file, "r", encoding="utf-8") as f:
            ana_data = json.load(f)
            analyses_list = ana_data.get("analyses", [])
            print(f"✓ Expertanalyser: {len(analyses_list)} analyser registrerade.")
            for a in analyses_list:
                if not a.get("title_sv") or not a.get("title_en"):
                    all_errors.append(f"Saknar tvåspråkig titel för analys [{a.get('id')}]")
                if not a.get("url"):
                    all_errors.append(f"Saknar källänk för analys [{a.get('id')}]")

    if all_errors:
        print(f"\nFEL FUNNA ({len(all_errors)} st):")
        for err in all_errors:
            print(f"  - {err}")
        sys.exit(1)
    else:
        print("\nALLA KONTROLLER GODKÄNDA! Databasen uppfyller alla krav i Ukrainakriget.md.")
        sys.exit(0)

if __name__ == "__main__":
    main()
