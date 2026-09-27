/**
 * i18n.js
 * Tvåspråkigt språkstöd (Svenska och Engelska) för Ukrainakriget.
 * Växlar dynamiskt mellan språken och sparar valet i localStorage.
 */

const translations = {
  sv: {
    // Header & Meta
    siteTitle: "Ukrainakriget",
    siteSubtitle: "Oberoende Underrättelse & Situationsdashboard",
    siteDescription: "En öppen, strukturerad och automatisk analysportal för händelseutvecklingen i Ukrainakriget.",
    liveStatus: "AKTUELL LÄGESBILD",
    lastUpdated: "Senast uppdaterad:",
    hoursAgo: "timmar sedan",
    today: "Idag",
    langButton: "English",
    
    // Navigation
    navDashboard: "Översikt & Lägesbild",
    navTimeline: "Multidimensionellt Filter",
    navArchive: "Arkiv (>24h)",
    navSources: "Källkatalog",
    navMethodology: "Metod & USP",

    // KPI / Summary
    kpiInterception: "Luftförsvarseffektivitet",
    kpiInterceptionDesc: "Nedskjutna Shahed & kryssningsrobotar senaste dygnet",
    kpiFrontline: "Frontstrider (24h)",
    kpiFrontlineDesc: "Intensivast strider kring Pokrovsk & Kurachove",
    kpiCorridor: "Sjökorsväg Svarta Havet",
    kpiCorridorDesc: "Månatlig export genom ukrainsk sjökorridor",
    kpiCivilianShare: "Civila anfallsmål",
    kpiCivilianShareDesc: "Andel av ryska luft- & robotangrepp mot civila mål",

    // Filters & Dimensions
    filterTitle: "Flerdimensionell Klassificering (Webbplatsens USP)",
    filterSubtitle: "Kombinera perspektiv för att analysera läget ur specifika dimensioner",
    filterSearchPlaceholder: "Sök händelser, städer, vapentyper, aktörer...",
    filterReset: "Återställ alla filter",
    filterShowing: "Visar",
    filterOf: "av",
    filterEvents: "händelser",

    // Dimensions Names
    dimTime: "Tidshorisonter",
    dimGeo: "Geografiska områden",
    dimActors: "Parter & Intressenter",
    dimPurpose: "Syfte & Målnivå",
    dimTarget: "Anfallsmålets egenskap",
    dimConfidence: "Vetskap & Sannolikhet",

    // Dimension Options
    optAll: "Alla",
    timeDaily: "Dagligen (Senaste dygnet)",
    timeWeekly: "Veckovis",
    timeMonthly: "Månatligen",
    timeYearly: "Årsvis",

    geoFreeUA: "Fria Ukraina",
    geoOccupiedUA: "Ockuperade Ukraina (inkl. Krym)",
    geoRussia: "Ryssland",
    geoBorders: "Ukrainas gränser / Svarta havet",
    geoEUEEA: "EU & EES",
    geoWorld: "Resten av världen",

    actorUA: "Ukraina",
    actorRU: "Ryssland",
    actorEU: "EU",
    actorUK: "Storbritannien",
    actorUS: "USA",
    actorCN: "Kina",
    actorWorld: "Övriga världen",

    purposeReal: "Äkta syfte",
    purposeVision: "Vision",
    purposeStrategic: "Strategiskt mål",
    purposeTactical: "Taktiskt mål",
    purposeOperational: "Operationellt mål",
    purposeOutput: "Prestationsmål",
    purposeOutcome: "Resultatmål",
    purposeEffect: "Effektmål",

    targetCivilian: "Helt civila mål (sjukhus, skolor)",
    targetInfra: "Civil infrastruktur & transport",
    targetMilitary: "Militära resurser (trupp, pansar)",
    targetEnergy: "Energiproduktion & distribution",
    targetAmmo: "Krigsmaterielproduktion & lager",
    targetDiplomatic: "Diplomatiskt / politiskt initiativ",

    confConfirmed: "100% Bekräftad (Geoverifierad)",
    confHigh: "≥85% Hög sannolikhet",
    confMedium: "≥60% Måttlig / Obekräftad",
    confClaim: "<50% Påstående / Propaganda",

    // Card Details
    sourceLabel: "Källa:",
    directSourceLink: "Gå till ursprungskälla",
    credibilityLabel: "Trovärdighet:",
    verificationLabel: "Verifieringsgrad:",
    targetTypeLabel: "Måltyp:",
    purposeLabel: "Syfte:",
    impactLabel: "Måluppfyllnad:",
    impactCompleted: "Fullbordad",
    impactPartial: "Delvis uppnådd",
    impactRepelled: "Avvärjd / Nedskjuten",
    impactOngoing: "Pågående",
    impactUnknown: "Okänd",

    // Map section
    mapTitle: "Taktisk Geografisk Översiktskarta",
    mapSubtitle: "Klicka på en sektor för att filtrera händelser i området",

    // Archive section
    archiveTitle: "Historiskt Arkiv",
    archiveSubtitle: "Dagliga händelser flyttas hit efter 24 timmars visning för att hålla dashboarden aktuell.",
    archiveSearch: "Sök i arkivet...",
    archiveEmpty: "Inga arkiverade händelser matchar dina valda filter.",

    // Sources section
    sourcesTitle: "Källkatalog & Verifieringskedja",
    sourcesSubtitle: "Alla publicerade uppgifter härrör från dokumenterade primärkällor eller oberoende granskare.",
    sourcesTierPrimary: "Primärkällor",
    sourcesTierIntel: "Underrättelsetjänster",
    sourcesTierOSINT: "OSINT & Satellit",
    sourcesTierMedia: "Oberoende Nyhetsmedier",
    sourcesTierFact: "Faktagranskning",

    // Methodology
    methodTitle: "Metodologi & Unik Värdestruktur (USP)",
    methodSubtitle: "Varför Ukrainakriget.github.io skiljer sig från traditionella nyhetsmedier",

    // Footer
    footerText: "Ukrainakriget – Helautomatiskt, öppet dashboard för systematisk situationsanalys.",
    footerRepo: "Källkod på GitHub (etxgmg/ukrainakriget)",
    footerDisclaimer: "Informationen samlas in automatiskt och klassificeras med öppna källor i enlighet med internationella OSINT-standarder."
  },

  en: {
    // Header & Meta
    siteTitle: "The War in Ukraine",
    siteSubtitle: "Independent Intelligence & Situational Dashboard",
    siteDescription: "An open, structured, automated situational awareness portal tracking developments in the Russo-Ukrainian War.",
    liveStatus: "LIVE BRIEFING",
    lastUpdated: "Last updated:",
    hoursAgo: "hours ago",
    today: "Today",
    langButton: "Svenska",
    
    // Navigation
    navDashboard: "Overview & Status",
    navTimeline: "Multi-Perspective Matrix",
    navArchive: "Archive (>24h)",
    navSources: "Sources Directory",
    navMethodology: "Methodology & USP",

    // KPI / Summary
    kpiInterception: "Air Defense Interception Rate",
    kpiInterceptionDesc: "Shaheds & cruise missiles intercepted in the last 24h",
    kpiFrontline: "Frontline Clashes (24h)",
    kpiFrontlineDesc: "Heaviest fighting around Pokrovsk & Kurakhove",
    kpiCorridor: "Black Sea Corridor",
    kpiCorridorDesc: "Monthly cargo volume exported via Ukrainian maritime corridor",
    kpiCivilianShare: "Civilian Target Ratio",
    kpiCivilianShareDesc: "Share of Russian missile/drone strikes targeting civilian infrastructure",

    // Filters & Dimensions
    filterTitle: "Multi-Dimensional Classification (Core USP)",
    filterSubtitle: "Combine multiple viewpoints to analyze the conflict from structured perspectives",
    filterSearchPlaceholder: "Search events, cities, weapon types, stakeholders...",
    filterReset: "Reset All Filters",
    filterShowing: "Showing",
    filterOf: "of",
    filterEvents: "events",

    // Dimensions Names
    dimTime: "Time Horizons",
    dimGeo: "Geographic Sectors",
    dimActors: "Parties & Stakeholders",
    dimPurpose: "Strategic Purpose & Intent",
    dimTarget: "Target Characteristics",
    dimConfidence: "Confidence & Probability",

    // Dimension Options
    optAll: "All",
    timeDaily: "Daily (Last 24 Hours)",
    timeWeekly: "Weekly",
    timeMonthly: "Monthly",
    timeYearly: "Yearly",

    geoFreeUA: "Free Ukraine",
    geoOccupiedUA: "Occupied Ukraine (incl. Crimea)",
    geoRussia: "Russian Territory",
    geoBorders: "Ukraine's Borders / Black Sea",
    geoEUEEA: "EU & EEA",
    geoWorld: "Rest of the World",

    actorUA: "Ukraine",
    actorRU: "Russia",
    actorEU: "EU",
    actorUK: "United Kingdom",
    actorUS: "United States",
    actorCN: "China",
    actorWorld: "Rest of World",

    purposeReal: "Underlying Purpose",
    purposeVision: "Vision",
    purposeStrategic: "Strategic Goal",
    purposeTactical: "Tactical Goal",
    purposeOperational: "Operational Goal",
    purposeOutput: "Output Goal",
    purposeOutcome: "Outcome Goal",
    purposeEffect: "Effect Goal",

    targetCivilian: "Purely Civilian (Hospitals, schools, homes)",
    targetInfra: "Civilian Infrastructure & Transport",
    targetMilitary: "Military Assets (Troops, armor, command)",
    targetEnergy: "Energy Generation & Distribution",
    targetAmmo: "Arms Manufacturing & Munitions Arsenals",
    targetDiplomatic: "Diplomatic / Political Initiative",

    confConfirmed: "100% Confirmed (Geolocated)",
    confHigh: "≥85% High Probability",
    confMedium: "≥60% Moderate / Unconfirmed",
    confClaim: "<50% Unsubstantiated Claim / Disinfo",

    // Card Details
    sourceLabel: "Source:",
    directSourceLink: "Open primary source",
    credibilityLabel: "Reliability:",
    verificationLabel: "Verification Score:",
    targetTypeLabel: "Target Classification:",
    purposeLabel: "Intent / Purpose:",
    impactLabel: "Target Fulfillment:",
    impactCompleted: "Achieved",
    impactPartial: "Partially Achieved",
    impactRepelled: "Repelled / Intercepted",
    impactOngoing: "In Progress",
    impactUnknown: "Unknown",

    // Map section
    mapTitle: "Tactical Operational Map",
    mapSubtitle: "Click on any sector to filter events occurring in that region",

    // Archive section
    archiveTitle: "Historical Archive",
    archiveSubtitle: "Daily events automatically rotate into the archive after 24 hours to keep the live dashboard current.",
    archiveSearch: "Search historical archive...",
    archiveEmpty: "No archived events match your selected criteria.",

    // Sources section
    sourcesTitle: "Sources Catalog & Lineage",
    sourcesSubtitle: "All published data points trace directly back to verified primary sources or independent investigators.",
    sourcesTierPrimary: "Primary Sources",
    sourcesTierIntel: "Allied Intelligence",
    sourcesTierOSINT: "OSINT & Geolocation",
    sourcesTierMedia: "Independent Media",
    sourcesTierFact: "Fact-Checkers",

    // Methodology
    methodTitle: "Methodology & Unique Value Proposition (USP)",
    methodSubtitle: "Why Ukrainakriget provides structural clarity absent in legacy news feeds",

    // Footer
    footerText: "Ukrainakriget – Fully automated open dashboard for structured conflict intelligence.",
    footerRepo: "Source Code on GitHub (etxgmg/ukrainakriget)",
    footerDisclaimer: "Information is curated and automatically classified using verified open-source intelligence standards."
  }
};

let currentLanguage = localStorage.getItem("ukrainakriget_lang") || "sv";

function getLang() {
  return currentLanguage;
}

function setLang(lang) {
  if (lang !== "sv" && lang !== "en") lang = "sv";
  currentLanguage = lang;
  localStorage.setItem("ukrainakriget_lang", lang);
  applyTranslations();
  // Trigger update event
  window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
}

function toggleLang() {
  setLang(currentLanguage === "sv" ? "en" : "sv");
}

function t(key) {
  const dict = translations[currentLanguage] || translations.sv;
  return dict[key] || translations.sv[key] || key;
}

function applyTranslations() {
  const dict = translations[currentLanguage] || translations.sv;
  document.documentElement.lang = currentLanguage;
  
  // Elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Elements with data-i18n-placeholder attribute
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Elements with data-i18n-title attribute
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    if (dict[key]) {
      el.title = dict[key];
    }
  });

  const langBtn = document.getElementById("lang-toggle-btn");
  if (langBtn) {
    langBtn.innerHTML = currentLanguage === "sv" 
      ? `<span class="flag-icon">🇬🇧</span> English` 
      : `<span class="flag-icon">🇸🇪</span> Svenska`;
  }
}
