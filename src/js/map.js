/**
 * map.js
 * Interaktiv taktisk och strategisk karta över Ukraina och regionen.
 * Stödjer två lägen:
 * 1. Taktisk frontkarta (24 timmar) – Fokus på frontlinjesektorer och direkta markstrider.
 * 2. Strategisk luftkrigskarta (30 dagar) – Visar Ukrainas och Rysslands luftkrig på djupet,
 *    räckviddszoner, ammunitionsarsenaler (GRAU), oljeraffinaderier, flygbaser och energinät.
 */

const TacticalMap = {
  containerId: "tactical-map-container",
  mode: "strategic", // Standardläge: strategisk översiktskarta
  strategicFilter: "alla",
  selectedTargetId: "toropets",

  // Strategiska anfallsmål över de senaste 30 dagarna
  strategicTargets: [
    {
      id: "toropets",
      name_sv: "Toropets – 107:e GRAU-arsenalen",
      name_en: "Toropets – 107th GRAU Arsenal",
      oblast_sv: "Tver oblast, Ryssland",
      oblast_en: "Tver Oblast, Russia",
      category: "ammunition",
      side: "ukraina_djupanfall",
      coords: { x: 360, y: 110 },
      distance_km: 480,
      weapon_sv: "Ukrainska Liutyi & Palianytsia långdistansdrönare",
      weapon_en: "Ukrainian Liutyi & Palianytsia long-range strike drones",
      impact_sv: "Katastrofal detonation som gav seismiskt utslag på magnitud 2,8. Över 60 ammunitionsbunkrar med Iskander-, Totjka-U- och nordkoreanska KN-23-robotar totalförstördes.",
      impact_en: "Catastrophic blast generating a magnitude 2.8 seismic event. Over 60 hardened bunkers containing Iskander, Tochka-U, and North Korean KN-23 missiles obliterated.",
      date: "2026-09-18",
      verification_sv: "Bekräftad av NASA FIRMS värmesatelliter, ESA Sentinel-2 och seismologiska stationer.",
      verification_en: "Confirmed by NASA FIRMS thermal telemetry, ESA Sentinel-2 imagery, and seismic arrays.",
      source_name: "Frontelligence Insight & Maxar",
      source_url: "https://frontelligence.substack.com"
    },
    {
      id: "tikhoretsk",
      name_sv: "Tikhoretsk – 719:e artilleribas",
      name_en: "Tikhoretsk – 719th Artillery Munitions Base",
      oblast_sv: "Krasnodar Kraj, Ryssland",
      oblast_en: "Krasnodar Krai, Russia",
      category: "ammunition",
      side: "ukraina_djupanfall",
      coords: { x: 530, y: 460 },
      distance_km: 320,
      weapon_sv: "Ukrainska långdistansdrönare",
      weapon_en: "Ukrainian long-range strike drones",
      impact_sv: "Sekundärexplosioner efter träff i central ammunitionsknutpunkt för nordkoreansk ammunition (152 mm och KN-23) till södra frontavsnittet.",
      impact_en: "Extensive secondary detonations following strikes on key logistical transfer node for North Korean 152mm shells and KN-23 missiles destined for the southern front.",
      date: "2026-09-21",
      verification_sv: "Bekräftat av satellitbilder och lokala myndigheters evakueringsorder för byn Kamenny.",
      verification_en: "Confirmed by satellite imagery and local emergency evacuation orders for Kamenny settlement.",
      source_name: "Ukrainas Generalstab & OSINT",
      source_url: "https://t.me/GeneralStaffZSU"
    },
    {
      id: "karachev",
      name_sv: "Karatsjev – 67:e GRAU-arsenalen",
      name_en: "Karachev – 67th GRAU Arsenal",
      oblast_sv: "Brjansk oblast, Ryssland",
      oblast_en: "Bryansk Oblast, Russia",
      category: "ammunition",
      side: "ukraina_djupanfall",
      coords: { x: 385, y: 220 },
      distance_km: 115,
      weapon_sv: "Modifierade Neptun-robotar och attackdrönare",
      weapon_en: "Modified Neptune cruise missiles and strike drones",
      impact_sv: "Flera lagerbyggnader i brand efter nattlig attack. Depån förvarade glidbomber (KAB) och artillerigranater för Grupp Nord.",
      impact_en: "Multiple storage sheds set ablaze in night strike. Depot housed glide bomb (KAB) guidance kits and artillery rounds for Group North.",
      date: "2026-09-23",
      verification_sv: "Bekräftat via NASA FIRMS brandsatelliter och lokala invånares videofilmer.",
      verification_en: "Confirmed via NASA FIRMS fire sensors and resident footage.",
      source_name: "Ukrainas militära underrättelsetjänst (HUR)",
      source_url: "https://gur.gov.ua"
    },
    {
      id: "engels",
      name_sv: "Engels-2 – Strategisk flygbas",
      name_en: "Engels-2 – Strategic Bomber Base",
      oblast_sv: "Saratov oblast, Ryssland",
      oblast_en: "Saratov Oblast, Russia",
      category: "flygbaser",
      side: "ukraina_djupanfall",
      coords: { x: 720, y: 290 },
      distance_km: 650,
      weapon_sv: "Ukrainska Liutyi attackdrönare",
      weapon_en: "Ukrainian Liutyi strike UAVs",
      impact_sv: "Upprepade drönaranfall tvingade Ryssland att sprida Tu-95MS- och Tu-160-bombplan norrut till Olenya vid Kolahalvön, vilket förlängt flygtiden inför anfall.",
      impact_en: "Repeated drone strikes forced Russia to disperse Tu-95MS and Tu-160 strategic bombers north to Olenya in the Kola Peninsula, increasing flight alert times.",
      date: "2026-09-20",
      verification_sv: "Satellitbilder visar utspridning av flygplan och skyddsvallar av bildäck.",
      verification_en: "Satellite photos verify aircraft dispersion and protective tire coverings.",
      source_name: "Planet Labs & ISW",
      source_url: "https://www.understandingwar.org"
    },
    {
      id: "morozovsk",
      name_sv: "Morozovsk – Taktisk flygbas",
      name_en: "Morozovsk – Tactical Airbase",
      oblast_sv: "Rostov oblast, Ryssland",
      oblast_en: "Rostov Oblast, Russia",
      category: "flygbaser",
      side: "ukraina_djupanfall",
      coords: { x: 575, y: 380 },
      distance_km: 270,
      weapon_sv: "Svärmar av ukrainska FPV- och långdistansdrönare",
      weapon_en: "Swarms of Ukrainian FPV and strike drones",
      impact_sv: "Totalförstörd ammunitionsdepå för KAB-glidbomber och skador på Su-34 attackplan i hangarer. Avsevärt minskat tempo för ryska glidbombningar mot Pokrovsk.",
      impact_en: "Total destruction of KAB glide bomb munitions warehouse and damage to Su-34 strike aircraft. Significantly reduced glide bomb sortie rates near Pokrovsk.",
      date: "2026-09-08",
      verification_sv: "Satellitbilder från Planet Labs visar total utbränning av ammunitionsbunkern.",
      verification_en: "Planet Labs imagery shows full burnout of the munitions bunker.",
      source_name: "HUR & GeoConfirmed",
      source_url: "https://geoconfirmed.org"
    },
    {
      id: "savasleyka",
      name_sv: "Savaslejka – MiG-31K flygbas",
      name_en: "Savasleyka – MiG-31K Interceptor Base",
      oblast_sv: "Nizjnij Novgorod oblast, Ryssland",
      oblast_en: "Nizhny Novgorod Oblast, Russia",
      category: "flygbaser",
      side: "ukraina_djupanfall",
      coords: { x: 620, y: 155 },
      distance_km: 680,
      weapon_sv: "Långdistansdrönare med formad sprängladdning",
      weapon_en: "Long-range strike drones with shaped explosive warheads",
      impact_sv: "Träffar mot bränsledepå och flygledningstorn för Rysslands Kinzhal-bärande MiG-31K-plan. Minst 1 MiG-31K och 2 Il-76 skadade enligt underrättelser.",
      impact_en: "Strikes on fuel storage and control tower for Kinzhal-capable MiG-31K aircraft. At least 1 MiG-31K and 2 Il-76 transports damaged according to intelligence.",
      date: "2026-09-12",
      verification_sv: "Bekräftat av ukrainska underrättelsetjänsten HUR och geolokaliserade videor.",
      verification_en: "Confirmed by HUR intelligence briefs and geolocated ground video.",
      source_name: "HUR",
      source_url: "https://gur.gov.ua"
    },
    {
      id: "proletarsk",
      name_sv: "Proletarsk – Kavkaz oljedepå",
      name_en: "Proletarsk – Kavkaz Oil Depot",
      oblast_sv: "Rostov oblast, Ryssland",
      oblast_en: "Rostov Oblast, Russia",
      category: "olja_bransle",
      side: "ukraina_djupanfall",
      coords: { x: 590, y: 420 },
      distance_km: 380,
      weapon_sv: "Ukrainska långdistansdrönare",
      weapon_en: "Ukrainian long-range strike drones",
      impact_sv: "Brann oavbrutet i över 16 dygn. Fler än 32 stora diesel- och fotogencisterner totalförstördes, vilket orsakade akut bränslebrist för ryska trupper i södra operationsområdet.",
      impact_en: "Burned continuously for over 16 days. More than 32 massive diesel and fuel tanks destroyed, triggering severe fuel constraints for Russian southern grouping.",
      date: "2026-09-02",
      verification_sv: "Satellitbilder och FIRMS registrerade massiva rökpelare över hela Rostov oblast.",
      verification_en: "Satellite images and FIRMS tracked massive smoke plumes across Rostov Oblast.",
      source_name: "Radio Free Europe / Svoboda & FIRMS",
      source_url: "https://www.svoboda.org"
    },
    {
      id: "ryazan",
      name_sv: "Rjazan – Rosneft oljeraffinaderi",
      name_en: "Ryazan – Rosneft Oil Refinery",
      oblast_sv: "Rjazan oblast, Ryssland",
      oblast_en: "Ryazan Oblast, Russia",
      category: "olja_bransle",
      side: "ukraina_djupanfall",
      coords: { x: 505, y: 195 },
      distance_km: 490,
      weapon_sv: "Ukrainska Bober-drönare",
      weapon_en: "Ukrainian Bober strike UAVs",
      impact_sv: "Primärdestillationstornet AVT-6 träffat och skadat. Rysslands tredje största raffinaderi tvingades sänka produktionstakten med ca 40%.",
      impact_en: "Direct hit on the AVT-6 primary crude distillation unit. Russia's third largest refinery forced to reduce throughput by approximately 40%.",
      date: "2026-09-15",
      verification_sv: "Bekräftat av geoverifierade videofilmer och satellitdata.",
      verification_en: "Confirmed by geoverified footage and satellite infrared tracking.",
      source_name: "Reuters & Kommersant",
      source_url: "https://www.reuters.com"
    },
    {
      id: "kaluga",
      name_sv: "Kaluga – Bränslelager & drönarnod",
      name_en: "Kaluga – Fuel Storage & Drone Hub",
      oblast_sv: "Kaluga oblast, Ryssland",
      oblast_en: "Kaluga Oblast, Russia",
      category: "olja_bransle",
      side: "ukraina_djupanfall",
      coords: { x: 415, y: 185 },
      distance_km: 320,
      weapon_sv: "Ukrainska drönare",
      weapon_en: "Ukrainian strike drones",
      impact_sv: "Attackdrönarbas och oljedepå sattes i brand. Störningar i regional järnvägstrafik och flyglarm vid Kaluga-Grabtsevo flygplats.",
      impact_en: "Strike drone base and fuel storage set ablaze. Caused temporary halt in local railway logistics and air raid shutdown at Grabtsevo airport.",
      date: "2026-09-28",
      verification_sv: "Bekräftat av regional guvernör Vladislav Sjapsja och Cornucopia.se.",
      verification_en: "Confirmed by regional governor Vladislav Shapsha and independent analysts.",
      source_name: "Cornucopia.se & Astra",
      source_url: "https://cornucopia.se"
    },
    {
      id: "tula",
      name_sv: "Tula – Vapenfabriker Bazalt & Splav",
      name_en: "Tula – Bazalt & Splav Munitions Plants",
      oblast_sv: "Tula oblast, Ryssland",
      oblast_en: "Tula Oblast, Russia",
      category: "vapenindustri",
      side: "ukraina_djupanfall",
      coords: { x: 455, y: 200 },
      distance_km: 350,
      weapon_sv: "Precisionsträff med drönare",
      weapon_en: "Precision drone strike",
      impact_sv: "Verkstäder tillhörande Bazalt och Splav (tillverkare av Grad-, Uragan- och Smertj-raketer samt luftvärn) träffade under natten till 28 september.",
      impact_en: "Workshops belonging to Bazalt and Splav (producers of Grad, Uragan, and Smerch rocket systems and air defenses) struck overnight September 28.",
      date: "2026-09-28",
      verification_sv: "Rapporterat av ryska Telegram-kanaler (Baza, Astra) och bekräftat i Cornucopias lägesrapport.",
      verification_en: "Reported by Russian Telegram monitoring channels (Baza, Astra) and confirmed in battlefield briefs.",
      source_name: "Cornucopia.se & Astra",
      source_url: "https://cornucopia.se"
    },
    {
      id: "voronezh",
      name_sv: "Voronezj – Militärelektronikfabrik",
      name_en: "Voronezh – Military Electronics Plant",
      oblast_sv: "Voronezj oblast, Ryssland",
      oblast_en: "Voronezh Oblast, Russia",
      category: "vapenindustri",
      side: "ukraina_djupanfall",
      coords: { x: 505, y: 275 },
      distance_km: 220,
      weapon_sv: "Ukrainska attackdrönare",
      weapon_en: "Ukrainian strike drones",
      impact_sv: "Produktionslokal för mikrovågsledningar och radarstörningsutrustning träffad. Brand utbröt på fabriksområdet.",
      impact_en: "Production workshop manufacturing microwave modules and radar jamming components struck. Fire confirmed across industrial plant.",
      date: "2026-09-28",
      verification_sv: "Bekräftat av Voronezjs guvernör Aleksandr Gusev.",
      verification_en: "Confirmed by Voronezh Governor Aleksandr Gusev.",
      source_name: "Ukrinform & Astra",
      source_url: "https://www.ukrinform.net"
    },
    {
      id: "alabuga",
      name_sv: "Jelabuga (Alabuga) – Shahed-fabrik",
      name_en: "Yelabuga (Alabuga) – Shahed Drone Factory",
      oblast_sv: "Tatarstan, Ryssland",
      oblast_en: "Tatarstan, Russia",
      category: "vapenindustri",
      side: "ukraina_djupanfall",
      coords: { x: 860, y: 140 },
      distance_km: 1250,
      weapon_sv: "Modifierade ultralätta flygplan (Aeroprakt A-22) konverterade till drönare",
      weapon_en: "Modified ultralight aircraft (Aeroprakt A-22) converted into autonomous drones",
      impact_sv: "Demonstrerade Ukrainas förmåga att slå till mer än 1 200 km djupt in i Ryssland. Träffade studentboenden och monteringshallar i den särskilda ekonomiska zonen Alabuga.",
      impact_en: "Demonstrated Ukraine's ability to strike over 1,200 km deep into Russian territory. Struck assembly dormitories in the Alabuga Special Economic Zone.",
      date: "2026-09-10",
      verification_sv: "Geoverifierade videofilmer och satellitbekräftelse.",
      verification_en: "Geolocated impact footage and satellite imagery confirmation.",
      source_name: "Meduza & HUR",
      source_url: "https://meduza.io"
    },
    {
      id: "trypilska",
      name_sv: "Trypilska värmekraftverk (Kyjiv)",
      name_en: "Trypilska Thermal Power Plant (Kyiv)",
      oblast_sv: "Kyjiv oblast, Ukraina",
      oblast_en: "Kyiv Oblast, Ukraine",
      category: "ukrainskt_energinat",
      side: "ryssland_energiangrepp",
      coords: { x: 265, y: 310 },
      distance_km: 0,
      weapon_sv: "Ryska Kh-69 och Kh-101 kryssningsrobotar",
      weapon_en: "Russian Kh-69 and Kh-101 cruise missiles",
      impact_sv: "Turbinhallen totalförstördes vid massiv robotinsats. Största elproducenten i Kyjiv-regionen (1 800 MW) slogs ut helt. Kräver omfattande reservinfrastruktur och decentraliserade generatorer.",
      impact_en: "Turbine hall completely destroyed in saturated missile strike. Largest power generator in Kyiv region (1,800 MW) totally disabled, necessitating decentralized backup generators.",
      date: "2026-09-14",
      verification_sv: "Bekräftat av Centrenergo och Ukrainas energidepartement.",
      verification_en: "Confirmed by Centrenergo and Ukrainian Ministry of Energy.",
      source_name: "Ukrainska Energidepartementet",
      source_url: "https://mpe.gov.ua"
    },
    {
      id: "dniprohes",
      name_sv: "DniproHES – Vattenkraftverk (Zaporizjzja)",
      name_en: "DniproHES – Hydroelectric Station (Zaporizhzhia)",
      oblast_sv: "Zaporizjzja oblast, Ukraina",
      oblast_en: "Zaporizhzhia Oblast, Ukraine",
      category: "ukrainskt_energinat",
      side: "ryssland_energiangrepp",
      coords: { x: 420, y: 375 },
      distance_km: 0,
      weapon_sv: "Ryska aeroballistiska Kinzhal- och Iskander-M-robotar",
      weapon_en: "Russian Kinzhal aeroballistic and Iskander-M missiles",
      impact_sv: "Allvarliga skador på transformatorstationer och HPP-2-maskinhallen. Dammkroppen är stabil, men kraftproduktionen är kraftigt reducerad.",
      impact_en: "Severe damage to transmission transformers and HPP-2 machine hall. Dam wall remains intact, but hydroelectric generation output significantly reduced.",
      date: "2026-09-19",
      verification_sv: "Bekräftat av Ukrhydroenergo och geolokaliserade videor på brandrök över fördämningen.",
      verification_en: "Confirmed by Ukrhydroenergo and geolocated footage of smoke rising over dam.",
      source_name: "Ukrhydroenergo",
      source_url: "https://uhe.gov.ua"
    },
    {
      id: "stryj",
      name_sv: "Stryj – Underjordisk gaslagringsanläggning",
      name_en: "Stryj – Underground Gas Storage Facility",
      oblast_sv: "Lviv oblast, Ukraina",
      oblast_en: "Lviv Oblast, Ukraine",
      category: "ukrainskt_energinat",
      side: "ryssland_energiangrepp",
      coords: { x: 130, y: 300 },
      distance_km: 0,
      weapon_sv: "Kinzhal-robotar och Kh-101",
      weapon_en: "Kinzhal missiles and Kh-101",
      impact_sv: "Angrepp mot ovanjordskompressorer vid Europas största underjordiska naturgaslager (Biltje-Volytsko-Uherske). De underjordiska reservoarerna (50–100 m djup) förblev intakta.",
      impact_en: "Strikes against surface compressor infrastructure at Europe's largest underground natural gas storage (Bilche-Volytsko-Uherske). Underground reservoirs remain unaffected.",
      date: "2026-09-16",
      verification_sv: "Bekräftat av Naftogaz och ukrainska luftförsvarsledningen.",
      verification_en: "Confirmed by Naftogaz and Ukrainian Air Force command.",
      source_name: "Naftogaz",
      source_url: "https://www.naftogaz.com"
    },
    {
      id: "kharkiv_grid",
      name_sv: "Charkiv – CHPP-5 & energiställverk",
      name_en: "Kharkiv – CHPP-5 & Electrical Substations",
      oblast_sv: "Charkiv oblast, Ukraina",
      oblast_en: "Kharkiv Oblast, Ukraine",
      category: "ukrainskt_energinat",
      side: "ryssland_energiangrepp",
      coords: { x: 415, y: 260 },
      distance_km: 0,
      weapon_sv: "Kombination av Iskander-robotar och Shahed-136 drönarsvärmar",
      weapon_en: "Combination of Iskander ballistic missiles and Shahed-136 drone swarms",
      impact_sv: "Återkommande angrepp har förstört samtliga transformatorblock i staden. Charkiv förlitar sig på ö-drift och mikronät från mobila gasturbiner inför vintern.",
      impact_en: "Repeated strikes destroyed all main transformer blocks. Kharkiv now operates on islanded microgrid setups powered by mobile gas turbines ahead of winter.",
      date: "2026-09-24",
      verification_sv: "Bekräftat av borgmästare Ihor Terechov och Ukrenergo.",
      verification_en: "Confirmed by Mayor Ihor Terekhov and Ukrenergo dispatch center.",
      source_name: "Ukrenergo & DSNS",
      source_url: "https://ua.energy"
    }
  ],

  init(containerId) {
    if (containerId) this.containerId = containerId;
    this.render();
  },

  setMode(newMode) {
    this.mode = newMode;
    this.render();
  },

  setStrategicFilter(cat) {
    this.strategicFilter = cat;
    this.render();
  },

  selectTarget(targetId) {
    this.selectedTargetId = targetId;
    this.render();
  },

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const lang = getLang();
    const isEn = lang === "en";

    if (this.mode === "strategic") {
      this.renderStrategicView(container, isEn);
    } else {
      this.renderTacticalView(container, isEn);
    }
  },

  // 1. STRATEGISK LUFTKRIGSKARTA (30 DAGAR)
  renderStrategicView(container, isEn) {
    const filter = this.strategicFilter;
    const targets = this.strategicTargets.filter(t => {
      if (filter === "alla") return true;
      return t.category === filter;
    });

    const activeTarget = this.strategicTargets.find(t => t.id === this.selectedTargetId) || targets[0] || this.strategicTargets[0];

    const categoryTabs = [
      { id: "alla", sv: "Alla mål", en: "All targets", count: this.strategicTargets.length },
      { id: "ammunition", sv: "Ammunitionsdepåer (GRAU)", en: "Ammunition arsenals", count: 3 },
      { id: "olja_bransle", sv: "Oljeraffinaderier & bränsle", en: "Refineries & fuel", count: 4 },
      { id: "flygbaser", sv: "Militära flygbaser", en: "Airbases", count: 3 },
      { id: "vapenindustri", sv: "Krigsmaterielproduktion", en: "Arms manufacturing", count: 3 },
      { id: "ukrainskt_energinat", sv: "Ukrainskt energinät", en: "Ukrainian energy grid", count: 4 }
    ];

    container.innerHTML = `
      <div class="map-view-switcher">
        <button class="map-mode-btn ${this.mode === 'tactical' ? 'active' : ''}" onclick="TacticalMap.setMode('tactical')">
          🎯 ${isEn ? 'Tactical frontline map (24h)' : 'Taktisk frontkarta (24 tim)'}
        </button>
        <button class="map-mode-btn ${this.mode === 'strategic' ? 'active' : ''}" onclick="TacticalMap.setMode('strategic')">
          🚀 ${isEn ? 'Strategic air war map (30 days)' : 'Strategisk luftkrigskarta (30 dagar)'}
        </button>
      </div>

      <div class="strategic-filter-bar">
        <span class="strategic-filter-label">🏷️ ${isEn ? 'Filter by target type:' : 'Filtrera efter anfallsmål:'}</span>
        <div class="strategic-pill-group">
          ${categoryTabs.map(cat => `
            <button class="strategic-pill-btn ${filter === cat.id ? 'active' : ''}" onclick="TacticalMap.setStrategicFilter('${cat.id}')">
              ${isEn ? cat.en : cat.sv} <span class="pill-badge">${cat.count}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="tactical-map-wrapper">
        <svg viewBox="0 0 1000 620" class="tactical-svg strategic-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="stratBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#080e1a" />
              <stop offset="60%" stop-color="#0f172a" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>

            <pattern id="stratGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1"/>
            </pattern>

            <filter id="stratGlowCyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="stratGlowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Bakgrund & Rutnät -->
          <rect width="1000" height="620" fill="url(#stratBgGrad)" rx="12" />
          <rect width="1000" height="620" fill="url(#stratGridPattern)" rx="12" />

          <!-- Områdesbeteckningar -->
          <text x="750" y="45" class="map-label-faint">RYSSLAND / WESTERN RUSSIA</text>
          <text x="210" y="110" class="map-label-faint">BELARUS</text>
          <text x="35" y="240" class="map-label-faint">POLEN / EU</text>
          <text x="40" y="440" class="map-label-faint">RUMÄNIEN / MOLDAVIEN</text>

          <!-- Svarta Havet (Black Sea) -->
          <path d="M 220 480 Q 380 440 600 500 L 600 615 L 200 615 Z" fill="#04223b" fill-opacity="0.75" stroke="#0284c7" stroke-width="1.5" />
          <text x="350" y="555" class="map-label-sea">SVARTA HAVET / BLACK SEA</text>
          <text x="240" y="530" class="map-sublabel-sea">🚢 ${isEn ? "Ukrainian maritime export corridor" : "Ukrainsk sjöexportkorridor"}</text>

          <!-- Ukraina Huvudkontur (Fria & Frigjorda territorier) -->
          <path id="free-ukraine-strat" class="map-region-path" 
            d="M 110 260 L 220 220 L 330 230 L 360 270 L 420 280 L 440 340 L 390 410 L 290 435 L 200 420 L 110 380 Z" 
            fill="#0369a1" fill-opacity="0.22" stroke="#38bdf8" stroke-width="2" />

          <!-- Ryskockuperade områden i Ukraina -->
          <path id="occupied-ukraine-strat" class="map-region-path occupied" 
            d="M 440 340 L 530 310 L 570 350 L 510 420 L 430 415 L 390 410 Z" 
            fill="#b91c1c" fill-opacity="0.30" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 3" />

          <!-- Krym (Ockuperad halvö) -->
          <path id="crimea-strat" class="map-region-path crimea" 
            d="M 380 445 Q 410 435 440 450 L 450 490 L 385 480 Z" 
            fill="#991b1b" fill-opacity="0.38" stroke="#f87171" stroke-width="1.5" />
          <text x="400" y="468" class="map-tag-text">${isEn ? "Crimea" : "Krym"}</text>

          <!-- Landsgräns Ukraina/Ryssland/Belarus -->
          <path d="M 90 140 L 340 140 L 350 210 L 610 210 L 680 280 L 680 500" 
            fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5" stroke-dasharray="3 3" />

          <!-- RÄCKVIDDSBÅGAR (Range Rings från Ukrainas gräns / avfyrningszon) -->
          <!-- 300 km cirkelbåge (ATACMS / Storm Shadow / kortdistansdrönare) -->
          <path d="M 320 180 A 180 180 0 0 1 580 380" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.5" />
          <text x="560" y="360" fill="#38bdf8" font-size="11" font-weight="600" opacity="0.8">300 km</text>

          <!-- 750 km cirkelbåge (Liutyi / Bober attackdrönare) -->
          <path d="M 280 80 A 380 380 0 0 1 760 380" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="8 5" stroke-opacity="0.5" />
          <text x="740" y="360" fill="#f59e0b" font-size="11" font-weight="600" opacity="0.8">750 km</text>

          <!-- 1 200+ km cirkelbåge (Strategiska långdistansdrönare mot Tver/Alabuga) -->
          <path d="M 240 20 A 580 580 0 0 1 890 340" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="10 6" stroke-opacity="0.4" />
          <text x="860" y="320" fill="#a855f7" font-size="11" font-weight="600" opacity="0.8">1 200+ km</text>

          <!-- Stadsmarkörer (Referenspunkter) -->
          <!-- Moskva -->
          <g transform="translate(460, 160)" class="map-city-ref">
            <rect x="-4" y="-4" width="8" height="8" fill="#94a3b8" />
            <text x="8" y="3" fill="#cbd5e1" font-size="11" font-weight="600">${isEn ? "Moscow" : "Moskva"}</text>
          </g>
          <!-- Sankt Petersburg -->
          <g transform="translate(340, 40)" class="map-city-ref">
            <rect x="-3" y="-3" width="6" height="6" fill="#64748b" />
            <text x="8" y="3" fill="#94a3b8" font-size="10">${isEn ? "St. Petersburg" : "Sankt Petersburg"}</text>
          </g>
          <!-- Kyjiv -->
          <g transform="translate(265, 290)" class="map-city-ref">
            <polygon points="0,-6 5,4 -5,4" fill="#eab308" />
            <text x="9" y="3" fill="#fde047" font-size="12" font-weight="700">Kyjiv</text>
          </g>

          <!-- STRATEGISKA ANFALLSMÅL (Hotspots) -->
          ${targets.map(t => {
            const isSelected = activeTarget && activeTarget.id === t.id;
            const isUaStrike = t.side === "ukraina_djupanfall";
            const mainColor = isUaStrike ? "#38bdf8" : "#ef4444";
            const filterUrl = isUaStrike ? "url(#stratGlowCyan)" : "url(#stratGlowRed)";
            
            let icon = "💥";
            if (t.category === "olja_bransle") icon = "⛽";
            else if (t.category === "flygbaser") icon = "✈️";
            else if (t.category === "vapenindustri") icon = "🏭";
            else if (t.category === "ukrainskt_energinat") icon = "⚡";

            return `
              <g class="strategic-target-pin ${isSelected ? 'selected' : ''}" 
                 data-id="${t.id}" 
                 transform="translate(${t.coords.x}, ${t.coords.y})"
                 onclick="TacticalMap.selectTarget('${t.id}')"
                 style="cursor: pointer;">
                
                <!-- Pulsande radarcirkel vid vald eller aktiv -->
                <circle r="${isSelected ? 22 : 14}" fill="${mainColor}" fill-opacity="${isSelected ? 0.35 : 0.2}" class="pulsing-radar" filter="${filterUrl}" />
                <circle r="${isSelected ? 10 : 7}" fill="${mainColor}" stroke="#ffffff" stroke-width="${isSelected ? 2.5 : 1.5}" />
                
                <text x="12" y="-3" fill="#ffffff" font-size="${isSelected ? 12 : 10}" font-weight="${isSelected ? 700 : 600}" class="strat-pin-title">
                  ${isEn ? t.name_en.split('–')[0].trim() : t.name_sv.split('–')[0].trim()}
                </text>
                <text x="12" y="9" fill="${isUaStrike ? '#7dd3fc' : '#fca5a5'}" font-size="9" class="strat-pin-sub">
                  ${icon} ${t.distance_km > 0 ? (isEn ? `${t.distance_km} km depth` : `${t.distance_km} km djup`) : (isEn ? 'Energy grid' : 'Energinät')}
                </text>
              </g>
            `;
          }).join('')}

          <!-- Kartförklaring (Legend) -->
          <g transform="translate(25, 475)">
            <rect width="250" height="130" fill="rgba(15, 23, 42, 0.90)" rx="8" stroke="rgba(255,255,255,0.12)" />
            <text x="12" y="20" fill="#94a3b8" font-size="10" font-weight="700" letter-spacing="1">
              ${isEn ? "STRATEGIC AIR WAR HORIZON" : "STRATEGISK LUFTKRIGSÖVERSIKT (30 DAGAR)"}
            </text>

            <circle cx="18" cy="40" r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />
            <text x="32" y="44" fill="#f1f5f9" font-size="11">
              ${isEn ? "UA deep strike in Russia" : "Ukrainskt djupanfall i Ryssland"}
            </text>

            <circle cx="18" cy="62" r="5" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
            <text x="32" y="66" fill="#f1f5f9" font-size="11">
              ${isEn ? "RU strike on Ukrainian energy" : "Ryskt anfall mot ukrainsk energi"}
            </text>

            <line x1="12" y1="84" x2="25" y2="84" stroke="#38bdf8" stroke-dasharray="3 2" stroke-width="2" />
            <text x="32" y="88" fill="#94a3b8" font-size="10">
              ${isEn ? "300 / 750 / 1200+ km strike arcs" : "300 / 750 / 1200+ km räckvidd"}
            </text>

            <text x="12" y="112" fill="#64748b" font-size="9.5">
              ${isEn ? "Click marker to open operational dossier" : "Klicka på mål för att visa operativ dossier"}
            </text>
          </g>
        </svg>
      </div>

      <!-- Strategiskt måldossier (Detaljerat analyskort för valt mål) -->
      ${this.renderTargetDossierHtml(activeTarget, isEn)}
    `;
  },

  renderTargetDossierHtml(target, isEn) {
    if (!target) return "";
    const isUa = target.side === "ukraina_djupanfall";
    const categoryNames = {
      ammunition: { sv: "Ammunitionsdepå (GRAU)", en: "Ammunition Arsenal (GRAU)", icon: "💥" },
      olja_bransle: { sv: "Oljeraffinaderi & bränsledepå", en: "Oil Refinery & Fuel Storage", icon: "⛽" },
      flygbaser: { sv: "Militär flygbas", en: "Military Airbase", icon: "✈️" },
      vapenindustri: { sv: "Krigsmateriel- & vapenindustri", en: "Arms Manufacturing", icon: "🏭" },
      ukrainskt_energinat: { sv: "Ukrainskt energinät & kraftverk", en: "Ukrainian Energy Grid", icon: "⚡" }
    };
    const cat = categoryNames[target.category] || { sv: target.category, en: target.category, icon: "🎯" };

    return `
      <div class="strategic-dossier-card" id="strategic-dossier-card">
        <div class="dossier-header">
          <div class="dossier-header-left">
            <span class="dossier-badge ${isUa ? 'badge-ua-deep' : 'badge-ru-deep'}">
              ${isUa ? (isEn ? '🇺🇦 Ukrainian deep strike' : '🇺🇦 Ukrainskt djupanfall') : (isEn ? '🇷🇺 Russian strategic strike' : '🇷🇺 Ryskt strategiskt anfall')}
            </span>
            <span class="dossier-badge badge-category">${cat.icon} ${isEn ? cat.en : cat.sv}</span>
            ${target.distance_km > 0 ? `
              <span class="dossier-badge badge-range">🎯 ${isEn ? `${target.distance_km} km from border` : `${target.distance_km} km från gränsen`}</span>
            ` : ''}
          </div>
          <div class="dossier-date">📅 ${target.date}</div>
        </div>

        <h3 class="dossier-title">${isEn ? target.name_en : target.name_sv}</h3>
        <div class="dossier-location">📍 ${isEn ? target.oblast_en : target.oblast_sv}</div>

        <div class="dossier-grid">
          <div class="dossier-item">
            <span class="dossier-item-label">🚀 ${isEn ? 'Weapon system used:' : 'Insatt vapensystem:'}</span>
            <strong class="dossier-item-val">${isEn ? target.weapon_en : target.weapon_sv}</strong>
          </div>
          <div class="dossier-item">
            <span class="dossier-item-label">🛡️ ${isEn ? 'Verification standard:' : 'Verifieringsgrad:'}</span>
            <span class="dossier-item-val faint">${isEn ? target.verification_en : target.verification_sv}</span>
          </div>
        </div>

        <div class="dossier-impact-box">
          <div class="dossier-impact-header">💥 ${isEn ? 'Operational effect and damage assessment:' : 'Skadebedömning och operativ effekt:'}</div>
          <p class="dossier-impact-desc">${isEn ? target.impact_en : target.impact_sv}</p>
        </div>

        <div class="dossier-footer">
          <span class="dossier-source-info">
            ${isEn ? 'Primary investigator:' : 'Dokumenterad av:'} <strong>${target.source_name}</strong>
          </span>
          <a href="${target.source_url}" target="_blank" rel="noopener noreferrer" class="source-link-btn btn-sm">
            ${isEn ? 'View source / satellite proof' : 'Visa källa / satellitbevis'} ↗
          </a>
        </div>
      </div>
    `;
  },

  // 2. TAKTISK FRONTKARTA (24 TIMMAR)
  renderTacticalView(container, isEn) {
    container.innerHTML = `
      <div class="map-view-switcher">
        <button class="map-mode-btn ${this.mode === 'tactical' ? 'active' : ''}" onclick="TacticalMap.setMode('tactical')">
          🎯 ${isEn ? 'Tactical frontline map (24h)' : 'Taktisk frontkarta (24 tim)'}
        </button>
        <button class="map-mode-btn ${this.mode === 'strategic' ? 'active' : ''}" onclick="TacticalMap.setMode('strategic')">
          🚀 ${isEn ? 'Strategic air war map (30 days)' : 'Strategisk luftkrigskarta (30 dagar)'}
        </button>
      </div>

      <div class="tactical-map-wrapper">
        <svg viewBox="0 0 900 520" class="tactical-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0b1120" />
              <stop offset="100%" stop-color="#1e293b" />
            </linearGradient>
            
            <linearGradient id="frontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#dc2626" stop-opacity="0.9"/>
            </linearGradient>

            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>
            </pattern>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Bakgrund & Militärt Koordinatnät -->
          <rect width="900" height="520" fill="url(#bgGrad)" rx="12" />
          <rect width="900" height="520" fill="url(#gridPattern)" rx="12" />

          <!-- Gränskonturer Ryssland / Belarus i norr och öst -->
          <path d="M 120 40 L 450 40 L 460 120 L 780 120 L 880 200 L 880 480" fill="none" stroke="rgba(239, 68, 68, 0.2)" stroke-width="2" stroke-dasharray="4 4" />
          <text x="730" y="70" class="map-label-faint">RYSSLAND / RUSSIA</text>
          <text x="280" y="30" class="map-label-faint">BELARUS</text>
          <text x="50" y="240" class="map-label-faint">POLEN / EU</text>
          <text x="50" y="380" class="map-label-faint">RUMÄNIEN / MOLDAVIEN</text>

          <!-- Svarta Havet (Black Sea) -->
          <path d="M 280 430 Q 450 400 680 460 L 680 515 L 260 515 Z" fill="#082f49" fill-opacity="0.6" stroke="#0284c7" stroke-width="1.5" />
          <text x="440" y="475" class="map-label-sea">SVARTA HAVET / BLACK SEA</text>
          <text x="320" y="455" class="map-sublabel-sea">🚢 ${isEn ? "Maritime export corridor" : "Ukrainsk sjökorridor"}</text>

          <!-- Ukraina Huvudkontur (Fria & Frigjorda territorier) -->
          <path id="free-ukraine-path" class="map-region-path" 
            d="M 160 160 L 290 120 L 420 130 L 460 180 L 530 190 L 560 270 L 490 350 L 370 380 L 260 360 L 160 320 Z" 
            fill="#0369a1" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2" />

          <!-- Ryskockuperade områden (Donetsk, Luhansk, Södra Zaporizjzja, Cherson) -->
          <path id="occupied-ukraine-path" class="map-region-path occupied" 
            d="M 560 270 L 690 230 L 740 280 L 660 370 L 550 360 L 490 350 Z" 
            fill="#b91c1c" fill-opacity="0.35" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 2" />

          <!-- Krym (Ockuperad halvö) -->
          <path id="crimea-path" class="map-region-path crimea" 
            d="M 480 395 Q 520 385 550 400 L 560 440 L 485 435 Z" 
            fill="#991b1b" fill-opacity="0.4" stroke="#f87171" stroke-width="1.5" />
          <text x="500" y="420" class="map-tag-text">${isEn ? "Crimea" : "Krym"}</text>

          <!-- Frontlinjen (Aktiv stridslinje med röd glöd) -->
          <path d="M 680 235 Q 630 260 610 280 T 570 320 T 510 355" 
            fill="none" stroke="#ef4444" stroke-width="4" filter="url(#glow)" />
          <path d="M 680 235 Q 630 260 610 280 T 570 320 T 510 355" 
            fill="none" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="3 3" />

          <!-- Interaktiva Sektorer / Hotspots -->
          <!-- 1. Pokrovsk & Donbas Sektor -->
          <g class="map-hotspot" data-filter-geo="fria_ukraina" data-name="Pokrovsk" transform="translate(605, 285)">
            <circle r="14" fill="#ef4444" fill-opacity="0.3" class="pulsing-radar" />
            <circle r="6" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
            <text x="12" y="4" class="hotspot-title">Pokrovsk</text>
            <text x="12" y="16" class="hotspot-desc">${isEn ? "34 assaults / 24h" : "34 stormningar / 24h"}</text>
          </g>

          <!-- 2. Charkiv Sektor -->
          <g class="map-hotspot" data-filter-geo="fria_ukraina" data-name="Charkiv" transform="translate(560, 205)">
            <circle r="12" fill="#38bdf8" fill-opacity="0.3" />
            <circle r="5" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="4" class="hotspot-title">Charkiv</text>
            <text x="10" y="16" class="hotspot-desc">${isEn ? "Civilian glide bomb alert" : "Civilt glidbombslarm"}</text>
          </g>

          <!-- 3. Kyjiv (Huvudstad) -->
          <g class="map-hotspot" data-filter-geo="fria_ukraina" data-name="Kyjiv" transform="translate(370, 195)">
            <polygon points="0,-7 6,5 -6,5" fill="#eab308" stroke="#ffffff" stroke-width="1.5" />
            <text x="12" y="2" class="hotspot-title-bold">Kyjiv</text>
            <text x="12" y="14" class="hotspot-desc">${isEn ? "Air defense command" : "Luftförsvarscentrum"}</text>
          </g>

          <!-- 4. Kursk & Gränssektor (Ryssland) -->
          <g class="map-hotspot" data-filter-geo="ryssland" data-name="Kursk" transform="translate(640, 160)">
            <circle r="12" fill="#f97316" fill-opacity="0.3" class="pulsing-radar" />
            <circle r="6" fill="#f97316" stroke="#ffffff" stroke-width="1.5" />
            <text x="12" y="4" class="hotspot-title">Kursk (RU)</text>
            <text x="12" y="16" class="hotspot-desc">${isEn ? "Active buffer zone" : "Aktiv buffertzon"}</text>
          </g>

          <!-- 5. Odesa & Svarta havets korridor -->
          <g class="map-hotspot" data-filter-geo="ukrainas_granser" data-name="Odesa" transform="translate(390, 390)">
            <circle r="10" fill="#06b6d4" fill-opacity="0.3" />
            <circle r="5" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="4" class="hotspot-title">Odesa</text>
            <text x="10" y="16" class="hotspot-desc">${isEn ? "Grain corridor 6.4M t" : "Sjöexport 6,4M ton"}</text>
          </g>

          <!-- 6. Rostov & Bränsledepå (Ryssland) -->
          <g class="map-hotspot" data-filter-geo="ryssland" data-name="Rostov" transform="translate(760, 320)">
            <circle r="10" fill="#dc2626" fill-opacity="0.3" />
            <circle r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="4" class="hotspot-title">Rostov (RU)</text>
            <text x="10" y="16" class="hotspot-desc">${isEn ? "Fuel depot strike" : "Drönarträff oljedepå"}</text>
          </g>

          <!-- 7. Sevastopol (Krym) -->
          <g class="map-hotspot" data-filter-geo="ockuperade_ukraina" data-name="Sevastopol" transform="translate(500, 435)">
            <circle r="8" fill="#e11d48" fill-opacity="0.3" />
            <circle r="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="3" class="hotspot-title">Sevastopol</text>
            <text x="10" y="14" class="hotspot-desc">${isEn ? "S-400 neutralized" : "S-400 utslaget"}</text>
          </g>

          <!-- Kartförklaring (Legend) -->
          <g transform="translate(25, 430)">
            <rect width="210" height="75" fill="rgba(15, 23, 42, 0.85)" rx="6" stroke="rgba(255,255,255,0.1)" />
            <line x1="12" y1="18" x2="35" y2="18" stroke="#ef4444" stroke-width="3" />
            <text x="45" y="21" class="legend-text">${isEn ? "Active frontline" : "Aktiv frontlinje"}</text>

            <rect x="12" y="32" width="20" height="12" fill="#0369a1" fill-opacity="0.4" stroke="#38bdf8" />
            <text x="45" y="42" class="legend-text">${isEn ? "Free Ukraine" : "Fria Ukraina"}</text>

            <rect x="12" y="52" width="20" height="12" fill="#b91c1c" fill-opacity="0.4" stroke="#ef4444" stroke-dasharray="2 2" />
            <text x="45" y="62" class="legend-text">${isEn ? "Occupied territory" : "Ockuperat område"}</text>
          </g>
        </svg>
      </div>
    `;

    // Hook up click listeners for map interactive hotspots in tactical mode
    container.querySelectorAll(".map-hotspot").forEach(el => {
      el.addEventListener("click", () => {
        const geoFilter = el.getAttribute("data-filter-geo");
        const sectorName = el.getAttribute("data-name");
        if (window.App) {
          window.App.applyMapFilter(geoFilter, sectorName);
        }
      });
    });
  }
};
