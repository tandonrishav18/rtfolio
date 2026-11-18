const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

const svgs = {
  // 1. /as1.png - GitHub
  'as1.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#18181b"/>
    <path d="M256 100 C170 100 100 170 100 256 C100 325 145 383 207 404 C215 405 218 401 218 397 C218 393 218 381 218 366 C174 375 165 345 165 345 C158 327 148 322 148 322 C134 312 149 312 149 312 C164 313 172 328 172 328 C186 352 208 345 217 341 C218 331 223 323 227 319 C192 315 155 301 155 241 C155 224 161 210 171 199 C169 195 164 179 173 157 C173 157 186 153 217 174 C230 170 243 168 256 168 C269 168 282 170 295 174 C326 153 339 157 339 157 C348 179 343 195 341 199 C351 210 357 224 357 241 C357 302 320 315 285 319 C291 324 296 334 296 350 C296 373 296 391 296 397 C296 401 299 406 307 404 C369 383 412 325 412 256 C412 170 342 100 256 100 Z" fill="#ffffff"/>
  </svg>`,

  // 2. /11.png - Vercel
  '11.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#f8f9fa"/>
    <polygon points="256,120 400,370 112,370" fill="#000000"/>
  </svg>`,

  // 3. /12.png - Claude
  '12.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#F4EFEA"/>
    <g transform="translate(256,256)">
      <g fill="#D97757">
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(0)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(30)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(60)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(90)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(120)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(150)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(180)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(210)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(240)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(270)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(300)"/>
        <rect x="-16" y="-140" width="32" height="105" rx="16" transform="rotate(330)"/>
        <circle cx="0" cy="0" r="48" fill="#D97757"/>
      </g>
    </g>
  </svg>`,

  // 4. /13.png - VS Code
  '13.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#1e1e1e"/>
    <g transform="translate(110, 110)">
      <path d="M282 32 L220 5 L80 135 L15 80 L0 95 L55 145 L0 195 L15 210 L80 155 L220 285 L282 258 Z" fill="#0066B8"/>
      <path d="M282 32 L220 5 L145 100 L220 190 L282 258 Z" fill="#007ACC"/>
      <path d="M220 5 L80 135 L220 285 Z" fill="#1F9CF0"/>
      <path d="M80 155 L15 210 L0 195 L55 145 Z" fill="#0066B8"/>
    </g>
  </svg>`,

  // 5. /14.png - OpenAI / ChatGPT
  '14.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#ffffff"/>
    <g transform="translate(256, 256) scale(0.65)">
      <path d="M226.7 186.2c7.9-24.3 3.6-50.8-11.4-71.1-22.3-30.2-61.9-42.3-97.7-30.1-13-19.1-33.8-31.5-57.3-33.9-37.4-3.7-72.3 19.3-84.3 54.7-25.1 4.3-46.7 19.6-58.4 41.5-18.4 34.3-13.1 76.6 13 105.4-7.9 24.3-3.6 50.8 11.4 71.1 22.3 30.2 61.9 42.3 97.7 30.1 13 19.1 33.8 31.5 57.3 33.9 37.4 3.7 72.3-19.3 84.3-54.7 25.1-4.3 46.7-19.6 58.4-41.5 18.4-34.3 13.1-76.6-13-105.4zm-143 147.2c-3.7 2.1-8.3 1.9-11.7-.6l-67.9-49.3c-13.4-9.8-19.8-26.6-16.1-42.7 3.7-16.1 16.5-28.1 32.7-30.5l47.9-7.1 2.3 64.9 12.8 65.3zm-39.7-128.2l-37.5 5.5c-15.5 2.3-27.7 13.8-31.2 29.2-3.6 15.4 2.6 31.5 15.4 40.9l67.9 49.3c3.4 2.5 5.2 6.5 4.8 10.7l-4.7 65.3c-1.1 15.7-11.5 29.1-26.4 34.1-14.9 4.9-31.2-.5-41.5-13.7l-52.6-67.1c-2.7-3.4-3.5-8-2-12.1l23.5-62.8 84.3-79.3zm-51.4-86.4c12.3-9.9 29.3-11.9 43.6-5.2l75 35.1c3.8 1.8 8.3 1.5 11.8-.7l57.3-35.8c13.7-8.6 31.5-7.4 44 3.1 12.5 10.5 16.7 27.6 10.7 42.5l-26.3 65.4-53.5-36.9-162.6-67.5zm199.5 90.6l-57.3 35.8c-3.5 2.2-8 2.5-11.8.7l-75-35.1c-14.3-6.7-31.3-4.7-43.6 5.2-12.3 9.9-17 26.6-11.9 41.7l23.5 69.8 65.1-44.5 111-73.6zm-17.7 149.2l-65.1 44.5-23.5 69.8c-5.1 15.1-.4 31.8 11.9 41.7 12.3 9.9 29.3 11.9 43.6 5.2l75-35.1c3.8-1.8 8.3-1.5 11.8.7l57.3 35.8c13.7 8.6 31.5 7.4 44-3.1 12.5-10.5 16.7-27.6 10.7-42.5l-26.3-65.4-139.4-51.6z" fill="#000000"/>
    </g>
  </svg>`,

  // 6. /15.png - Pinterest
  '15.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#ffffff"/>
    <circle cx="256" cy="256" r="160" fill="#E60023"/>
    <path d="M234 350 c-2 -18 3 -36 7 -54 3 -12 7 -27 10 -40 -7 -14 -9 -28 -9 -44 0 -38 22 -66 57 -66 27 0 42 18 42 41 0 29 -18 73 -28 113 -4 16 8 30 24 30 29 0 51 -37 51 -83 0 -57 -39 -99 -107 -99 -75 0 -121 53 -121 114 0 25 9 52 23 68 3 3 3 6 2 10 -3 11 -9 35 -10 39 -2 6 -6 8 -11 6 -42 -19 -61 -70 -61 -113 0 -92 78 -162 186 -162 99 0 164 69 164 150 0 95 -53 166 -132 166 -25 0 -50 -14 -58 -30 l-16 64 c-6 23 -22 51 -33 68 -2 2 -4 3 -6 3 -3 0 -4 -3 -4 -6 z" fill="#ffffff"/>
  </svg>`,

  // 7. /16.png - Google Antigravity
  '16.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#ffffff"/>
    <g transform="translate(140, 140) scale(1.0)">
      <path d="M225.5 120 c0-8 -0.7-15.7-2-23.2 H115 v44 h62.3 c-2.7 14.5-10.8 26.8-23 35 v29.1 h37.3 C213.4 184.8 225.5 155.3 225.5 120 z" fill="#4285F4"/>
      <path d="M115 232.5 c31.7 0 58.3-10.5 77.7-28.5 l-37.3-29.1 c-10.5 7.1-24 11.2-40.4 11.2 c-31.1 0-57.5-21-66.9-49.3 H10.5 v30 C30.2 205.8 69.8 232.5 115 232.5 z" fill="#34A853"/>
      <path d="M48.1 136.8 c-2.4-7.1-3.8-14.7-3.8-22.5 s1.4-15.4 3.8-22.5 V61.8 H10.5 C3.8 75.1 0 90.1 0 114.3 s3.8 39.2 10.5 52.5 L48.1 136.8 z" fill="#FBBC05"/>
      <path d="M115 44.8 c17.2 0 32.7 5.9 44.9 17.5 l33.6-33.6 C173.2 10.2 146.6 0 115 0 C69.8 0 30.2 26.7 10.5 65.8 l37.6 30 C57.5 67.5 83.9 44.8 115 44.8 z" fill="#EA4335"/>
    </g>
  </svg>`,

  // 8. /18.png - Canva
  '18.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="canvaBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C4CC"/>
        <stop offset="40%" stop-color="#7D2AE8"/>
        <stop offset="100%" stop-color="#FF4274"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" fill="url(#canvaBg)"/>
    <g transform="translate(100, 160)">
      <path d="M120 185 C65 185 20 148 20 95 C20 40 68 10 135 10 C180 10 215 32 235 62 L198 88 C185 68 162 52 135 52 C95 52 68 72 68 96 C68 120 95 142 138 142 C168 142 195 128 212 110 L238 135 C210 165 170 185 120 185 Z" fill="#ffffff"/>
      <text x="210" y="145" font-family="sans-serif" font-size="82" font-style="italic" font-weight="900" fill="#ffffff" letter-spacing="-2">anva</text>
    </g>
  </svg>`,

  // 9. /19.png - Figma
  '19.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#1e1e1e"/>
    <g transform="translate(180, 110)">
      <path d="M38 76 C17 76 0 59 0 38 C0 17 17 0 38 0 L76 0 L76 76 L38 76 Z" fill="#F24E1E"/>
      <path d="M114 0 C135 0 152 17 152 38 C152 59 135 76 114 76 L76 76 L76 0 L114 0 Z" fill="#FF7262"/>
      <path d="M114 76 C135 76 152 93 152 114 C152 135 135 152 114 152 C93 152 76 135 76 114 L76 76 L114 76 Z" fill="#1ABCFE"/>
      <path d="M38 152 C17 152 0 135 0 114 C0 93 17 76 38 76 L76 76 L76 152 L38 152 Z" fill="#A259FF"/>
      <path d="M38 228 C17 228 0 211 0 190 C0 169 17 152 38 152 L76 152 L76 190 C76 211 59 228 38 228 Z" fill="#0ACF83"/>
    </g>
  </svg>`,

  // 10. /20.png - GitHub Copilot
  '20.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="96" fill="#0f1117"/>
    <g transform="translate(256, 256) scale(0.65)">
      <path d="M176 -90 C120 -90 40 -60 0 -20 C-40 -60 -120 -90 -176 -90 C-240 -90 -280 -40 -280 40 C-280 130 -180 200 -80 210 L-80 240 L80 240 L80 210 C180 200 280 130 280 40 C280 -40 240 -90 176 -90 Z" fill="#2d333b"/>
      <ellipse cx="-100" cy="50" rx="45" ry="55" fill="#58a6ff"/>
      <ellipse cx="100" cy="50" rx="45" ry="55" fill="#58a6ff"/>
      <circle cx="-100" cy="50" r="22" fill="#ffffff"/>
      <circle cx="100" cy="50" r="22" fill="#ffffff"/>
    </g>
  </svg>`,

  // 11. /21.png - Google Gemini
  '21.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4285F4"/>
        <stop offset="50%" stop-color="#9B72CB"/>
        <stop offset="100%" stop-color="#D96570"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" fill="#111318"/>
    <path d="M256,64 C256,170 170,256 64,256 C170,256 256,342 256,448 C256,342 342,256 448,256 C342,256 256,170 256,64 Z" fill="url(#geminiGrad)"/>
  </svg>`,

  // 12. /ds.png - Antigravity Rainbow Arch
  'ds.png': `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="antiArch" x1="0%" y1="100%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="25%" stop-color="#10b981"/>
        <stop offset="50%" stop-color="#ef4444"/>
        <stop offset="75%" stop-color="#8b5cf6"/>
        <stop offset="100%" stop-color="#3b82f6"/>
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="96" fill="#ffffff"/>
    <path d="M96 420 C110 330 180 120 256 120 C332 120 402 330 416 420 C370 410 335 320 256 240 C177 320 142 410 96 420 Z" fill="url(#antiArch)"/>
  </svg>`
};

async function buildAll() {
  for (const [filename, svg] of Object.entries(svgs)) {
    const dest = path.join(publicDir, filename);
    await sharp(Buffer.from(svg))
      .png()
      .toFile(dest);
    console.log('Created public/' + filename);
  }
}
buildAll();

