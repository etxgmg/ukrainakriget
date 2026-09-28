/**
 * i18n.js
 * Tvåspråkigt språkstöd (svenska och engelska) för Ukrainakriget.
 * Växlar dynamiskt mellan språken och sparar valet i localStorage.
 */

const translations = {
  sv: {
    // Header & Meta
    siteTitle: "Ukrainakriget",
    siteSubtitle: "Oberoende underrättelse- och situationsdashboard",
    siteDescription: "En öppen, strukturerad och automatisk analysportal för händelseutvecklingen i Ukrainakriget.",
    liveStatus: "Aktuell lägesbild",
    systemLiveStatus: "Automatisk drift",
    lastUpdatedLabel: "Senast uppdaterad:",
    nextUpdateLabel: "Nästa uppdatering:",
    statusTooltip: "Webbplatsen uppdateras autonomt var 4:e timme via GitHub Actions och roterar ut händelser äldre än 24 timmar till arkivet.",
    feedSyncText: "Uppdateras var 4:e timme • Nästa",
    activeEventsHeading: "Aktuella händelser (senaste dygnet)",
    activeEventsDesc: "Händelser som visats roteras automatiskt till arkivet efter 24 timmar så att dashboarden alltid visar dagens situation.",
    lastUpdated: "Senast uppdaterad:",
    hoursAgo: "timmar sedan",
    today: "Idag",
    langButton: "English",
    
    // Navigation
    navDashboard: "Översikt och lägesbild",
    navTimeline: "Flerdimensionellt filter",
    navArchive: "Arkiv (>24 tim)",
    navSources: "Källkatalog",
    navMethodology: "Metod och struktur",

    // KPI / Sammanfattning
    kpiInterception: "Luftförsvarseffektivitet",
    kpiInterceptionDesc: "Nedskjutna Shahed och kryssningsrobotar senaste dygnet",
    kpiFrontline: "Frontstrider (24 tim)",
    kpiFrontlineDesc: "Intensivast strider kring Pokrovsk och Kurachove",
    kpiCorridor: "Sjökorsväg Svarta havet",
    kpiCorridorDesc: "Månatlig export genom ukrainsk sjökorridor",
    kpiCivilianShare: "Civila anfallsmål",
    kpiCivilianShareDesc: "Andel av ryska luft- och robotangrepp mot civila mål",

    // Filter och dimensioner
    filterTitle: "Flerdimensionell klassificering",
    filterSubtitle: "Kombinera perspektiv för att analysera läget ur specifika dimensioner",
    filterSearchPlaceholder: "Sök händelser, städer, vapentyper, aktörer...",
    filterReset: "Återställ alla filter",
    filterShowing: "Visar",
    filterOf: "av",
    filterEvents: "händelser",

    // Dimensionsnamn
    dimTime: "Tidshorisonter",
    dimGeo: "Geografiska områden",
    dimActors: "Parter och intressenter",
    dimPurpose: "Syfte och målnivå",
    dimTarget: "Anfallsmålets egenskap",
    dimConfidence: "Vetskap och sannolikhet",

    // Dimensionsalternativ
    optAll: "Alla",
    timeDaily: "Dagligen (senaste dygnet)",
    timeWeekly: "Veckovis",
    timeMonthly: "Månatligen",
    timeYearly: "Årsvis",

    geoFreeUA: "Fria Ukraina",
    geoOccupiedUA: "Ockuperade Ukraina (inkl. Krym)",
    geoRussia: "Ryssland",
    geoBorders: "Ukrainas gränser / Svarta havet",
    geoEUEEA: "EU och EES",
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
    targetInfra: "Civil infrastruktur och transport",
    targetMilitary: "Militära resurser (trupp, pansar)",
    targetEnergy: "Energiproduktion och distribution",
    targetAmmo: "Krigsmaterielproduktion och lager",
    targetDiplomatic: "Diplomatiskt / politiskt initiativ",

    confConfirmed: "100% bekräftad (geoverifierad)",
    confHigh: "≥85% hög sannolikhet",
    confMedium: "≥60% måttlig / obekräftad",
    confClaim: "<50% påstående / propaganda",

    // Kortdetaljer
    sourceLabel: "Källa:",
    directSourceLink: "Gå till ursprungskälla",
    credibilityLabel: "Trovärdighet:",
    verificationLabel: "Verifieringsgrad:",
    targetTypeLabel: "Måltyp:",
    purposeLabel: "Syfte:",
    impactLabel: "Måluppfyllnad:",
    impactCompleted: "Fullbordad",
    impactPartial: "Delvis uppnådd",
    impactRepelled: "Avvärjd / nedskjuten",
    impactOngoing: "Pågående",
    impactUnknown: "Okänd",

    // Kartsektion
    mapTitle: "Taktisk geografisk översiktskarta",
    mapSubtitle: "Klicka på en sektor för att filtrera händelser i området",

    // Arkivsektion
    archiveTitle: "Historiskt arkiv",
    archiveSubtitle: "Dagliga händelser flyttas hit efter 24 timmars visning för att hålla dashboarden aktuell.",
    archiveSearch: "Sök i arkivet...",
    archiveEmpty: "Inga arkiverade händelser matchar dina valda filter.",

    // Källsektion
    sourcesTitle: "Källkatalog och verifieringskedja",
    sourcesSubtitle: "Alla publicerade uppgifter härrör från dokumenterade primärkällor eller oberoende granskare.",
    sourcesTierPrimary: "Primärkällor",
    sourcesTierIntel: "Underrättelsetjänster",
    sourcesTierOSINT: "OSINT och satellit",
    sourcesTierMedia: "Oberoende nyhetsmedier",
    sourcesTierFact: "Faktagranskning",

    // Metodologi
    methodTitle: "Metodologi och informationsstruktur",
    methodSubtitle: "Hur informationen struktureras, klassificeras och verifieras",

    // Footer
    footerText: "Ukrainakriget – Helautomatiskt, öppet dashboard för systematisk situationsanalys.",
    footerRepo: "Källkod på GitHub (ukrainakriget/ukrainakriget.github.io)",
    footerDisclaimer: "Informationen samlas in automatiskt och klassificeras med öppna källor i enlighet med internationella OSINT-standarder."
  },

  en: {
    // Header & Meta
    siteTitle: "The War in Ukraine",
    siteSubtitle: "Independent intelligence and situational dashboard",
    siteDescription: "An open, structured, automated situational awareness portal tracking developments in the Russo-Ukrainian War.",
    liveStatus: "Live briefing",
    systemLiveStatus: "Automated operation",
    lastUpdatedLabel: "Last updated:",
    nextUpdateLabel: "Next update:",
    statusTooltip: "The site updates autonomously every 4 hours via GitHub Actions and rotates events older than 24 hours to the archive.",
    feedSyncText: "Updated every 4 hours • Next",
    activeEventsHeading: "Active events (last 24 hours)",
    activeEventsDesc: "Events displayed are automatically rotated to the archive after 24 hours ensuring the dashboard always displays today's situation.",
    lastUpdated: "Last updated:",
    hoursAgo: "hours ago",
    today: "Today",
    langButton: "Svenska",
    
    // Navigation
    navDashboard: "Overview and status",
    navTimeline: "Multi-perspective matrix",
    navArchive: "Archive (>24h)",
    navSources: "Sources directory",
    navMethodology: "Methodology and structure",

    // KPI / Summary
    kpiInterception: "Air defense interception rate",
    kpiInterceptionDesc: "Shaheds and cruise missiles intercepted in the last 24h",
    kpiFrontline: "Frontline clashes (24h)",
    kpiFrontlineDesc: "Heaviest fighting around Pokrovsk and Kurakhove",
    kpiCorridor: "Black Sea corridor",
    kpiCorridorDesc: "Monthly cargo volume exported via Ukrainian maritime corridor",
    kpiCivilianShare: "Civilian target ratio",
    kpiCivilianShareDesc: "Share of Russian missile/drone strikes targeting civilian infrastructure",

    // Filters & Dimensions
    filterTitle: "Multi-dimensional classification",
    filterSubtitle: "Combine multiple viewpoints to analyze the conflict from structured perspectives",
    filterSearchPlaceholder: "Search events, cities, weapon types, stakeholders...",
    filterReset: "Reset all filters",
    filterShowing: "Showing",
    filterOf: "of",
    filterEvents: "events",

    // Dimensions Names
    dimTime: "Time horizons",
    dimGeo: "Geographic sectors",
    dimActors: "Parties and stakeholders",
    dimPurpose: "Strategic purpose and intent",
    dimTarget: "Target characteristics",
    dimConfidence: "Confidence and probability",

    // Dimension Options
    optAll: "All",
    timeDaily: "Daily (last 24 hours)",
    timeWeekly: "Weekly",
    timeMonthly: "Monthly",
    timeYearly: "Yearly",

    geoFreeUA: "Free Ukraine",
    geoOccupiedUA: "Occupied Ukraine (incl. Crimea)",
    geoRussia: "Russian territory",
    geoBorders: "Ukraine's borders / Black Sea",
    geoEUEEA: "EU and EEA",
    geoWorld: "Rest of the world",

    actorUA: "Ukraine",
    actorRU: "Russia",
    actorEU: "EU",
    actorUK: "United Kingdom",
    actorUS: "United States",
    actorCN: "China",
    actorWorld: "Rest of world",

    purposeReal: "Underlying purpose",
    purposeVision: "Vision",
    purposeStrategic: "Strategic goal",
    purposeTactical: "Tactical goal",
    purposeOperational: "Operational goal",
    purposeOutput: "Output goal",
    purposeOutcome: "Outcome goal",
    purposeEffect: "Effect goal",

    targetCivilian: "Purely civilian (hospitals, schools, homes)",
    targetInfra: "Civilian infrastructure and transport",
    targetMilitary: "Military assets (troops, armor, command)",
    targetEnergy: "Energy generation and distribution",
    targetAmmo: "Arms manufacturing and munitions arsenals",
    targetDiplomatic: "Diplomatic / political initiative",

    confConfirmed: "100% confirmed (geolocated)",
    confHigh: "≥85% high probability",
    confMedium: "≥60% moderate / unconfirmed",
    confClaim: "<50% unsubstantiated claim / disinfo",

    // Card Details
    sourceLabel: "Source:",
    directSourceLink: "Open primary source",
    credibilityLabel: "Reliability:",
    verificationLabel: "Verification score:",
    targetTypeLabel: "Target classification:",
    purposeLabel: "Intent / purpose:",
    impactLabel: "Target fulfillment:",
    impactCompleted: "Achieved",
    impactPartial: "Partially achieved",
    impactRepelled: "Repelled / intercepted",
    impactOngoing: "In progress",
    impactUnknown: "Unknown",

    // Map section
    mapTitle: "Tactical operational map",
    mapSubtitle: "Click on any sector to filter events occurring in that region",

    // Archive section
    archiveTitle: "Historical archive",
    archiveSubtitle: "Daily events automatically rotate into the archive after 24 hours to keep the live dashboard current.",
    archiveSearch: "Search historical archive...",
    archiveEmpty: "No archived events match your selected criteria.",

    // Sources section
    sourcesTitle: "Sources catalog and lineage",
    sourcesSubtitle: "All published data points trace directly back to verified primary sources or independent investigators.",
    sourcesTierPrimary: "Primary sources",
    sourcesTierIntel: "Allied intelligence",
    sourcesTierOSINT: "OSINT and geolocation",
    sourcesTierMedia: "Independent media",
    sourcesTierFact: "Fact-checkers",

    // Methodology
    methodTitle: "Methodology and information structure",
    methodSubtitle: "Why Ukrainakriget provides structural clarity absent in legacy news feeds",

    // Footer
    footerText: "Ukrainakriget – Fully automated open dashboard for structured conflict intelligence.",
    footerRepo: "Source code on GitHub (ukrainakriget/ukrainakriget.github.io)",
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
