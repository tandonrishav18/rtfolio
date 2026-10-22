import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import RubiksCubeApp from './RubiksCube/App.jsx';
import './RubiksCube/styles.css';

interface BeyondCodeWebpageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BeyondCodeWebpage: React.FC<BeyondCodeWebpageProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className="fixed inset-0 z-50 w-screen h-screen bg-[#131313] overflow-hidden select-none rubiks-cube-container"
        >
          {/* 3D Rubik's Cube Gallery Experience */}
          <RubiksCubeApp onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BeyondCodeWebpage;
