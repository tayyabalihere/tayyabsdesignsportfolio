// SVG Artwork & Garment Visual Generator for Tayyabs.Designs
// Generates high-resolution vector artwork & garment mockups in strict Black, Grey, and White fashion aesthetic

export const generateArtworkSvg = (
  type: 'streetwear-cyber' | 'cultural-dragon' | 'typography-gothic' | 'jersey-racing' | 'illustration-reaper' | 'minimal-techpack',
  title: string,
  variant: 'front' | 'back' | 'sleeve' | 'detail' = 'front'
): string => {
  const width = 800;
  const height = 1000;

  let content = '';

  if (type === 'streetwear-cyber') {
    content = `
      <defs>
        <radialGradient id="silverGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.3"/>
          <stop offset="60%" stop-color="#888888" stop-opacity="0.1"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="25%" stop-color="#CCCCCC"/>
          <stop offset="50%" stop-color="#444444"/>
          <stop offset="75%" stop-color="#E5E5E5"/>
          <stop offset="100%" stop-color="#1A1A1A"/>
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="#000000"/>
      <!-- Grid lines -->
      <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800 M0 500 H800 M0 600 H800 M0 700 H800 M0 800 H800 M0 900 H800" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>
      <path d="M100 0 V1000 M200 0 V1000 M300 0 V1000 M400 0 V1000 M500 0 V1000 M600 0 V1000 M700 0 V1000" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>

      <circle cx="400" cy="450" r="280" fill="url(#silverGlow)"/>

      <!-- Geometric Cyber Structure -->
      <polygon points="400,180 620,320 620,600 400,740 180,600 180,320" fill="none" stroke="url(#chromeGrad)" stroke-width="3"/>
      <polygon points="400,220 580,340 580,580 400,700 220,580 220,340" fill="none" stroke="#CCCCCC" stroke-opacity="0.4" stroke-width="1" stroke-dasharray="8 4"/>

      <!-- Cross Emblem -->
      <path d="M400,260 L400,660 M200,460 L600,460" stroke="url(#chromeGrad)" stroke-width="8"/>
      <circle cx="400" cy="460" r="90" fill="none" stroke="#CCCCCC" stroke-width="4"/>

      <!-- Kanji / Cyber Typography -->
      <text x="400" y="140" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="28" fill="#CCCCCC" letter-spacing="12" text-anchor="middle">SYSTEM.99 // OVERRIDE</text>
      <text x="400" y="475" font-family="'Syne', sans-serif" font-weight="900" font-size="52" fill="url(#chromeGrad)" text-anchor="middle" letter-spacing="4">${title.toUpperCase()}</text>
      <text x="400" y="820" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="18" fill="#888888" letter-spacing="8" text-anchor="middle">TAYYABS.DESIGNS • APPAREL SPECIFICATION • ${variant.toUpperCase()}</text>
    `;
  } else if (type === 'cultural-dragon') {
    content = `
      <defs>
        <linearGradient id="silverMetallic" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF"/>
          <stop offset="50%" stop-color="#888888"/>
          <stop offset="100%" stop-color="#333333"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0A0A0A"/>
      <!-- Sun circle behind -->
      <circle cx="400" cy="460" r="220" fill="none" stroke="#FFFFFF" stroke-opacity="0.2" stroke-width="2"/>
      <circle cx="400" cy="460" r="200" fill="none" stroke="#888888" stroke-opacity="0.3" stroke-width="1"/>

      <!-- Dragon coils vector outline representation -->
      <path d="M 400 200 C 250 200, 200 350, 300 450 C 400 550, 600 450, 500 300 C 420 180, 240 380, 350 600 C 450 780, 600 650, 400 750" fill="none" stroke="url(#silverMetallic)" stroke-width="12" stroke-linecap="round"/>
      <path d="M 390 210 C 260 210, 210 350, 300 440 C 400 530, 580 440, 490 300 C 420 200, 260 380, 350 590 C 440 760, 580 640, 400 740" fill="none" stroke="#CCCCCC" stroke-width="2"/>

      <!-- Floral Lotus motifs -->
      <polygon points="400,130 420,170 400,160 380,170" fill="#FFFFFF"/>
      <polygon points="400,780 425,830 400,815 375,830" fill="#FFFFFF"/>

      <text x="400" y="100" font-family="'Cinzel', serif" font-weight="700" font-size="32" fill="#FFFFFF" letter-spacing="14" text-anchor="middle">${title.toUpperCase()}</text>
      <text x="400" y="900" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="16" fill="#888888" letter-spacing="6" text-anchor="middle">CULTURAL IDENTITY • HERITAGE COLLECTION • 50+ BRAND ARCHIVE</text>
    `;
  } else if (type === 'typography-gothic') {
    content = `
      <rect width="100%" height="100%" fill="#000000"/>
      <!-- Heavy Gothic Framing -->
      <rect x="50" y="50" width="700" height="900" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.3"/>
      <rect x="65" y="65" width="670" height="870" fill="none" stroke="#888888" stroke-width="1" stroke-opacity="0.2"/>

      <!-- Giant Gothic Typography -->
      <g fill="#CCCCCC">
        <text x="400" y="320" font-family="'Unbounded', sans-serif" font-weight="900" font-size="80" text-anchor="middle" letter-spacing="-2">SACRED</text>
        <text x="400" y="440" font-family="'Syne', sans-serif" font-weight="800" font-size="95" text-anchor="middle" fill="#FFFFFF" letter-spacing="-4">${title.toUpperCase()}</text>
        <text x="400" y="560" font-family="'Unbounded', sans-serif" font-weight="900" font-size="80" text-anchor="middle" fill-opacity="0.4" letter-spacing="-2">EDITION</text>
      </g>

      <!-- Fine details -->
      <line x1="150" y1="640" x2="650" y2="640" stroke="#FFFFFF" stroke-width="2"/>
      <text x="400" y="700" font-family="'Space Grotesk', sans-serif" font-size="18" fill="#CCCCCC" letter-spacing="10" text-anchor="middle">HIGH DENSITY PUFF PRINT • HEAVYWEIGHT 450GSM</text>
      <text x="400" y="740" font-family="'Space Grotesk', sans-serif" font-size="14" fill="#888888" letter-spacing="4" text-anchor="middle">DESIGNED BY TAYYABS.DESIGNS • REF: ${variant.toUpperCase()}-GRAPHIC</text>
    `;
  } else if (type === 'jersey-racing') {
    content = `
      <rect width="100%" height="100%" fill="#000000"/>
      <!-- Racing chevrons background -->
      <polygon points="0,0 800,400 800,480 0,80" fill="#FFFFFF" fill-opacity="0.06"/>
      <polygon points="0,200 800,600 800,680 0,280" fill="#FFFFFF" fill-opacity="0.04"/>
      <polygon points="0,400 800,800 800,880 0,480" fill="#FFFFFF" fill-opacity="0.06"/>

      <!-- Racing Number -->
      <text x="400" y="480" font-family="'Unbounded', sans-serif" font-weight="900" font-size="220" fill="none" stroke="#CCCCCC" stroke-width="4" stroke-opacity="0.3" text-anchor="middle">50</text>
      <text x="400" y="450" font-family="'Syne', sans-serif" font-weight="900" font-size="70" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">${title.toUpperCase()}</text>

      <!-- Sponsor Badges -->
      <rect x="150" y="580" width="140" height="40" fill="#121212" stroke="#FFFFFF" stroke-width="1"/>
      <text x="220" y="605" font-family="sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">VELOCITY</text>

      <rect x="330" y="580" width="140" height="40" fill="#121212" stroke="#FFFFFF" stroke-width="1"/>
      <text x="400" y="605" font-family="sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">SUBLIMATED</text>

      <rect x="510" y="580" width="140" height="40" fill="#121212" stroke="#FFFFFF" stroke-width="1"/>
      <text x="580" y="605" font-family="sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">TAYYAB.LAB</text>

      <text x="400" y="850" font-family="'Space Grotesk', sans-serif" font-size="16" fill="#888888" letter-spacing="8" text-anchor="middle">FULL SUBLIMATED ATHLETIC JERSEY GRAPHIC</text>
    `;
  } else if (type === 'illustration-reaper') {
    content = `
      <rect width="100%" height="100%" fill="#000000"/>
      <!-- Moon background -->
      <circle cx="400" cy="420" r="240" fill="#121212" stroke="#CCCCCC" stroke-width="1"/>

      <!-- Abstract skull vector design -->
      <path d="M 400 240 C 300 240 260 320 260 420 C 260 480 290 520 320 540 L 320 600 L 480 600 L 480 540 C 510 520 540 480 540 420 C 540 320 500 240 400 240 Z" fill="none" stroke="#FFFFFF" stroke-width="6"/>
      <circle cx="340" cy="400" r="35" fill="#000000" stroke="#CCCCCC" stroke-width="3"/>
      <circle cx="460" cy="400" r="35" fill="#000000" stroke="#CCCCCC" stroke-width="3"/>
      <polygon points="400,450 385,490 415,490" fill="#FFFFFF"/>
      <!-- Teeth -->
      <line x1="340" y1="560" x2="340" y2="600" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="380" y1="560" x2="380" y2="600" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="420" y1="560" x2="420" y2="600" stroke="#FFFFFF" stroke-width="3"/>
      <line x1="460" y1="560" x2="460" y2="600" stroke="#FFFFFF" stroke-width="3"/>

      <text x="400" y="160" font-family="'Syne', sans-serif" font-weight="800" font-size="44" fill="#FFFFFF" letter-spacing="10" text-anchor="middle">${title.toUpperCase()}</text>
      <text x="400" y="800" font-family="'Space Grotesk', sans-serif" font-weight="600" font-size="16" fill="#888888" letter-spacing="6" text-anchor="middle">HAND-DRAWN VECTOR ILLUSTRATION • SCREEN PRINT SPECIFICATION</text>
    `;
  } else {
    // Techpack
    content = `
      <rect width="100%" height="100%" fill="#0A0A0A"/>
      <rect x="30" y="30" width="740" height="940" fill="none" stroke="#CCCCCC" stroke-width="1"/>
      <line x1="30" y1="120" x2="770" y2="120" stroke="#CCCCCC" stroke-width="1"/>

      <text x="50" y="75" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="24" fill="#FFFFFF">TAYYABS.DESIGNS // TECH SPECIFICATION SHEET</text>
      <text x="50" y="100" font-family="'Space Grotesk', sans-serif" font-size="14" fill="#888888">CLIENT: ${title} | GARMENT TYPE: OVERSIZED HOODIE | SPEC VERSION 4.2</text>

      <!-- Garment Wireframe -->
      <path d="M 250 250 L 320 220 L 400 240 L 480 220 L 550 250 L 650 380 L 580 430 L 540 360 L 540 700 L 260 700 L 260 360 L 220 430 L 150 380 Z" fill="#000000" stroke="#FFFFFF" stroke-width="2"/>
      <!-- Kangaroo pocket -->
      <path d="M 310 520 L 490 520 L 520 670 L 280 670 Z" fill="none" stroke="#CCCCCC" stroke-width="1.5" stroke-dasharray="4 2"/>

      <!-- Measurement callouts -->
      <line x1="120" y1="250" x2="120" y2="700" stroke="#888888" stroke-opacity="0.5" stroke-width="1"/>
      <text x="100" y="475" font-family="sans-serif" font-size="12" fill="#CCCCCC" text-anchor="middle" transform="rotate(-90 100 475)">LENGTH: 74CM</text>

      <line x1="260" y1="740" x2="540" y2="740" stroke="#888888" stroke-opacity="0.5" stroke-width="1"/>
      <text x="400" y="765" font-family="sans-serif" font-size="12" fill="#CCCCCC" text-anchor="middle">CHEST WIDTH: 66CM (OVERSIZED FIT)</text>

      <text x="400" y="880" font-family="'Space Grotesk', sans-serif" font-size="16" fill="#888888" letter-spacing="4" text-anchor="middle">100% PRODUCTION READY TECH PACK & ARTWORK SEPARATIONS</text>
    `;
  }

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${content}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(fullSvg)}`;
};

export const generateGarmentMockupSvg = (
  garmentType: 't-shirt' | 'hoodie' | 'jersey' | 'jacket',
  artworkTitle: string,
  view: 'front' | 'back' = 'front'
): string => {
  const width = 800;
  const height = 950;

  let garmentPath = '';
  if (garmentType === 't-shirt') {
    garmentPath = `M 220 180 L 320 130 C 370 160 430 160 480 130 L 580 180 L 680 320 L 580 380 L 540 310 L 540 820 C 540 830 530 840 520 840 L 280 840 C 270 840 260 830 260 820 L 260 310 L 220 380 L 120 320 Z`;
  } else if (garmentType === 'hoodie') {
    garmentPath = `M 220 220 L 300 180 C 340 100 460 100 500 180 L 580 220 L 700 360 L 600 430 L 550 360 L 550 820 L 250 820 L 250 360 L 200 430 L 100 360 Z`;
  } else if (garmentType === 'jersey') {
    garmentPath = `M 230 150 L 330 120 C 370 140 430 140 470 120 L 570 150 L 640 300 L 560 340 L 530 280 L 530 830 L 270 830 L 270 280 L 240 340 L 160 300 Z`;
  } else {
    // Jacket
    garmentPath = `M 210 200 L 310 140 C 370 170 430 170 490 140 L 590 200 L 690 350 L 600 410 L 560 340 L 560 830 L 240 830 L 240 340 L 200 410 L 110 350 Z`;
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <radialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#1C1C1C"/>
          <stop offset="100%" stop-color="#000000"/>
        </radialGradient>
        <linearGradient id="garmentShade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1F1F1F"/>
          <stop offset="50%" stop-color="#0F0F0F"/>
          <stop offset="100%" stop-color="#050505"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000000" flood-opacity="0.9"/>
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#bgGlow)"/>

      <!-- Hanger hook -->
      <path d="M 400 50 C 380 50 370 70 380 90 C 390 110 410 110 400 130" fill="none" stroke="#FFFFFF" stroke-width="4"/>

      <!-- Garment Shadow & Base -->
      <path d="${garmentPath}" fill="url(#garmentShade)" stroke="#CCCCCC" stroke-opacity="0.3" stroke-width="2" filter="url(#shadow)"/>

      <!-- Garment Seams & Details -->
      <path d="${garmentPath}" fill="none" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1" stroke-dasharray="6 3"/>

      <!-- Inner Neck Tag -->
      <rect x="360" y="160" width="80" height="40" fill="#000000" stroke="#FFFFFF" stroke-width="1"/>
      <text x="400" y="178" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="9" fill="#FFFFFF" text-anchor="middle">TAYYABS.DESIGNS</text>
      <text x="400" y="192" font-family="sans-serif" font-size="8" fill="#888888" text-anchor="middle">MADE IN COLLABORATION • L</text>

      <!-- Center Artwork Placement Area -->
      <g transform="translate(250, 260) scale(0.375)">
        <rect width="800" height="1000" fill="none" stroke="#CCCCCC" stroke-dasharray="10 5" stroke-opacity="0.2"/>

        <!-- Display Artwork Graphic inside mockup -->
        <circle cx="400" cy="450" r="220" fill="none" stroke="#CCCCCC" stroke-width="4"/>
        <polygon points="400,200 580,500 220,500" fill="none" stroke="#FFFFFF" stroke-width="6"/>
        <text x="400" y="470" font-family="'Syne', sans-serif" font-weight="900" font-size="54" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">${artworkTitle.toUpperCase()}</text>
        <text x="400" y="540" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="20" fill="#888888" text-anchor="middle" letter-spacing="8">50+ BRAND ARCHIVE</text>
      </g>

      <!-- Watermark / View Badge -->
      <rect x="40" y="40" width="160" height="34" fill="#000000" fill-opacity="0.9" stroke="#FFFFFF" stroke-opacity="0.3" rx="4"/>
      <text x="120" y="62" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="12" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${garmentType.toUpperCase()} • ${view.toUpperCase()}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

