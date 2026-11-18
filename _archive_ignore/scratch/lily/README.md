# LILY Studio Package

This folder contains all standalone components, styles, and assets for **LILY Studio**:
1. **`LilyStudioCard`**: The LILY Studio card displayed in the "What I Bring" section.
2. **`GalaxyButton`**: The custom animated galaxy button with mouse-tracking spring physics and `BIZ UDPMincho` font.
3. **`LilyStudioWebpage`**: The dedicated full-screen webpage overlay for LILY Studio with interactive button overlays and artwork credit.

## Directory Structure
- `lily/components/`
  - `GalaxyButton.tsx`
  - `LilyStudioCard.tsx`
  - `LilyStudioWebpage.tsx`
- `lily/assets/`
  - `LILY.png`
  - `LILY.webp`
  - `fg.png`
  - `btn1_tight.png`
  - `btn2_tight.png`
  - `btn1_hover_overlay.png`
  - `btn2_hover_overlay.png`
- `lily/index.ts`

## Usage Example

```tsx
import { LilyStudioCard, LilyStudioWebpage } from './lily';
import { useState } from 'react';

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <LilyStudioCard onOpenLilyStudio={() => setIsOpen(true)} />
      <LilyStudioWebpage isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
```
