# Project Memory & Instructions

## Checkpoint Reference
- **Checkpoint Tag**: `CHECKPOINT` / `PERFECT_STATE` (commit `ff0fc21` and onwards)
- **Key Features in Verified Perfect State**:
  - **LILY Studio**:
    - Card in "What I Bring" section with GalaxyButton and `/fg.png` spring parallax hover.
    - Full LILY Studio webpage mounted with instantaneous appearance (0ms lag, no delay).
    - High-priority preloads for `/reel1.mp4` and `/LILY.webp` in `index.html`.
    - Immediate video playback upon opening without seeking stall; smooth 200ms fade-out and video reset on close.
    - Static Navbar and clean top-left chevron arrow (`z-[60]`) for closing.
    - Interactive buttons (`VIEW OUR SOCIAL PRESENCE` and `ENTER LILY STUDIO`) with GalaxyButton hover effects.
  - **Beyond the Code (3D Rubik's Cube)**:
    - Smooth opening and closing transitions with ease curve `[0.25, 1, 0.5, 1]` and zero lag.
    - Clean top-left back button without any tooltip or annotation artifacts.
  - **Footer & Contact**:
    - "Handmade with 🫀 and 🧠" note in Caveat font, size 20, positioned on the left side and aligned with the bottom baseline of the right-side social links (LinkedIn).
  - **Branding & Identity**:
    - Title: "Rishav's portfolio".
    - Favicon: `.rt` badge icon.
  - **Typography & 3D Physics Lanyard**:
    - Exact typography layout in `WhatIBringSection.tsx` with dynamic coordinate tracking on letter `I`.
    - 3D Physics Lanyard with custom rope joint lengths (`0.82`), realistic physics, drag & drop, and auto-alignment directly touching the bottom of letter `I` with negligible margin.
    - Custom badge backside image preserved in `public/lanyard-back.png` and hooked to `backImage="/lanyard-back.png"`.
  - **Other Sections**:
    - All assets, Pegboard, DecryptedText, and interactive project modal/webpage flows completely intact and verified.

Whenever the user says **"revert to checkpoint"** or **"go back to checkpoint"**, immediately restore the repository state to `CHECKPOINT` (`git checkout CHECKPOINT -- .` or `git reset --hard CHECKPOINT`) and ensure all files match this state with zero changes lost.
