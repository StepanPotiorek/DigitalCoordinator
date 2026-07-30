import sharp from "sharp"
import { writeFileSync } from "fs"
import { join } from "path"

const WIDTH = 1200
const HEIGHT = 630

const svg = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#070b15"/>
        <stop offset="50%" stop-color="#0a1025"/>
        <stop offset="100%" stop-color="#030712"/>
      </linearGradient>
      <radialGradient id="glowCenter" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="glowOrb" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fcd116"/>
        <stop offset="20%" stop-color="#facc15"/>
        <stop offset="45%" stop-color="#60a5fa"/>
        <stop offset="70%" stop-color="#a78bfa"/>
        <stop offset="100%" stop-color="#f87171"/>
      </linearGradient>
      <linearGradient id="orbitGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.4"/>
        <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fcd116" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ce1126" stop-opacity="0.6"/>
      </linearGradient>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fcd116"/>
        <stop offset="100%" stop-color="#ea580c"/>
      </linearGradient>
      <linearGradient id="pill1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e293b" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.3"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

    <!-- Ambient glows -->
    <circle cx="160" cy="80" r="360" fill="url(#glowCenter)"/>
    <circle cx="1000" cy="500" r="340" fill="url(#glowOrb)"/>
    <circle cx="850" cy="300" r="200" fill="url(#glowCenter)"/>

    <!-- ===== LOGO ===== -->
    <g transform="translate(60, 55)">
      <rect width="48" height="48" rx="12" fill="url(#logoGrad)"/>
      <text x="24" y="32" font-family="system-ui, sans-serif" font-size="20" font-weight="800" text-anchor="middle" fill="#0b1220">DC</text>
    </g>
    <text x="122" y="85" font-family="system-ui, sans-serif" font-size="13" fill="#64748b" font-weight="600" letter-spacing="2">DIGITAL COORDINATOR</text>

    <!-- ===== TITLE ===== -->
    <text x="60" y="240" font-family="system-ui, sans-serif" font-size="108" font-weight="800" letter-spacing="-3" fill="url(#titleGrad)">Digital</text>
    <text x="60" y="335" font-family="system-ui, sans-serif" font-size="108" font-weight="800" letter-spacing="-3" fill="url(#titleGrad)">Coordinator</text>

    <rect x="60" y="370" width="72" height="3" rx="1.5" fill="#fcd116" opacity="0.6"/>

    <!-- ===== SUBTITLE ===== -->
    <text x="60" y="425" font-family="system-ui, sans-serif" font-size="24" fill="#cbd5e1" font-weight="500" letter-spacing="-0.2">Helping Filipino workers relocate with confidence.</text>

    <!-- ===== DESCRIPTION ===== -->
    <text x="60" y="465" font-family="system-ui, sans-serif" font-size="14" fill="#64748b" font-weight="400">AI-powered onboarding platform for working and living in the Czech Republic.</text>

    <!-- ===== FEATURE PILLS ===== -->
    <g transform="translate(60, 500)">
      <rect width="140" height="34" rx="17" fill="url(#pill1)" stroke="#334155" stroke-width="0.5"/>
      <text x="14" y="24" font-size="14">✈️</text>
      <text x="36" y="24" font-family="system-ui, sans-serif" font-size="13" fill="#e2e8f0" font-weight="500">Before Arrival</text>
    </g>
    <g transform="translate(215, 500)">
      <rect width="125" height="34" rx="17" fill="url(#pill1)" stroke="#334155" stroke-width="0.5"/>
      <text x="14" y="24" font-size="14">📄</text>
      <text x="36" y="24" font-family="system-ui, sans-serif" font-size="13" fill="#e2e8f0" font-weight="500">Documents</text>
    </g>
    <g transform="translate(355, 500)">
      <rect width="140" height="34" rx="17" fill="url(#pill1)" stroke="#334155" stroke-width="0.5"/>
      <text x="14" y="24" font-size="14">🏠</text>
      <text x="36" y="24" font-family="system-ui, sans-serif" font-size="13" fill="#e2e8f0" font-weight="500">Accommodation</text>
    </g>
    <g transform="translate(510, 500)">
      <rect width="125" height="34" rx="17" fill="url(#pill1)" stroke="#334155" stroke-width="0.5"/>
      <text x="14" y="24" font-size="14">🤖</text>
      <text x="36" y="24" font-family="system-ui, sans-serif" font-size="13" fill="#e2e8f0" font-weight="500">AI Assistant</text>
    </g>

    <!-- ===== RIGHT SIDE — ONBOARDING JOURNEY ILLUSTRATION ===== -->

    <!-- Orbit ring (journey path) -->
    <circle cx="880" cy="300" r="155" fill="none" stroke="url(#orbitGrad)" stroke-width="1.5" stroke-dasharray="6,8"/>
    <circle cx="880" cy="300" r="155" fill="none" stroke="#1e293b" stroke-width="0.5"/>

    <!-- Inner decorative ring -->
    <circle cx="880" cy="300" r="100" fill="none" stroke="#1e293b" stroke-width="0.3"/>

    <!-- Hub glow -->
    <circle cx="880" cy="300" r="30" fill="#3b82f6" fill-opacity="0.06"/>
    <circle cx="880" cy="300" r="6" fill="#3b82f6" fill-opacity="0.3"/>
    <circle cx="880" cy="300" r="2" fill="#60a5fa"/>

    <!-- ===== JOURNEY NODES ===== -->

    <!-- Node 1: Plane/Travel (top-right, 45deg from center) -->
    <g transform="translate(989, 190)">
      <circle r="28" fill="#0f172a" fill-opacity="0.7" stroke="#334155" stroke-width="0.5"/>
      <circle r="22" fill="#1e3a5f" fill-opacity="0.3" stroke="#3b82f6" stroke-width="0.5"/>
      <path d="M-8,-6 L0,-12 L8,-6 M0,-12 L0,8 M-5,2 L0,8 L5,2" stroke="#60a5fa" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>

    <!-- Node 2: Documents (bottom-right, 135deg from center) -->
    <g transform="translate(989, 410)">
      <circle r="28" fill="#0f172a" fill-opacity="0.7" stroke="#334155" stroke-width="0.5"/>
      <circle r="22" fill="#1a1a3a" fill-opacity="0.3" stroke="#a78bfa" stroke-width="0.5"/>
      <rect x="-9" y="-6" width="12" height="15" rx="2" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
      <rect x="-3" y="-1" width="6" height="2" rx="1" fill="#a78bfa" opacity="0.6"/>
      <rect x="-3" y="3" width="6" height="1.5" rx="0.75" fill="#a78bfa" opacity="0.6"/>
    </g>

    <!-- Node 3: Accommodation (bottom-left, 225deg from center) -->
    <g transform="translate(771, 410)">
      <circle r="28" fill="#0f172a" fill-opacity="0.7" stroke="#334155" stroke-width="0.5"/>
      <circle r="22" fill="#1a2a1a" fill-opacity="0.3" stroke="#22c55e" stroke-width="0.5"/>
      <path d="M-10,4 L0,-8 L10,4" stroke="#22c55e" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="-6" y="0" width="12" height="8" rx="1.5" fill="none" stroke="#22c55e" stroke-width="1.2"/>
      <rect x="-3" y="3" width="6" height="5" rx="1" fill="#22c55e" fill-opacity="0.2" stroke="none"/>
    </g>

    <!-- Node 4: AI Assistant (top-left, 315deg from center) -->
    <g transform="translate(771, 190)">
      <circle r="28" fill="#0f172a" fill-opacity="0.7" stroke="#334155" stroke-width="0.5"/>
      <circle r="22" fill="#2a1a3a" fill-opacity="0.3" stroke="#f59e0b" stroke-width="0.5"/>
      <circle cx="0" cy="-2" r="6" fill="none" stroke="#fcd116" stroke-width="1.2"/>
      <path d="M-3,-4 L0,-8 L3,-4" stroke="#fcd116" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path d="M-3,0 L0,4 L3,0" stroke="#fcd116" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    </g>

    <!-- Node labels -->
    <text x="989" y="238" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" font-weight="500" text-anchor="middle">Travel</text>
    <text x="989" y="458" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" font-weight="500" text-anchor="middle">Documents</text>
    <text x="771" y="458" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" font-weight="500" text-anchor="middle">Stay</text>
    <text x="771" y="238" font-family="system-ui, sans-serif" font-size="11" fill="#64748b" font-weight="500" text-anchor="middle">AI Guide</text>

    <!-- Connection path between nodes (onboarding flow) -->
    <path d="M 989 218 C 1020 250 1020 350 989 382" stroke="#1e293b" stroke-width="1" fill="none"/>
    <path d="M 989 438 C 960 470 900 470 880 470 C 860 470 800 470 771 438" stroke="#1e293b" stroke-width="1" fill="none"/>
    <path d="M 771 382 C 740 350 740 250 771 218" stroke="#1e293b" stroke-width="1" fill="none"/>
    <path d="M 771 162 C 800 140 850 140 880 140 C 910 140 960 140 989 162" stroke="#1e293b" stroke-width="1" fill="none"/>

    <!-- Floating accent particles -->
    <circle cx="850" cy="200" r="2" fill="#60a5fa" opacity="0.4"/>
    <circle cx="920" cy="250" r="1.5" fill="#a78bfa" opacity="0.3"/>
    <circle cx="840" cy="380" r="1.5" fill="#22c55e" opacity="0.3"/>
    <circle cx="930" cy="350" r="2" fill="#fcd116" opacity="0.4"/>

    <!-- ===== PHILIPPINES → CZECH REPUBLIC CONNECTION ===== -->
    <g transform="translate(690, 480)">
      <!-- Arc connecting two points -->
      <path d="M 0,0 Q 60,-30 120,0" stroke="url(#arcGrad)" stroke-width="1.5" fill="none"/>

      <!-- PH dot -->
      <circle cx="0" cy="0" r="12" fill="#fcd116" fill-opacity="0.15"/>
      <circle cx="0" cy="0" r="6" fill="#fcd116"/>
      <text x="-15" y="-15" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8" font-weight="500" text-anchor="middle">PH</text>

      <!-- Arrow -->
      <polygon points="58,-8 64,-3 58,2" fill="#475569"/>

      <!-- CZ dot -->
      <circle cx="120" cy="0" r="12" fill="#ce1126" fill-opacity="0.15"/>
      <circle cx="120" cy="0" r="6" fill="#ce1126"/>
      <text x="135" y="-15" font-family="system-ui, sans-serif" font-size="10" fill="#94a3b8" font-weight="500" text-anchor="middle">CZ</text>
    </g>

    <!-- Verified badge floating -->
    <g transform="translate(1010, 280)">
      <circle r="14" fill="#22c55e" fill-opacity="0.12"/>
      <circle r="10" fill="none" stroke="#22c55e" stroke-width="1.2"/>
      <path d="M-4,0 L-1,3 L4,-2" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </g>

    <!-- ===== URL ===== -->
    <text x="1140" y="570" font-family="system-ui, sans-serif" font-size="13" fill="#475569" font-weight="500" text-anchor="end">digitalcoordinator.eu</text>

    <!-- ===== DECORATIVE OUTER FRAME ===== -->
    <rect x="30" y="30" width="1140" height="570" fill="none" stroke="#1e293b" stroke-width="0.5" opacity="0.4"/>
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
