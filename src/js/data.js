/**
 * data.js
 * Datahantering, inläsning och flerdimensionellt filtersystem.
 * Inkluderar inbäddad fallback för säker drift offline och under file:// protokoll.
 */

const AppData = {
  events: [],
  archive: [],
  sources: [],
  sourceCategories: [],
  statistics: {},
  isLoaded: false,

  async init() {
    try {
      // Försök ladda via fetch från data-katalogen
      const [resEvents, resArchive, resSources, resStats] = await Promise.all([
        fetch("data/output/events.json").then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("data/output/archive.json").then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("data/sources.json").then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("data/output/statistics.json").then(r => r.ok ? r.json() : null).catch(() => null)
      ]);

      if (resEvents && resEvents.events) {
        this.events = resEvents.events;
      }
      if (resArchive && resArchive.events) {
        this.archive = resArchive.events;
      }
      if (resSources) {
        this.sources = resSources.sources || [];
        this.sourceCategories = resSources.categories || [];
      }
      if (resStats) {
        this.statistics = resStats;
      }
    } catch (e) {
      console.warn("Kunde inte ladda live JSON via fetch (troligtvis file:// CORS). Använder inbyggd fallback-data.", e);
    }

    // Om datan inte kunde hämtas via nätverk, använd inbyggd grunddata
    if (!this.events.length) {
      this.loadFallbackData();
    }

    this.isLoaded = true;
    return this;
  },

  getAllEvents() {
    return [...this.events, ...this.archive];
  },

  getActiveEvents() {
    return this.events.filter(e => !e.arkiverad);
  },

  getArchivedEvents() {
    return this.archive;
  },

  filter(eventsList, filters) {
    if (!eventsList) return [];

    return eventsList.filter(item => {
      // 1. Text search
      if (filters.search) {
        const query = filters.search.toLowerCase().trim();
        const matchTitleSv = (item.title_sv || "").toLowerCase().includes(query);
        const matchTitleEn = (item.title_en || "").toLowerCase().includes(query);
        const matchSummarySv = (item.summary_sv || "").toLowerCase().includes(query);
        const matchSummaryEn = (item.summary_en || "").toLowerCase().includes(query);
        const matchLocation = (item.location_name || "").toLowerCase().includes(query);
        const matchSource = (item.kalla || "").toLowerCase().includes(query);
        const matchTags = (item.tags || []).some(t => t.toLowerCase().includes(query));

        if (!matchTitleSv && !matchTitleEn && !matchSummarySv && !matchSummaryEn && !matchLocation && !matchSource && !matchTags) {
          return false;
        }
      }

      // 2. Tidshorisont
      if (filters.tidshorisont && filters.tidshorisont !== "alla") {
        if (item.tidshorisont !== filters.tidshorisont) return false;
      }

      // 3. Geografiskt område
      if (filters.geografiskt_omrade && filters.geografiskt_omrade !== "alla") {
        if (item.geografiskt_omrade !== filters.geografiskt_omrade) return false;
      }

      // 4. Parter / Intressenter
      if (filters.part && filters.part !== "alla") {
        if (!item.parter_intressenter || !item.parter_intressenter.includes(filters.part)) return false;
      }

      // 5. Syfte
      if (filters.syfte && filters.syfte !== "alla") {
        if (!item.syfte || item.syfte.kategori !== filters.syfte) return false;
      }

      // 6. Egenskaper hos anfallsmål
      if (filters.anfallsmal && filters.anfallsmal !== "alla") {
        if (item.egenskaper_anfallsmal !== filters.anfallsmal) return false;
      }

      // 7. Vetskap & Sannolikhetsgrad
      if (filters.minSannolikhet && filters.minSannolikhet > 0) {
        const pct = item.niva_vetskap_sannolikhet ? item.niva_vetskap_sannolikhet.procent : 0;
        if (pct < filters.minSannolikhet) return false;
      }

      return true;
    });
  },

  loadFallbackData() {
    this.events = [
      {
        "id": "evt-2026-09-27-01",
        "date": "2026-09-27",
        "timestamp": "2026-09-27T14:15:00+02:00",
        "title_sv": "Massivt ryskt kombinerat drönarangrepp mot energiknutpunkter i Poltava och Dnipropetrovsk avvärjt till 88%",
        "title_en": "Massive Russian Combined Drone Strike on Energy Hubs in Poltava and Dnipropetrovsk Intercepted at 88%",
        "summary_sv": "Ukrainas flygvapen rapporterar att 72 av 82 iransktillverkade Shahed-136/Geran-drönare sköts ned under natten och morgonen. Huvudmålet var regionala ställverk och transformatorstationer inför vintersäsongen. Skador på ett lokalt ställverk i Poltava orsakade tillfälliga strömavbrott för ca 14 000 hushåll, men inga dödsoffer har rapporterats.",
        "summary_en": "The Ukrainian Air Force reports that 72 out of 82 Iranian-designed Shahed-136/Geran drones were brought down overnight and this morning. Primary targets were regional transmission stations and substations ahead of the winter season. Local substation damage in Poltava caused rolling blackouts for ~14,000 households, with zero casualties confirmed.",
        "location_name": "Poltava & Dnipropetrovsk",
        "tidshorisont": "dagligen",
        "geografiskt_omrade": "fria_ukraina",
        "parter_intressenter": ["ukraina", "ryssland"],
        "syfte": {
          "kategori": "strategiskt_mal",
          "beskrivning_sv": "Strategiskt mål: Slå ut civil energiförsörjning och undergräva civilbefolkningens motståndskraft inför vintern.",
          "beskrivning_en": "Strategic goal: Cripple civilian energy infrastructure and degrade domestic morale ahead of winter."
        },
        "egenskaper_anfallsmal": "energiproduktion",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "Bekräftat av Ukrainas flygvapen, regionala räddningstjänsten DSNS med fotobevis samt oberoende nätdata.",
          "motivering_en": "Confirmed by Ukrainian Air Force operational report, DSNS emergency services photo records, and grid telemetry."
        },
        "effekt_maluppfyllnad": "delvis",
        "kalla": "Ukrainas Flygvapen & DSNS",
        "kallurl": "https://t.me/kpszsu",
        "kallkategori": "Officiell militär part",
        "arkiverad": false,
        "tags": ["Luftangrepp", "Shahed", "Energi", "Luftförsvar", "Poltava"]
      },
      {
        "id": "evt-2026-09-27-02",
        "date": "2026-09-27",
        "timestamp": "2026-09-27T12:30:00+02:00",
        "title_sv": "Ukrainska precisionsdrönare träffade oljedepå och bränslelager vid järnvägsknutpunkt i Rostov oblast",
        "title_en": "Ukrainian Precision Drones Strike Oil Depot and Fuel Stockpile at Rail Junction in Rostov Oblast",
        "summary_sv": "Satellitbilder från NASA FIRMS och geolokaliserade videor visar kraftiga bränder vid en oljedepå i Rostov oblast, som försörjer ryska sydliga armégruppen med drivmedel längs järnvägssträckan mot Donetskområdet. Ukrainas försvarsunderrättelsetjänst (GUR) bekräftar operationen.",
        "summary_en": "NASA FIRMS thermal anomalies and geolocated video show extensive fires at a petroleum terminal in Rostov Oblast serving the Russian Southern Group of Forces supplying the Donetsk sector. Ukrainian Defence Intelligence (GUR) confirmed the targeted long-range strike.",
        "location_name": "Rostov Oblast (Ryssland)",
        "tidshorisont": "dagligen",
        "geografiskt_omrade": "ryssland",
        "parter_intressenter": ["ukraina", "ryssland"],
        "syfte": {
          "kategori": "operationellt_mal",
          "beskrivning_sv": "Operationellt mål: Strypa bränslelogistiken för ryska mekaniserade enheter och tvinga ryska armén att sprida ut sina depåer.",
          "beskrivning_en": "Operational goal: Sever fuel supply lines for mechanized units and force Russian logistics to disperse storage depots further behind the frontlines."
        },
        "egenskaper_anfallsmal": "krigsmaterielproduktion",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "Bekräftat genom geolokaliserad video från ryska lokala kanaler, NASA FIRMS värmeanomalier samt officiellt GUR-uttalande.",
          "motivering_en": "Confirmed via geolocated civilian videos in Rostov, NASA FIRMS heat signatures, and official Ukrainian GUR operational statement."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "GUR & GeoConfirmed",
        "kallurl": "https://geoconfirmed.org",
        "kallkategori": "OSINT & Underrättelse",
        "arkiverad": false,
        "tags": ["Drönarangrepp", "Logistik", "Rostov", "GUR", "Bränsledepå"]
      },
      {
        "id": "evt-2026-09-27-03",
        "date": "2026-09-27",
        "timestamp": "2026-09-27T10:45:00+02:00",
        "title_sv": "Intensiva ryska infanteristormningar avvärjda vid Pokrovsk – Ukrainska 47:e brigaden stabiliserar flanken",
        "title_en": "Intense Russian Infantry Assaults Repelled Near Pokrovsk – Ukrainian 47th Brigade Stabilizes Flank",
        "summary_sv": "Enligt DeepState och Generalstabens morgonrapport genomförde ryska styrkor över 34 separata stormningsförsök under det senaste dygnet sydost om Pokrovsk. Ukrainska FPV-drönare och artillerield slog ut 12 bepansrade stridsfordon och tvingade anfallande förband att retirera från en framskjuten skogsdunge.",
        "summary_en": "According to DeepState and the Ukrainian General Staff morning report, Russian forces launched over 34 separate assault attempts in the past 24 hours southeast of Pokrovsk. Ukrainian FPV drone operators and coordinated artillery knocked out 12 armored combat vehicles, repelling the advance.",
        "location_name": "Pokrovsk-sektorn (Donetsk)",
        "tidshorisont": "dagligen",
        "geografiskt_omrade": "fria_ukraina",
        "parter_intressenter": ["ukraina", "ryssland"],
        "syfte": {
          "kategori": "taktiskt_mal",
          "beskrivning_sv": "Taktiskt mål: Rysk strävan att nå logistikvägen T0504 och skära av försörjningslinjerna till Pokrovsk.",
          "beskrivning_en": "Tactical goal: Russian effort to sever highway T0504 and interdict logistics hubs supporting the Pokrovsk pocket."
        },
        "egenskaper_anfallsmal": "militara_resurser",
        "niva_vetskap_sannolikhet": {
          "procent": 85,
          "niva": "hog",
          "motivering_sv": "Hög sannolikhet: Geoverifierade drönarfilmer från 47:e mekaniserade brigaden och samstämmiga rapporter i DeepStateMap.",
          "motivering_en": "High confidence: Geolocated combat footage from the 47th Mechanized Brigade corroborated by DeepStateMap updates."
        },
        "effekt_maluppfyllnad": "avvardad",
        "kalla": "Ukrainas Generalstab & DeepStateMap",
        "kallurl": "https://deepstatemap.live",
        "kallkategori": "OSINT & Officiell rapport",
        "arkiverad": false,
        "tags": ["Pokrovsk", "Markstrid", "FPV-drönare", "Donetsk", "DeepState"]
      },
      {
        "id": "evt-2026-09-27-04",
        "date": "2026-09-27",
        "timestamp": "2026-09-27T09:00:00+02:00",
        "title_sv": "Rysk glidbombsattack mot bostadskvarter och vårdcentral i Charkiv – 16 civila skadade",
        "title_en": "Russian Glide Bomb Strike Hits Residential Apartment Block and Health Clinic in Kharkiv – 16 Civilians Injured",
        "summary_sv": "Ryska flygvapnet fällde tre UMPK-glidbomber (FAB-500) från belgorodskt luftrum mot de norra stadsdelarna i Charkiv. En bomb träffade direkt invid ett 9-vånings bostadshus och skadade en närliggande vårdcentral. Bland de 16 skadade finns tre barn. Inga militära mål fanns inom 2 kilometers radie.",
        "summary_en": "Russian aircraft released three UMPK guided glide bombs (FAB-500) from Belgorod airspace into northern residential quarters of Kharkiv. One bomb impacted immediately adjacent to a 9-story apartment complex and municipal clinic. Sixteen civilians, including three children, sustained injuries. No military facilities exist within 2 km.",
        "location_name": "Charkiv",
        "tidshorisont": "dagligen",
        "geografiskt_omrade": "fria_ukraina",
        "parter_intressenter": ["ryssland", "ukraina"],
        "syfte": {
          "kategori": "akta_syfte",
          "beskrivning_sv": "Äkta syfte: Terrorbombning och psykologisk krigföring i syfte att göra Ukrainas näst största stad obeboelig och framkalla flyktingvågor.",
          "beskrivning_en": "Underlying purpose: Terror bombing and psychological attrition aimed at depopulating Ukraine's second largest city and spurring migration."
        },
        "egenskaper_anfallsmal": "helt_civila",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "Verifierad: Borgmästare Ihor Terechov, Charkivs åklagarmyndighet och internationella journalister på plats med fotodokumentation.",
          "motivering_en": "Verified: Mayor Ihor Terekhov, Kharkiv regional prosecutor, and international photojournalists on site."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "Charkivs Åklagarmyndighet & Suspilne",
        "kallurl": "https://suspilne.media",
        "kallkategori": "Officiell civil part & Public Service",
        "arkiverad": false,
        "tags": ["Civila mål", "Glidbomb", "Krigsbrott", "Charkiv", "FAB-500"]
      },
      {
        "id": "evt-2026-09-27-05",
        "date": "2026-09-27",
        "timestamp": "2026-09-27T07:45:00+02:00",
        "title_sv": "EU och Storbritannien godkänner nytt stödpaket på 3,5 miljarder euro finansierat av frysta ryska tillgångar",
        "title_en": "EU and UK Approve €3.5 Billion Tranche Backed by Frozen Russian Sovereign Assets",
        "summary_sv": "EU-kommissionen och brittiska finansdepartementet formaliserade det första låneutbetalningssteget från G7:s initiativ kopplat till räntor på ryska centralbankens frysta tillgångar. Medlen öronmärks direkt till inköp av ukrainsktillverkad artilleriammunition och reparationsmateriel för kraftnätet.",
        "summary_en": "The European Commission and HM Treasury finalized terms for a €3.5 billion financing tranche derived from the windfall profits of immobilized Russian Central Bank assets under the G7 framework. Funds are earmarked for direct procurement of Ukrainian-manufactured artillery shells and power grid repair hardware.",
        "location_name": "Bryssel & London",
        "tidshorisont": "dagligen",
        "geografiskt_omrade": "eu_ees",
        "parter_intressenter": ["eu", "uk", "ukraina", "ryssland"],
        "syfte": {
          "kategori": "strategiskt_mal",
          "beskrivning_sv": "Strategiskt mål: Etablera en långsiktigt hållbar finansieringsmekanism för Ukrainas försvarsindustri som belastar ryska staten ekonomiskt.",
          "beskrivning_en": "Strategic goal: Institutionalize sustainable defense financing for Ukraine's domestic weapons production financed directly by Russian state assets."
        },
        "egenskaper_anfallsmal": "diplomatiskt_politiskt",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "Bekräftad: Officiellt pressmeddelande från Europeiska kommissionen och brittiska regeringen.",
          "motivering_en": "Confirmed: Official joint communique from the European Commission and UK Government."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "EU-kommissionen & UK Gov",
        "kallurl": "https://ec.europa.eu",
        "kallkategori": "Officiell allierad institution",
        "arkiverad": false,
        "tags": ["Bistånd", "Frysta tillgångar", "EU", "Storbritannien", "Ekonomi"]
      },
      {
        "id": "evt-2026-09-27-06",
        "date": "2026-09-27",
        "timestamp": "2026-09-27T06:15:00+02:00",
        "title_sv": "Svarta havets exportkorridor slog nytt månadsskeppningsrekord – 6,2 miljoner ton spannmål och gods",
        "title_en": "Black Sea Maritime Corridor Reaches Record 6.2 Million Metric Tons Shipped Despite Russian Blockade Threats",
        "summary_sv": "Ukrainas infrastrukturdepartement meddelar att den autonoma ukrainska sjökorridoren genom västra Svarta havet under senaste 30-dagarsperioden transporterat 6,2 miljoner ton jordbruksprodukter och metaller. Ryska flottan hålls effektivt borta från västra Svarta havet tack vare ukrainska sjödrönare (Magura V5) och sjömålsrobotar (Neptune).",
        "summary_en": "Ukraine's Ministry for Restoration reports that the unilateral maritime corridor through the western Black Sea achieved a monthly throughput of 6.2 million tons of agricultural and industrial goods. The Russian Black Sea Fleet remains effectively quarantined from western waters due to Ukrainian naval drone operations (Magura V5) and shore-based Neptune anti-ship systems.",
        "location_name": "Odessa & Svarta havet",
        "tidshorisont": "dagligen",
        "geografiskt_omrade": "ukrainas_granser",
        "parter_intressenter": ["ukraina", "ovriga_varlden", "ryssland"],
        "syfte": {
          "kategori": "resultatmal",
          "beskrivning_sv": "Resultatmål: Upprätthålla Ukrainas kommersiella livsnerv och exportintäkter oberoende av ryska avtal.",
          "beskrivning_en": "Outcome goal: Preserve Ukraine's commercial maritime artery and export revenue streams independent of Russian veto or extortion."
        },
        "egenskaper_anfallsmal": "civil_infrastruktur",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "Bekräftad genom AIS-fartygsspårning, hamnloggar i Odesa samt internationella sjöförsäkringsdata.",
          "motivering_en": "Confirmed by commercial AIS vessel telemetry, Odesa port manifests, and Lloyd's maritime underwriting registries."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "Infrastrukturministeriet & Lloyd's List",
        "kallurl": "https://mtu.gov.ua",
        "kallkategori": "Officiell myndighet & Sjöfartsdata",
        "arkiverad": false,
        "tags": ["Svarta havet", "Spannmål", "Odesa", "Sjödrönare", "Ekonomi"]
      }
    ];

    this.archive = [
      {
        "id": "evt-2026-09-26-01",
        "date": "2026-09-26",
        "timestamp": "2026-09-26T18:20:00+02:00",
        "title_sv": "Ukrainska långdistansdrönare slog ut stor ammunitionsdepå i Toropets (Tver oblast)",
        "title_en": "Ukrainian Deep Strike Demolishes Major 107th GRAU Munitions Arsenal in Toropets",
        "summary_sv": "Ukrainas säkerhetstjänst (SBU) och GUR genomförde ett samordnat angrepp med över 100 ukrainsktillverkade attackdrönare mot den 107:e GRAU-huvudarsenalen i Toropets. Sekundärexplosionerna registrerades som seismiska skakningar med magnitud 2,8 och orsakade en massiv detonation av robotar av typen Iskander, Totjka-U och nordkoreanska KN-23.",
        "summary_en": "Coordinated strikes by the SBU and Ukrainian GUR using over 100 domestic long-range drones struck Russia's 107th GRAU arsenal in Toropets. Secondary detonations registered as a magnitude 2.8 earthquake, obliterating significant stockpiles of Iskander ballistic missiles, Tochka-U systems, and North Korean KN-23 munitions.",
        "location_name": "Toropets (Tver oblast, Ryssland)",
        "tidshorisont": "veckovis",
        "geografiskt_omrade": "ryssland",
        "parter_intressenter": ["ukraina", "ryssland"],
        "syfte": {
          "kategori": "effektmal",
          "beskrivning_sv": "Effektmål: Radikalt minska tillgången på ballistiska robotar och artillerigranater vid de aktiva frontavsnitten.",
          "beskrivning_en": "Effect goal: Drastically degrade operational availability of ballistic missiles and heavy artillery rounds along eastern fronts."
        },
        "egenskaper_anfallsmal": "krigsmaterielproduktion",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "100% Verifierad: Maxar-satellitbilder, seismiska mätningar från NORSAR och geolokaliserade videor på explosionerna.",
          "motivering_en": "100% Confirmed: High-resolution Maxar satellite imagery, NORSAR seismic tracking, and geolocated video footage."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "Maxar Technologies & ISW",
        "kallurl": "https://understandingwar.org",
        "kallkategori": "Satellit & Underrättelse",
        "arkiverad": true,
        "tags": ["Arsenal", "GRAU", "Toropets", "SBU", "GUR"]
      },
      {
        "id": "evt-2026-09-25-01",
        "date": "2026-09-25",
        "timestamp": "2026-09-25T15:40:00+02:00",
        "title_sv": "Ryskt missilangrepp mot civil stormarknad och bageri i Kostiantynivka – 14 döda",
        "title_en": "Russian Missile Strike on Civilian Supermarket and Bakery in Kostiantynivka – 14 Dead",
        "summary_sv": "En rysk Kh-38-missil träffade en fullsatt stormarknad mitt på dagen i Kostiantynivka, Donetsk oblast. Byggnaden totalförstördes och 14 civila dödades, varav två barn, medan 44 skadades. Det fanns inga militära mål i kvarteret.",
        "summary_en": "A Russian air-to-surface Kh-38 missile struck a bustling supermarket and adjoining bakery in central Kostiantynivka, Donetsk Oblast. Fourteen civilians including two children were killed and 44 injured. The target was strictly commercial and civilian.",
        "location_name": "Kostiantynivka (Donetsk)",
        "tidshorisont": "veckovis",
        "geografiskt_omrade": "fria_ukraina",
        "parter_intressenter": ["ryssland", "ukraina"],
        "syfte": {
          "kategori": "akta_syfte",
          "beskrivning_sv": "Äkta syfte: Skrämma bort befolkningen från frontnära städer och skapa kaos i civil logistik.",
          "beskrivning_en": "Underlying purpose: Demoralize and depopulate frontline support communities, dismantling local food supply chains."
        },
        "egenskaper_anfallsmal": "helt_civila",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "100% Verifierad: Räddningsarbetet dokumenterat av FN:s människorättskontor (OHCHR) och internationell press på plats.",
          "motivering_en": "100% Confirmed: Rescue operations documented by UN OHCHR monitors and international photojournalists."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "FN OHCHR & Kyiv Independent",
        "kallurl": "https://kyivindependent.com",
        "kallkategori": "FN-organ & Oberoende media",
        "arkiverad": true,
        "tags": ["Krigsbrott", "Civila offer", "Donetsk", "FN", "OHCHR"]
      },
      {
        "id": "evt-2026-09-20-01",
        "date": "2026-09-20",
        "timestamp": "2026-09-20T17:00:00+02:00",
        "title_sv": "Ukrainskt robotanfall mot ryska S-400 Triumf-luftvärnsställningar på ockuperade Krym",
        "title_en": "Ukrainian ATACMS Strike Destroys Russian S-400 Triumf Air Defense Complex in Occupied Crimea",
        "summary_sv": "Geolokaliserade satellitbilder bekräftar att ett ukrainskt anfall med ATACMS-robotar slog ut en 92N6E-radar och minst två avfyrningsramper tillhörande ett modernt S-400-batteri nära Sevastopol.",
        "summary_en": "Geolocated satellite imagery verifies that a coordinated Ukrainian ATACMS strike knocked out a 92N6E target acquisition radar and at least two launcher vehicles of an S-400 complex near Sevastopol.",
        "location_name": "Sevastopol (Ockuperade Krym)",
        "tidshorisont": "manadsvis",
        "geografiskt_omrade": "ockuperade_ukraina",
        "parter_intressenter": ["ukraina", "ryssland"],
        "syfte": {
          "kategori": "operationellt_mal",
          "beskrivning_sv": "Operationellt mål: Slå hål i den ryska luftförsvarsbubblan över Krym för att möjliggöra djupangrepp mot logistik.",
          "beskrivning_en": "Operational goal: Degrade Russian integrated air defense coverage over the Crimean peninsula, clearing flight avenues for drone salvos."
        },
        "egenskaper_anfallsmal": "militara_resurser",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "100% Verifierad: Planet Labs satellitbilder analyserade av Radio Free Europe och GeoConfirmed.",
          "motivering_en": "100% Verified: Planet Labs multispectral satellite before/after imagery verified by GeoConfirmed analysts."
        },
        "effekt_maluppfyllnad": "fullbordad",
        "kalla": "GeoConfirmed & Radio Free Europe",
        "kallurl": "https://geoconfirmed.org",
        "kallkategori": "OSINT & Satellitverifiering",
        "arkiverad": true,
        "tags": ["Krym", "ATACMS", "S-400", "Luftvärn", "Sevastopol"]
      },
      {
        "id": "evt-2026-09-08-01",
        "date": "2026-09-08",
        "timestamp": "2026-09-08T08:15:00+02:00",
        "title_sv": "Ukrainska operationer i Kursk oblast tvingar Ryssland att omplacera 40 000 soldater från Donbass",
        "title_en": "Ukrainian Kursk Operation Forces Moscow to Divert 40,000 Troops from Eastern Theaters",
        "summary_sv": "General Oleksandr Syrskyj och ISW rapporterar att den ukrainska buffertzonen i Kursk oblast framgångsrikt har dragit ryska elitreserver (marininfanteri och VDV) bort från offensiverna mot Toretsk och Kupiansk.",
        "summary_en": "Commander-in-Chief Oleksandr Syrskyi and ISW assess that the Ukrainian operational buffer zone in Kursk Oblast has diverted approximately 40,000 Russian troops away from Toretsk and Kupiansk axes.",
        "location_name": "Kursk Oblast (Ryssland)",
        "tidshorisont": "manadsvis",
        "geografiskt_omrade": "ryssland",
        "parter_intressenter": ["ukraina", "ryssland"],
        "syfte": {
          "kategori": "operationellt_mal",
          "beskrivning_sv": "Operationellt mål: Tvinga rysk militärledning att föra kriget på eget territorium och avlasta försvarslinjer i öster.",
          "beskrivning_en": "Operational goal: Impose dilemmas on Russian command by forcing combat onto Russian soil, thereby diluting mechanized thrusts in the Donbas."
        },
        "egenskaper_anfallsmal": "militara_resurser",
        "niva_vetskap_sannolikhet": {
          "procent": 100,
          "niva": "bekraftad",
          "motivering_sv": "Verifierad: Geoverifierade ryska och ukrainska stridsvideor och ISW:s kontinuerliga rapportering.",
          "motivering_en": "Verified: Cross-referenced geolocated combat video, satellite ground truth, and comprehensive ISW campaign tracking."
        },
        "effekt_maluppfyllnad": "delvis",
        "kalla": "ISW & DeepStateMap",
        "kallurl": "https://understandingwar.org",
        "kallkategori": "Militär analys",
        "arkiverad": true,
        "tags": ["Kursk", "Syrskyj", "Manöverkrig", "Buffertzon", "ISW"]
      }
    ];

    this.sources = [
      {
        "id": "general-staff-ua",
        "name": "Ukrainas Generalstab (General Staff of AFU)",
        "category": "official_ua",
        "tier": "Primärkälla",
        "url": "https://www.facebook.com/GeneralStaff.ua",
        "credibility": "Hög (Operativ militär part)",
        "description_sv": "Dagliga morgon- och kvällsuppdateringar om frontlinjen och ryska materielförluster.",
        "description_en": "Daily operational briefings on frontline engagements and equipment attrition."
      },
      {
        "id": "isw",
        "name": "Institute for the Study of War (ISW)",
        "category": "intelligence",
        "tier": "Sekundärkälla / Analys",
        "url": "https://understandingwar.org",
        "credibility": "Mycket hög (Forskningsinstitut)",
        "description_sv": "Världsledande dagliga lägesrapporter med noggrann geolokalisering av frontsektorer.",
        "description_en": "World-leading daily operational assessments with geolocated frontline mapping."
      },
      {
        "id": "deepstate",
        "name": "DeepStateMap",
        "category": "osint",
        "tier": "Primärkälla / OSINT",
        "url": "https://deepstatemap.live",
        "credibility": "Mycket hög (Strikt verifiering)",
        "description_sv": "Realtidskarta över frontlinjen, framryckningar och befriade områden.",
        "description_en": "Authoritative open-source frontline map documenting territorial control."
      },
      {
        "id": "kyiv-independent",
        "name": "The Kyiv Independent",
        "category": "independent_media",
        "tier": "Oberoende nyhetsmedium",
        "url": "https://kyivindependent.com",
        "credibility": "Hög (Oberoende granskning)",
        "description_sv": "Ukrainas främsta oberoende engelskspråkiga redaktion med djupgående journalistik.",
        "description_en": "Leading independent Ukrainian media outlet delivering 24/7 on-the-ground reporting."
      },
      {
        "id": "svt-ukraina",
        "name": "SVT Nyheter – Ukrainakriget",
        "category": "independent_media",
        "tier": "Svensk Public Service",
        "url": "https://www.svt.se/nyheter/om/ukraina",
        "credibility": "Mycket hög (Svensk public service)",
        "description_sv": "Svensk bevakning med fokus på konsekvenser för Sverige och säkerhetsläget i närområdet.",
        "description_en": "Swedish public broadcaster providing Nordic-focused analysis and verified war reports."
      }
    ];

    this.sourceCategories = [
      { "id": "official_ua", "name_sv": "Officiella Ukrainska Myndigheter", "name_en": "Official Ukrainian Authorities" },
      { "id": "intelligence", "name_sv": "Militära Underrättelsetjänster & Think Tanks", "name_en": "Military Intelligence & Think Tanks" },
      { "id": "osint", "name_sv": "OSINT & Geolokalisering", "name_en": "OSINT & Geolocation" },
      { "id": "independent_media", "name_sv": "Oberoende Nyhetsmedier", "name_en": "Independent Media" }
    ];

    this.statistics = {
      "daily_metrics": {
        "shahed_interception_rate_percent": 87.8,
        "frontline_skirmishes_24h": 164
      }
    };
  }
};
