import React from 'react';

interface ViewGalleryButtonProps {
  onClick?: () => void;
  label?: string;
  onHoverChange?: (hovered: boolean) => void;
}

export function ViewGalleryButton({
  onClick,
  label = 'View My Gallery',
  onHoverChange,
}: ViewGalleryButtonProps) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      onClick={onClick}
      className="gallery-cta pointer-events-auto relative inline-flex h-[50px] w-full max-w-[260px] items-center justify-center rounded-full px-9 text-[15px] font-medium tracking-[0.01em] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffd51c]"
    >
      {/* Deep dark interior revealed as solid white fill fades out */}
      <span
        aria-hidden="true"
        className="gallery-cta-backdrop absolute inset-[1.5px] rounded-full bg-[#040404]/85"
      />
      {/* Rest-state solid crisp white pill fill */}
      <span
        aria-hidden="true"
        className="gallery-cta-fill absolute inset-0 rounded-full bg-[#FFFFFF]"
      />
      {/* Base white curved top & bottom border revealed during transition */}
      <span
        aria-hidden="true"
        className="gallery-cta-border-white absolute inset-0 rounded-full border-[2.5px] border-[#FFFFFF]"
      />
      {/* Gold top arc sweeping smoothly from right -> left */}
      <span
        aria-hidden="true"
        className="gallery-cta-gold-top absolute inset-0 rounded-full border-[2.5px] border-[#ffd51c]"
      />
      {/* Gold bottom arc sweeping smoothly from left -> right after top completes */}
      <span
        aria-hidden="true"
        className="gallery-cta-gold-bottom absolute inset-0 rounded-full border-[2.5px] border-[#ffd51c]"
      />
      <span className="gallery-cta-label relative z-10 font-sans">
        {label}
      </span>
    </button>
  );
}
