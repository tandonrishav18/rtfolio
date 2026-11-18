import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { EXPERIENCES } from '../data';
import { CertificateGraphic } from './CertificateViews';
import { ExperienceItem } from '../types';
import SpecularButton from './SpecularButton';

interface ExperienceSectionProps {
  onSelectExperience: (item: ExperienceItem) => void;
  onOpenCertificateImage?: (imageSrc: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ 
  onSelectExperience,
  onOpenCertificateImage 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Gentle, smooth spring physics for slow and fluid glide between cards
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 26,
    damping: 34,
    mass: 1.4,
    restDelta: 0.0001
  });

  // Horizontal scroll progression for 3 cards with generous resting plateaus:
  // Card 1 (HCL Tech): Stay (0.00 -> 0.05), Slide out to left (0.05 -> 0.38)
  // Card 2 (Bluestock): Slide in from right (0.05 -> 0.38), Stay (0.38 -> 0.52), Slide out to left (0.52 -> 0.85)
  // Card 3 (AICTE-IBM): Slide in from right (0.52 -> 0.85), Stay (0.85 -> 1.00)
  const card1X = useTransform(smoothProgress, [0.0, 0.05, 0.38, 1.0], ['0%', '0%', '-100%', '-100%']);
  const card2X = useTransform(smoothProgress, [0.0, 0.05, 0.38, 0.52, 0.85, 1.0], ['100%', '100%', '0%', '0%', '-100%', '-100%']);
  const card3X = useTransform(smoothProgress, [0.0, 0.52, 0.85, 1.0], ['100%', '100%', '0%', '0%']);

  const exp1 = EXPERIENCES[0]; // HCL Tech
  const exp2 = EXPERIENCES[1]; // Bluestock Fintech
  const exp3 = EXPERIENCES[2]; // AICTE-IBM SkillsBuild

  const renderCardContent = (exp: ExperienceItem) => {
    const isAicte = exp.id === 'aicte-ibm';
    const isBluestock = exp.id === 'bluestock';
    const isHcl = exp.id === 'hcl-tech';
    const imgSrc = exp.imageUrl || (isAicte ? '/work-exp-aicte.png' : (isBluestock ? '/work-exp-bluestock.png' : '/work-exp-hcl.png'));

    const textContent = (
      <div className="lg:col-span-7 flex flex-col justify-start">
        {/* Role & Company Heading */}
        <div className="mb-4 sm:mb-5">
          <span className="font-mono-code text-[#c01e1e] text-[15px] sm:text-[16px] font-medium tracking-wide uppercase block mb-2 sm:mb-2.5">
            {exp.role}
          </span>
          <h3 className="font-inter font-bold text-[26px] sm:text-[34px] md:text-[42px] lg:text-[46px] xl:text-[52px] text-white uppercase tracking-tight leading-none whitespace-nowrap">
            {exp.company}
          </h3>
        </div>

        {/* Detailed Experience Description - consistent height for seamless horizontal alignment */}
        <p className="font-inter font-normal text-[15px] sm:text-[17px] md:text-[18px] text-justify text-[#b5b5b5] leading-[1.6] mb-6 sm:mb-7 min-h-[110px] sm:min-h-[115px] flex items-center">
          {exp.description}
        </p>

        {/* Specular Metadata Badges (Display Only) & Certificate Action */}
        <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] sm:text-[12px]">
          <SpecularButton
            size="md"
            radius={0}
            tint="#000000"
            tintOpacity={1}
            blur={0}
            textColor="#ffffff"
            lineColor="#B71C1C"
            baseColor="#262626"
            intensity={1.2}
            shineSize={10}
            shineFade={40}
            thickness={1.5}
            speed={1}
            followMouse={false}
            proximity={250}
            autoAnimate={false}
            className="font-mono tracking-wider uppercase text-[11px] sm:text-[12px] cursor-default select-none pointer-events-none"
          >
            <span className="text-white font-medium">{exp.location}</span>
          </SpecularButton>

          <SpecularButton
            size="md"
            radius={0}
            tint="#000000"
            tintOpacity={1}
            blur={0}
            textColor="#ffffff"
            lineColor="#B71C1C"
            baseColor="#262626"
            intensity={1.2}
            shineSize={10}
            shineFade={40}
            thickness={1.5}
            speed={1}
            followMouse={false}
            proximity={250}
            autoAnimate={false}
            className="font-mono tracking-wider uppercase text-[11px] sm:text-[12px] cursor-default select-none pointer-events-none"
          >
            <span className="text-white font-medium">{exp.period}</span>
          </SpecularButton>

          {isBluestock ? (
            <button
              onClick={() => onOpenCertificateImage?.(exp.certificatePdf || '/po.png')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white hover:bg-[#b91c1c] text-black hover:text-white border-2 border-black font-mono-code font-bold text-[13px] sm:text-[14px] tracking-[0.12em] uppercase rounded-none transition-colors duration-200 cursor-pointer select-none active:scale-[0.98] inline-flex items-center justify-center shadow-sm"
            >
              VIEW CERTIFICATE
            </button>
          ) : (
            <a
              href={exp.certificatePdf || (isHcl ? 'https://drive.google.com/file/d/1Ds4AjTypl6VkI7EMRFDjkcV1i1T9TVpd/view?usp=drivesdk' : '/INTERNSHIP_cert.pdf')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white hover:bg-[#b91c1c] text-black hover:text-white border-2 border-black font-mono-code font-bold text-[13px] sm:text-[14px] tracking-[0.12em] uppercase rounded-none transition-colors duration-200 cursor-pointer select-none active:scale-[0.98] inline-flex items-center justify-center shadow-sm"
            >
              VIEW CERTIFICATE
            </a>
          )}
        </div>
      </div>
    );

    const imageContent = (
      <div className="lg:col-span-5 flex justify-start lg:justify-end w-full">
        <div 
          onClick={() => {
            if (isBluestock) {
              onOpenCertificateImage?.(exp.certificatePdf || '/po.png');
            } else if (exp.certificatePdf) {
              window.open(exp.certificatePdf, '_blank');
            }
          }}
          className="w-full max-w-[480px] h-[280px] sm:h-[320px] md:h-[340px] rounded-xl overflow-hidden bg-[#131313] flex items-center justify-center group cursor-pointer transition-shadow duration-500 hover:shadow-2xl"
        >
          <img 
            src={imgSrc}
            alt={`${exp.company} Work Experience`}
            className={`w-full h-full object-contain block select-none rounded-xl transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform ${isBluestock ? 'max-w-[368px]' : ''}`}
          />
        </div>
      </div>
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full h-full">
        {textContent}
        {imageContent}
      </div>
    );
  };

  return (
    <section id="experience" className="pt-20 md:pt-28 pb-16 px-[40px] w-full border-t border-neutral-800/80 bg-[#131313] relative z-20">
      {/* Section Header */}
      <div className="mb-2 sm:mb-3 max-w-7xl mx-auto">
        <div className="pt-1">
          <span className="font-mono-code text-[#c01e1e] text-[18px] sm:text-[20px] font-medium tracking-wide lowercase block mb-2">
            work
          </span>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase font-inter leading-none">
            EXPERIENCE
          </h2>
        </div>
      </div>

      {/* Scroll Pinning Stage for Experiential Cards */}
      <div ref={containerRef} className="relative h-[900vh] max-w-7xl mx-auto mt-1 sm:mt-2">
        {/* Sticky Viewport Container */}
        <div className="sticky top-[60px] sm:top-[72px] w-full h-[600px] sm:h-[550px] lg:h-[500px] overflow-hidden">
          {/* Card 1: HCL Tech (Slides left out of frame from 0% to -100%) */}
          {exp1 && (
            <motion.div
              style={{ x: card1X }}
              className="absolute inset-0 w-full h-full bg-[#131313] px-2 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-2 flex items-center z-10"
            >
              {renderCardContent(exp1)}
            </motion.div>
          )}

          {/* Card 2: Bluestock Fintech (Slides in from right, then slides out to left) */}
          {exp2 && (
            <motion.div
              style={{ x: card2X }}
              className="absolute inset-0 w-full h-full bg-[#131313] px-2 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-2 flex items-center z-20"
            >
              {renderCardContent(exp2)}
            </motion.div>
          )}

          {/* Card 3: AICTE-IBM SkillsBuild (Slides in from right from 100% to 0%) */}
          {exp3 && (
            <motion.div
              style={{ x: card3X }}
              className="absolute inset-0 w-full h-full bg-[#131313] px-2 py-1 sm:px-4 sm:py-2 lg:px-6 lg:py-2 flex items-center z-30"
            >
              {renderCardContent(exp3)}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

