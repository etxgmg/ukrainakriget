/**
 * map.js
 * Interaktiv taktisk karta över Ukraina och operationsområdena.
 * Möjliggör visuell navigering och direktfiltrering av händelser efter geografisk sektor.
 */

const TacticalMap = {
  containerId: "tactical-map-container",
  activeRegion: null,

  init(containerId) {
    if (containerId) this.containerId = containerId;
    this.render();
  },

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const lang = getLang();
    const isEn = lang === "en";

    // Tactical SVG map with key geographic operational sectors
    container.innerHTML = `
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
          <text x="320" y="455" class="map-sublabel-sea">🚢 ${isEn ? "Maritime Export Corridor" : "Ukrainsk Sjökorridor"}</text>

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
            <text x="10" y="16" class="hotspot-desc">${isEn ? "Civilian Glide Bomb Alert" : "Civilt glidbombslarm"}</text>
          </g>

          <!-- 3. Kyjiv (Huvudstad) -->
          <g class="map-hotspot" data-filter-geo="fria_ukraina" data-name="Kyjiv" transform="translate(370, 195)">
            <polygon points="0,-7 6,5 -6,5" fill="#eab308" stroke="#ffffff" stroke-width="1.5" />
            <text x="12" y="2" class="hotspot-title-bold">Kyjiv</text>
            <text x="12" y="14" class="hotspot-desc">${isEn ? "Air Defense Command" : "Luftförsvarscentrum"}</text>
          </g>

          <!-- 4. Kursk & Gränssektor (Ryssland) -->
          <g class="map-hotspot" data-filter-geo="ryssland" data-name="Kursk" transform="translate(640, 160)">
            <circle r="12" fill="#f97316" fill-opacity="0.3" class="pulsing-radar" />
            <circle r="6" fill="#f97316" stroke="#ffffff" stroke-width="1.5" />
            <text x="12" y="4" class="hotspot-title">Kursk (RU)</text>
            <text x="12" y="16" class="hotspot-desc">${isEn ? "Active Buffer Zone" : "Aktiv buffertzon"}</text>
          </g>

          <!-- 5. Odesa & Svarta havets korridor -->
          <g class="map-hotspot" data-filter-geo="ukrainas_granser" data-name="Odesa" transform="translate(390, 390)">
            <circle r="10" fill="#06b6d4" fill-opacity="0.3" />
            <circle r="5" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="4" class="hotspot-title">Odesa</text>
            <text x="10" y="16" class="hotspot-desc">${isEn ? "Grain Corridor 6.2M t" : "Sjöexport 6,2M ton"}</text>
          </g>

          <!-- 6. Rostov & Bränsledepå (Ryssland) -->
          <g class="map-hotspot" data-filter-geo="ryssland" data-name="Rostov" transform="translate(760, 320)">
            <circle r="10" fill="#dc2626" fill-opacity="0.3" />
            <circle r="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="4" class="hotspot-title">Rostov (RU)</text>
            <text x="10" y="16" class="hotspot-desc">${isEn ? "Fuel Depot Strike" : "Drönarträff oljedepå"}</text>
          </g>

          <!-- 7. Sevastopol (Krym) -->
          <g class="map-hotspot" data-filter-geo="ockuperade_ukraina" data-name="Sevastopol" transform="translate(500, 435)">
            <circle r="8" fill="#e11d48" fill-opacity="0.3" />
            <circle r="4" fill="#e11d48" stroke="#ffffff" stroke-width="1.5" />
            <text x="10" y="3" class="hotspot-title">Sevastopol</text>
            <text x="10" y="14" class="hotspot-desc">${isEn ? "S-400 Neutralized" : "S-400 utslaget"}</text>
          </g>

          <!-- Kartförklaring (Legend) -->
          <g transform="translate(25, 430)">
            <rect width="210" height="75" fill="rgba(15, 23, 42, 0.85)" rx="6" stroke="rgba(255,255,255,0.1)" />
            <line x1="12" y1="18" x2="35" y2="18" stroke="#ef4444" stroke-width="3" />
            <text x="45" y="21" class="legend-text">${isEn ? "Active Frontline" : "Aktiv frontlinje"}</text>

            <rect x="12" y="32" width="20" height="12" fill="#0369a1" fill-opacity="0.4" stroke="#38bdf8" />
            <text x="45" y="42" class="legend-text">${isEn ? "Free Ukraine" : "Fria Ukraina"}</text>

            <rect x="12" y="52" width="20" height="12" fill="#b91c1c" fill-opacity="0.4" stroke="#ef4444" stroke-dasharray="2 2" />
            <text x="45" y="62" class="legend-text">${isEn ? "Occupied Territory" : "Ockuperat område"}</text>
          </g>
        </svg>
      </div>
    `;

    // Hook up click listeners for map interactive hotspots
    container.querySelectorAll(".map-hotspot").forEach(el => {
      el.addEventListener("click", () => {
        const geoFilter = el.getAttribute("data-filter-geo");
        const sectorName = el.getAttribute("data-name");
        
        // Notify application
        if (window.App) {
          window.App.applyMapFilter(geoFilter, sectorName);
        }
      });
    });
  }
};
