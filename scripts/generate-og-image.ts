import sharp from "sharp"
import { writeFileSync } from "fs"
import { join } from "path"

const WIDTH = 1200
const HEIGHT = 630

const svg = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#05071c"/>
        <stop offset="50%" stop-color="#090e2f"/>
        <stop offset="100%" stop-color="#030712"/>
      </linearGradient>

      <radialGradient id="glowMain" cx="0.65" cy="0.5" r="0.55">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.12"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.06"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0"/>
      </radialGradient>

      <radialGradient id="glowTop" cx="0.3" cy="0.15" r="0.3">
        <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#60a5fa" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fcd116"/>
        <stop offset="25%" stop-color="#fbbf24"/>
        <stop offset="55%" stop-color="#60a5fa"/>
        <stop offset="80%" stop-color="#a78bfa"/>
        <stop offset="100%" stop-color="#f472b6"/>
      </linearGradient>

      <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#14142a"/>
        <stop offset="100%" stop-color="#0a0a1a"/>
      </linearGradient>

      <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a0e1a"/>
        <stop offset="100%" stop-color="#16113a"/>
      </linearGradient>

      <linearGradient id="card1Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e293b" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.3"/>
      </linearGradient>

      <linearGradient id="card2Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e293b" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.3"/>
      </linearGradient>

      <linearGradient id="card3Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e293b" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.3"/>
      </linearGradient>

      <linearGradient id="accentBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>

      <linearGradient id="accentGreen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#16a34a"/>
      </linearGradient>

      <linearGradient id="accentOrange" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b"/>
        <stop offset="100%" stop-color="#d97706"/>
      </linearGradient>

      <linearGradient id="progressFill" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#6366f1"/>
        <stop offset="100%" stop-color="#8b5cf6"/>
      </linearGradient>

      <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fcd116"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>

      <linearGradient id="badge1Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e3a5f" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.4"/>
      </linearGradient>

      <linearGradient id="badge2Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a3a2a" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.4"/>
      </linearGradient>

      <filter id="phoneShadow">
        <feDropShadow dx="0" dy="20" stdDeviation="40" flood-color="#000" flood-opacity="0.7"/>
      </filter>
      <filter id="badgeShadow">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

    <!-- Subtle grid -->
    <g stroke="#ffffff" stroke-opacity="0.012" stroke-width="0.5">
      <line x1="0" y1="90" x2="1200" y2="90"/>
      <line x1="0" y1="180" x2="1200" y2="180"/>
      <line x1="0" y1="270" x2="1200" y2="270"/>
      <line x1="0" y1="360" x2="1200" y2="360"/>
      <line x1="0" y1="450" x2="1200" y2="450"/>
      <line x1="0" y1="540" x2="1200" y2="540"/>
      <line x1="200" y1="0" x2="200" y2="630"/>
      <line x1="400" y1="0" x2="400" y2="630"/>
      <line x1="600" y1="0" x2="600" y2="630"/>
      <line x1="800" y1="0" x2="800" y2="630"/>
      <line x1="1000" y1="0" x2="1000" y2="630"/>
    </g>

    <!-- Ambient glows -->
    <circle cx="780" cy="315" r="450" fill="url(#glowMain)"/>
    <circle cx="360" cy="95" r="300" fill="url(#glowTop)"/>

    <!-- ==================== LEFT SIDE ==================== -->

    <!-- Logo -->
    <g transform="translate(55, 45)">
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
      <text x="20" y="27" font-family="system-ui, sans-serif" font-size="17" font-weight="800" text-anchor="middle" fill="#0b1220">DC</text>
    </g>

    <!-- Title -->
    <text x="55" y="210" font-family="system-ui, sans-serif" font-size="78" font-weight="800" letter-spacing="-2.5" fill="url(#titleGrad)">Digital</text>
    <text x="55" y="285" font-family="system-ui, sans-serif" font-size="78" font-weight="800" letter-spacing="-2.5" fill="url(#titleGrad)">Coordinator</text>

    <!-- Subtle divider -->
    <rect x="55" y="315" width="40" height="2.5" rx="1.25" fill="#a78bfa" opacity="0.35"/>

    <!-- Subtitle -->
    <text x="55" y="350" font-family="system-ui, sans-serif" font-size="18" fill="#cbd5e1" font-weight="500" letter-spacing="-0.05">Onboarding platform for</text>
    <text x="55" y="372" font-family="system-ui, sans-serif" font-size="18" fill="#cbd5e1" font-weight="500" letter-spacing="-0.05">international workers</text>

    <!-- Tagline -->
    <text x="55" y="405" font-family="system-ui, sans-serif" font-size="13" fill="#64748b" font-weight="400">Helping people relocate with confidence.</text>

    <!-- ==================== RIGHT SIDE ==================== -->

    <!-- Connecting lines to badges -->
    <line x1="930" y1="195" x2="960" y2="195" stroke="#334155" stroke-width="0.5" stroke-dasharray="3,3"/>
    <line x1="930" y1="435" x2="960" y2="435" stroke="#334155" stroke-width="0.5" stroke-dasharray="3,3"/>

    <!-- ===== PHONE MOCKUP (20% larger) ===== -->
    <g transform="translate(810, 315)" filter="url(#phoneShadow)">
      <!-- Phone body -->
      <rect x="-109" y="-222" width="218" height="444" rx="32" fill="url(#phoneBody)" stroke="#2a2a4a" stroke-width="0.8"/>

      <!-- Side buttons -->
      <rect x="109" y="-140" width="2.5" height="32" rx="1" fill="#1a1a33"/>
      <rect x="109" y="-96" width="2.5" height="44" rx="1" fill="#1a1a33"/>
      <rect x="-111.5" y="-118" width="2.5" height="40" rx="1" fill="#1a1a33"/>

      <!-- Screen -->
      <rect x="-102" y="-215" width="204" height="430" rx="6" fill="url(#screenGrad)"/>

      <!-- Camera notch -->
      <rect x="-30" y="-206" width="60" height="18" rx="9" fill="#0a0a1a"/>

      <!-- === SCREEN CONTENT === -->

      <!-- Status bar -->
      <text x="-88" y="-194" font-family="system-ui, sans-serif" font-size="10" fill="#64748b" font-weight="600">9:41</text>
      <rect x="70" y="-202" width="16" height="2.5" rx="1" fill="#22c55e" opacity="0.5"/>
      <rect x="70" y="-196" width="16" height="2.5" rx="1" fill="#22c55e" opacity="0.35"/>
      <rect x="70" y="-190" width="16" height="2.5" rx="1" fill="#475569"/>

      <!-- Welcome header area -->
      <rect x="-102" y="-185" width="204" height="34" fill="#0f0f25"/>
      <text x="-88" y="-163" font-family="system-ui, sans-serif" font-size="14" fill="#e2e8f0" font-weight="600">Welcome, Maria</text>
      <text x="86" y="-163" font-family="system-ui, sans-serif" font-size="14">👋</text>

      <!-- Divider line -->
      <line x1="-88" y1="-145" x2="88" y2="-145" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.5"/>

      <!-- Section title -->
      <text x="-88" y="-128" font-family="system-ui, sans-serif" font-size="11" fill="#94a3b8" font-weight="500" letter-spacing="0.3">ONBOARDING PROGRESS</text>

      <!-- Progress bar -->
      <rect x="-88" y="-114" width="176" height="6" rx="3" fill="#1e293b"/>
      <rect x="-88" y="-114" width="132" height="6" rx="3" fill="url(#progressFill)"/>
      <text x="96" y="-110" font-family="system-ui, sans-serif" font-size="10" fill="#a78bfa" font-weight="600">75%</text>

      <!-- === ONBOARDING CARDS === -->

      <!-- Card 1: Documents -->
      <g transform="translate(0, -92)">
        <rect x="-88" y="0" width="176" height="42" rx="10" fill="url(#card1Grad)" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.5"/>
        <rect x="-88" y="0" width="3" height="42" rx="1.5" fill="url(#accentBlue)"/>
        <text x="-70" y="26" font-size="16">📄</text>
        <text x="-46" y="20" font-family="system-ui, sans-serif" font-size="12" fill="#e2e8f0" font-weight="600">Documents</text>
        <text x="-46" y="33" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" font-weight="400">Upload your passport</text>
        <circle cx="76" cy="21" r="9" fill="#22c55e" fill-opacity="0.15"/>
        <text x="76" y="25" font-family="system-ui, sans-serif" font-size="9" fill="#22c55e" text-anchor="middle" font-weight="700">✓</text>
      </g>

      <!-- Card 2: Accommodation -->
      <g transform="translate(0, -44)">
        <rect x="-88" y="0" width="176" height="42" rx="10" fill="url(#card2Grad)" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.5"/>
        <rect x="-88" y="0" width="3" height="42" rx="1.5" fill="url(#accentGreen)"/>
        <text x="-70" y="26" font-size="16">🏠</text>
        <text x="-46" y="20" font-family="system-ui, sans-serif" font-size="12" fill="#e2e8f0" font-weight="600">Accommodation</text>
        <text x="-46" y="33" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" font-weight="400">Housing details pending</text>
        <circle cx="76" cy="21" r="9" fill="#f59e0b" fill-opacity="0.15"/>
        <text x="76" y="25" font-family="system-ui, sans-serif" font-size="9" fill="#f59e0b" text-anchor="middle" font-weight="700">→</text>
      </g>

      <!-- Card 3: Before Arrival -->
      <g transform="translate(0, 4)">
        <rect x="-88" y="0" width="176" height="42" rx="10" fill="url(#card3Grad)" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.5"/>
        <rect x="-88" y="0" width="3" height="42" rx="1.5" fill="url(#accentOrange)"/>
        <text x="-70" y="26" font-size="16">🛬</text>
        <text x="-46" y="20" font-family="system-ui, sans-serif" font-size="12" fill="#e2e8f0" font-weight="600">Before Arrival</text>
        <text x="-46" y="33" font-family="system-ui, sans-serif" font-size="9" fill="#64748b" font-weight="400">Travel checklist ready</text>
        <circle cx="76" cy="21" r="9" fill="#22c55e" fill-opacity="0.15"/>
        <text x="76" y="25" font-family="system-ui, sans-serif" font-size="9" fill="#22c55e" text-anchor="middle" font-weight="700">✓</text>
      </g>

      <!-- Bottom nav -->
      <rect x="-70" y="198" width="140" height="4" rx="2" fill="#ffffff" fill-opacity="0.06"/>
    </g>

    <!-- ===== FLOATING BADGES (only 2) ===== -->

    <!-- Badge 1: Documents -->
    <g transform="translate(968, 195)" filter="url(#badgeShadow)">
      <rect x="-54" y="-18" width="108" height="36" rx="18" fill="url(#badge1Grad)" stroke="#3b82f6" stroke-opacity="0.2" stroke-width="0.5"/>
      <text x="-38" y="6" font-size="14">📄</text>
      <text x="-20" y="6" font-family="system-ui, sans-serif" font-size="12" fill="#e2e8f0" font-weight="700">Documents</text>
    </g>

    <!-- Badge 2: Accommodation -->
    <g transform="translate(968, 435)" filter="url(#badgeShadow)">
      <rect x="-58" y="-18" width="116" height="36" rx="18" fill="url(#badge2Grad)" stroke="#22c55e" stroke-opacity="0.2" stroke-width="0.5"/>
      <text x="-42" y="6" font-size="14">🏠</text>
      <text x="-24" y="6" font-family="system-ui, sans-serif" font-size="12" fill="#e2e8f0" font-weight="700">Accommodation</text>
    </g>

    <!-- ===== DECORATIVE PARTICLES ===== -->
    <circle cx="560" cy="160" r="1.5" fill="#60a5fa" opacity="0.2"/>
    <circle cx="580" cy="520" r="1" fill="#a78bfa" opacity="0.15"/>
    <circle cx="680" cy="100" r="1" fill="#60a5fa" opacity="0.15"/>
    <circle cx="650" cy="560" r="1.5" fill="#fcd116" opacity="0.12"/>

    <!-- ===== URL ===== -->
    <text x="1140" y="600" font-family="system-ui, sans-serif" font-size="11" fill="#1e293b" font-weight="500" text-anchor="end" letter-spacing="1.5">digitalcoordinator.eu</text>

    <!-- Outer frame -->
    <rect x="25" y="25" width="1150" height="580" rx="8" fill="none" stroke="#1e293b" stroke-width="0.5" opacity="0.25"/>
  </svg>`,
)

async function main() {
  const buf = await sharp(svg)
    .resize(WIDTH, HEIGHT)
    .jpeg({ quality: 95 })
    .toBuffer()

  const outPath = join(process.cwd(), "public", "og-image.jpg")
  writeFileSync(outPath, buf)
  console.log("✅ OG image generated:", outPath, `(${buf.length} bytes)`)
}

main().catch(console.error)
