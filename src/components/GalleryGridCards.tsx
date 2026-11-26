import React, { useEffect, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';

export interface GalleryArtwork {
  id: number;
  title: string;
  image: string;
  initial: {
    x: number;
    y: number;
    rotate: number;
    scale: number;
  };
}

export const GALLERY_ARTWORKS: GalleryArtwork[] = [
  // Row 1 (Top Row in final grid):
  {
    id: 1,
    title: 'Crimson Stratum I',
    image: '/gallery/pic_01.jpg',
    initial: { x: 340, y: 320, rotate: -3, scale: 0.35 },
  },
  {
    id: 2,
    title: 'Ochre Seal & Verdigris',
    image: '/gallery/pic_02.jpg',
    initial: { x: 110, y: 310, rotate: 1.5, scale: 0.35 },
  },
  {
    id: 3,
    title: 'Terracotta Horizon',
    image: '/gallery/pic_03.jpg',
    initial: { x: -110, y: 310, rotate: -1.5, scale: 0.35 },
  },
  {
    id: 4,
    title: 'Cyan Glyph Sanctuary',
    image: '/gallery/pic_04.jpg',
    initial: { x: -340, y: 320, rotate: 3, scale: 0.35 },
  },
  // Row 2 (Middle Row in final grid):
  {
    id: 5,
    title: 'Turquoise Strata',
    image: '/gallery/pic_05.jpg',
    initial: { x: 350, y: 140, rotate: -2, scale: 0.35 },
  },
  {
    id: 6,
    title: 'Golden Reliquary',
    image: '/gallery/pic_06.jpg',
    initial: { x: 120, y: 135, rotate: 1, scale: 0.35 },
  },
  {
    id: 7,
    title: 'Sage Spiral Manuscript',
    image: '/gallery/pic_07.jpg',
    initial: { x: -120, y: 135, rotate: -1, scale: 0.35 },
  },
  {
    id: 8,
    title: 'Umber & Vermilion Ray',
    image: '/gallery/pic_08.jpg',
    initial: { x: -350, y: 140, rotate: 2, scale: 0.35 },
  },
  // Row 3 (Bottom Row in final grid):
  {
    id: 9,
    title: 'Patina Columns Triptych',
    image: '/gallery/pic_09.jpg',
    initial: { x: 340, y: -40, rotate: 2, scale: 0.35 },
  },
  {
    id: 10,
    title: 'Nocturnal Crescent Seal',
    image: '/gallery/pic_10.jpg',
    initial: { x: 110, y: -45, rotate: -1.5, scale: 0.35 },
  },
  {
    id: 11,
    title: 'Emerald & Rust Fragment',
    image: '/gallery/pic_11.jpg',
    initial: { x: -110, y: -45, rotate: 1.5, scale: 0.35 },
  },
  {
    id: 12,
    title: 'Azure Coastal Ridge',
    image: '/gallery/pic_12.jpg',
    initial: { x: -340, y: -40, rotate: -2, scale: 0.35 },
  },
];

interface ArtworkCardProps {
  artwork: GalleryArtwork;
  index: number;
  progress: MotionValue<number>;
  isAnyActive: boolean;
  isThisActive: boolean;
  onHover: (id: number | null) => void;
}

const smootherstep = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * c * (c * (c * 6 - 15) + 10);
};

function ArtworkCard({
  artwork,
  index,
  progress,
  isAnyActive,
  isThisActive,
  onHover,
}: ArtworkCardProps) {
  const col = index % 4;
  const row = Math.floor(index / 4);

  const dx = Math.abs((col - 1.5) / 1.5);
  const dy = Math.abs(row - 1.0);
  const centerDist = (dx + dy) * 0.5;

  const startP = 0.0 + centerDist * 0.06;
  const endP = 0.78 + centerDist * 0.12;

  const x = useTransform(progress, (p) => {
    if (p <= startP) return `${artwork.initial.x}px`;
    if (p >= endP) return '0px';
    const t = smootherstep((p - startP) / (endP - startP));
    return `${artwork.initial.x * (1 - t)}px`;
  });

  const y = useTransform(progress, (p) => {
    if (p <= startP) return `${artwork.initial.y}px`;
    if (p >= endP) return '0px';
    const t = smootherstep((p - startP) / (endP - startP));
    return `${artwork.initial.y * (1 - t)}px`;
  });

  const rotate = useTransform(progress, (p) => {
    if (p <= startP) return artwork.initial.rotate;
    if (p >= endP) return 0;
    const t = smootherstep((p - startP) / (endP - startP));
    return artwork.initial.rotate * (1 - t);
  });

  const scale = useTransform(progress, (p) => {
    if (p <= startP) return artwork.initial.scale;
    if (p >= endP) return 1.0;
    const t = smootherstep((p - startP) / (endP - startP));
    return artwork.initial.scale + (1.0 - artwork.initial.scale) * t;
  });

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity: 1,
        pointerEvents: 'auto',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      onMouseEnter={() => onHover(artwork.id)}
      onMouseLeave={() => onHover(null)}
      className="group relative h-full w-full overflow-hidden rounded-[3px] bg-[#131313] border border-white/10 shadow-xl transform-gpu cursor-pointer"
    >
      {/* 50% opacity idle, 100% luminous on hover, 30% for other 11 */}
      <div
        className={`h-full w-full transition-all duration-300 ease-out ${
          isThisActive ? 'opacity-100' : isAnyActive ? 'opacity-30' : 'opacity-50'
        }`}
        style={{
          opacity: isThisActive ? 1 : isAnyActive ? 0.3 : 0.5,
        }}
      >
        <img
          src={artwork.image}
          alt={artwork.title}
          loading="eager"
          decoding="async"
          className={`h-full w-full object-cover object-center transition-all duration-300 ${
            isThisActive ? 'brightness-[1.18] contrast-[1.05]' : 'brightness-100'
          }`}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </div>
    </motion.div>
  );
}

export interface GalleryGridCardsProps {
  progress: MotionValue<number>;
  active?: boolean;
}

export function GalleryGridCards({ progress, active = true }: GalleryGridCardsProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const activeId = hoveredId;
  const isAnyActive = activeId !== null;

  useEffect(() => {
    GALLERY_ARTWORKS.forEach((art) => {
      const img = new Image();
      img.src = art.image;
    });
  }, []);

  if (!active) return null;

  return (
    <div
      onMouseLeave={() => setHoveredId(null)}
      className="absolute inset-0 grid grid-cols-4 grid-rows-[1fr_1.3fr_1fr] gap-2 sm:gap-2.5 md:gap-3 p-2 sm:p-3 md:p-4 z-0 pointer-events-auto"
    >
      {GALLERY_ARTWORKS.map((artwork, index) => (
        <ArtworkCard
          key={artwork.id}
          index={index}
          artwork={artwork}
          progress={progress}
          isAnyActive={isAnyActive}
          isThisActive={activeId === artwork.id}
          onHover={setHoveredId}
        />
      ))}
    </div>
  );
}
