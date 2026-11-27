import React, { useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';

interface CorideWebpageProps {
  isOpen: boolean;
  onClose: () => void;
  onNextProject?: () => void;
}

export const CorideWebpage: React.FC<CorideWebpageProps> = ({ 
  isOpen, 
  onClose, 
  onNextProject 
}) => {
  const savedScrollPositionRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      savedScrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (savedScrollPositionRef.current !== undefined) {
        window.scrollTo({
          top: savedScrollPositionRef.current,
          behavior: 'instant' as ScrollBehavior
        });
      }
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Escape key closes the page
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle "Next project" message from iframe
  useEffect(() => {
    if (!isOpen) return;
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'CORIDE_NEXT_PROJECT') {
        if (onNextProject) {
          onNextProject();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, onNextProject, onClose]);

  return (
    <div
      style={{
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
      }}
      className="fixed inset-0 z-40 bg-[#131313]"
    >
      {/* Back arrow — top-left, same style as other project pages */}
      <div className="fixed top-5 sm:top-6 left-2.5 sm:left-4 z-50">
        <button
          onClick={onClose}
          className="group flex items-center justify-center p-1.5 bg-transparent transition-colors duration-200 cursor-pointer select-none border-0 shadow-none outline-none"
          aria-label="Back to Projects"
        >
          <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 text-black group-hover:text-black stroke-[3] transition-colors duration-200" />
        </button>
      </div>

      {/* Coride static site in a full-screen iframe */}
      <iframe
        src="/coride/index.html"
        title="Co-Ride × Rapido Case Study"
        className="w-full flex-1 border-0"
        style={{ height: '100%' }}
        allow="autoplay"
      />
    </div>
  );
};

export default CorideWebpage;
