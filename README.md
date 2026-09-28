# Ukrainakriget (ukrainakriget.github.io)

> En öppen, helautomatiserad webbplats och situationsdashboard som presenterar läget i Ukrainakriget med systematisk flerdimensionell klassificering, källhänvisningar och interaktiv visualisering.

[![Validering & Schematest](https://img.shields.io/badge/Data-Validerad-10b981.svg)](scripts/validate_data.py)
[![Licens](https://img.shields.io/badge/Licens-MIT-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-0284c7.svg)](https://ukrainakriget.github.io)

---

## 🎯 Vision och syfte

Traditionell nyhetsrapportering och sociala medier präglas ofta av fragmenterade, ostrukturerade och obestyrkta uppgifter. **Ukrainakriget** är konstruerat som ett stabilt, överskådligt dashboard där besökaren direkt förstår det rådande läget, status och vad som hänt.

### Huvudegenskaper:
- **Tvåspråkighet med ett klick**: Primärt på svenska med omedelbar växling till engelska via `EN`-knappen i sidhuvudet.
- **Helautomatisk drift**: Inga manuella åtgärder krävs. Schemalagda bakgrundsprocesser hämtar, klassificerar och publicerar nytt material kontinuerligt.
- **24-timmars arkivrotation**: Aktuella dagliga händelser visas i dashboarden och flyttas automatiskt till ett sökbart historiskt arkiv efter ett dygns visning, så att sajten alltid är aktuell även för dagliga besökare.
- **Strikt källhänvisning**: Varje publicerat informationsobjekt länkar direkt till sin ursprungliga primärkälla (militära myndigheter, geolokaliserad OSINT, satellitbilder eller internationell press).
- **Interaktiv taktisk karta**: Visuell överblick över frontavsnitt och operationszoner med möjlighet att klicka på en sektor för att filtrera händelser.

---

## 🧩 Flerdimensionell struktur

Kärnvärdet och webbplatsens analysmodell är klassificeringen av informationsobjekt i sex sammanlänkade dimensioner:

1. **⏱️ Tidshorisonter**:
   - `dagligen` (Senaste dygnet – aktiv dashboard)
   - `veckovis` (Operativa veckotrender)
   - `manadsvis` (Månatliga förflyttningar och kampanjer)
   - `ar` (Årliga strategiska skiften och ackumulerad utveckling)

2. **🌍 Geografiska områden**:
   - `fria_ukraina` (Ukrainskkontrollerat territorium: Kyjiv, Charkiv, Odesa, Dnipro etc.)
   - `ockuperade_ukraina` (Ockuperade territorier inkl. Krym och Donbas)
   - `ryssland` (Militära mål, baser och raffinaderier i Ryska federationen samt Kursk-buffertzonen)
   - `ukrainas_granser` (Svarta havets exportkorridor, gränsen mot Belarus, norra gränsen)
   - `eu_ees` (Logistikhubbar, utbildningscentra, diplomatiska toppmöten i Europa)
   - `resten_av_varlden` (USA, FN, global säkerhetsarkitektur)

3. **🏛️ Parter och intressenter**:
   - `ukraina`, `ryssland`, `eu`, `uk`, `usa`, `kina`, `ovriga_varlden`

4. **🎯 Syfte och målnivå**:
   - `akta_syfte` (Verklig bakomliggande avsikt, t.ex. civil terror/påtryckning)
   - `vision` (Långsiktig vision och suveränitetsmål)
   - `strategiskt_mal` (Övergripande krigsmål och allianssamverkan)
   - `taktiskt_mal` (Lokal terrängvinning, skyttegravar, skogsdungar)
   - `operationellt_mal` (Avskärande av logistikkorsvägar och ledningscentraler)
   - `prestationsmal`, `resultatmal`, `effektmal`

5. **🏢 Egenskaper hos anfallsmål**:
   - `helt_civila` (Sjukhus, skolor, bostadskvarter, köpcentrum)
   - `civil_infrastruktur` (Bensinmackar, mjölkbilar, vägar, broar, spannmålssilor)
   - `militara_resurser` (Soldater, stridsvagnar/pansarfordon, luftvärnsbatterier)
   - `energiproduktion` (Transformatorstationer, kraftverk, elnät, gasledningar)
   - `krigsmaterielproduktion` (Ammunitionsfabriker, missillager, drönarverkstäder)
   - `diplomatiskt_politiskt` (Internationella fördrag, sanktionspaket, bistånd)

6. **🔍 Nivå av vetskap med estimerad sannolikhet**:
   - **100% bekräftad**: Geolokaliserad med satellit/video och officiellt bekräftad av flera oberoende källor.
   - **≥85% hög sannolikhet**: Samstämmiga militära underrättelser (t.ex. ISW, UK MoD).
   - **≥60% måttlig / obekräftad**: Ensidig officiell rapport under oberoende utvärdering.
   - **<50% påstående / propaganda**: Obestyrkta uttalanden eller informationspåverkan.
   - Kompletteras med **Effekt / måluppfyllnad** (`fullbordad`, `delvis`, `avvardad`, `pagaende`).

---

## 📁 Projektstruktur

```
ukraina/
├── index.html                   # Huvudsida och interaktiv single-page applikation
├── package.json                 # Projektskript för testning, validering och lokal körning
├── Ukrainakriget.md             # Ursprunglig projektspecifikation
├── README.md                    # Dokumentation och driftsguide
│
├── src/                         # Klientkod
│   ├── css/
│   │   └── style.css            # Mörkt tema, modern typografi och responsiv layout
│   └── js/
│       ├── app.js               # Huvudkontroller, händelsehantering, sökning
│       ├── i18n.js              # Tvåspråkigt lexikon (SV / EN)
│       ├── data.js              # Dataadapter med inbyggd fallback och flerdimensionellt filter
│       └── map.js               # Interaktiv SVG-karta med taktiska sektorer och hotspots
│
├── data/                        # Databas och specifikationer
│   ├── schema.json              # Formellt JSON Schema för händelser och klassificeringar
│   ├── sources.json             # Omfattande källkatalog (17+ källor, kategorier, trovärdighet)
│   ├── input/                   # Mapp för inkommande eller manuellt tillagda JSON-händelser
│   └── output/
│       ├── events.json          # Aktuella händelser (<24 timmar) för dashboarden
│       ├── archive.json         # Historiskt arkiv (>24 timmar)
│       └── statistics.json      # Nyckeltal, luftförsvarsstatistik och förlustuppskattningar
│
├── scripts/                     # Automatiseringsskript
│   ├── fetch_sources.py         # Skannar RSS-flöden, klassificerar text och roterar arkiv
│   ├── archive_manager.py       # Flyttar händelser äldre än 24h till historiskt arkiv
│   └── validate_data.py         # Automatisk testsvit för schemaefterlevnad och källkrav
│
└── .github/
    └── workflows/
        ├── deploy.yml           # Publicerar automatiskt till GitHub Pages vid push till main
        └── auto-update.yml      # Schemalagd körning var 4:e timme för datainsamling & arkivering
```

---

## 🚀 Kom igång lokalt

Projektet har noll externa beroenden för webbvisning. Du kan starta en lokal server direkt med antingen Python eller Node:

```bash
# Starta en lokal webbserver:
npm start
# eller:
python3 -m http.server 8080
```

Öppna sedan webbläsaren på `http://localhost:8080`.

### Kör tester och validering:

```bash
npm test
# eller:
python3 scripts/validate_data.py
```

### Kör automatisk datainsamling och arkivering:

```bash
npm run update-data
# eller:
python3 scripts/fetch_sources.py
```

---

## ☁️ Publicering till GitHub och GitHub Pages

Projektet är konfigurerat för:
- **GitHub-organisation**: `ukrainakriget`
- **Repo**: `ukrainakriget.github.io`
- **Webbadress**: `https://ukrainakriget.github.io`

### Driftsättning:

1. Repot finns på GitHub under `ukrainakriget/ukrainakriget.github.io`.
2. Vid push till `main` bygger och driftsätter workflowet `.github/workflows/deploy.yml` automatiskt webbplatsen på `ukrainakriget.github.io`.
3. Workflowet `.github/workflows/auto-update.yml` körs därefter automatiskt var 4:e timme via cron, samlar in ny data, uppdaterar händelser, roterar arkivet och publicerar utan manuellt ingripande.

---

## 📜 Licens

Projektet är licensierat under MIT-licensen. Information som återges tillskrivs respektive primärkälla i enlighet med god citat- och källsed.
