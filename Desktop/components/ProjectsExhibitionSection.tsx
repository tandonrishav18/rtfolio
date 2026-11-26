import React, { useEffect, useRef } from 'react';
import './ProjectsExhibitionSection.css';

export interface ExhibitionProjectCard {
  id: string;
  projectId?: string;
  title: string;
  image: string;
}

export const EXHIBITION_PROJECTS: ExhibitionProjectCard[] = [];

export interface ProjectsExhibitionSectionProps {
  onSelectProject?: (projId: string) => void;
}

export function ProjectsExhibitionSection({ onSelectProject }: ProjectsExhibitionSectionProps) {
  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const portfolio = portfolioRef.current;
    const projectCursor = cursorRef.current;

    if (!track || !stage || !portfolio) return;

    const figures = Array.from(portfolio.querySelectorAll<HTMLElement>('figure'));
    const cards = figures.map((element, index) => ({
      element,
      spread: [-1.55, 1.55, -0.95, 0.95, -0.32, 0.32][index],
      lift: [0, 0, 0.28, 0.28, 0.52, 0.52][index],
      tilt: [-4, 4, 3, -3, -1.5, 1.5][index],
      distance: [1, 1, 0.65, 0.65, 0.3, 0.3][index],
      x: 0,
      y: 0,
    }));

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialScale = 0.035;
    const fadeStart = 0.26;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const smootherstep = (value: number) => {
      const t = clamp(value);
      return t ** 3 * (t * (6 * t - 15) + 10);
    };

    // Roots of the damped spring with stiffness 55, damping 32 and mass 1.
    const slow = (-32 + Math.sqrt(32 ** 2 - 4 * 55)) / 2;
    const fast = -32 - slow;
    let progress = 0;
    let velocity = 0;
    let frame = 0;
    let lastTime = 0;
    let scrollDistance = 1;

    function measure() {
      if (!stage || !portfolio || !track) return;
      const clusterUnit = Math.min(stage.clientWidth * 0.035, stage.clientHeight * 0.055);
      const clusterY = stage.clientHeight * 0.78 - portfolio.offsetTop;
      scrollDistance = Math.max(1, track.offsetHeight - stage.offsetHeight);
      for (const card of cards) {
        const { element } = card;
        card.x =
          portfolio.clientWidth / 2 +
          card.spread * clusterUnit -
          element.offsetLeft -
          element.offsetWidth / 2;
        card.y =
          clusterY +
          card.lift * clusterUnit -
          element.offsetTop -
          element.offsetHeight / 2;
      }
    }

    function render() {
      if (!stage) return;
      const opacity = smootherstep((progress - fadeStart) / 0.06);
      stage.style.setProperty('--hint-opacity', String(1 - smootherstep(progress / 0.26)));
      for (const { element, distance, x, y, tilt } of cards) {
        // Symmetrical 3.0s delays & calm blossom:
        // 1. Top delay buffer (0.00 -> 0.32): ~3.0s scroll delay before cards appear, only title visible
        // 2. Calm blossom expansion (0.32 -> 0.68): smooth, gradual card expansion
        // 3. Bottom delay buffer (0.68 -> 1.00): all 6 cards hold at rest for ~3.0s before transitioning to next section
        const start = 0.32 + distance * 0.04;
        const end = 0.62 + distance * 0.06;
        const amount = smootherstep((progress - start) / (end - start));
        const remaining = 1 - amount;
        element.style.setProperty(
          '--reveal-transform',
          amount === 1
            ? 'none'
            : `translate(${x * remaining}px, ${y * remaining}px) rotate(${
                tilt * remaining
              }deg) scale(${initialScale + (1 - initialScale) * amount})`
        );
        element.style.setProperty('--reveal-opacity', String(opacity));
        element.style.setProperty('--reveal-pointer', opacity > 0.1 ? 'auto' : 'none');
      }
    }

    function tick(time: number) {
      frame = 0;
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const scrolled = -trackRect.top;
      const target = clamp(scrolled / scrollDistance);

      if (lastTime === 0) {
        lastTime = time;
      }
      const elapsed = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      // Solve the spring over the elapsed time, even when a frame is dropped.
      const delta = progress - target;
      const slowWeight = (velocity - fast * delta) / (slow - fast);
      const slowTerm = slowWeight * Math.exp(slow * elapsed);
      const fastTerm = (delta - slowWeight) * Math.exp(fast * elapsed);
      progress = target + slowTerm + fastTerm;
      velocity = slow * slowTerm + fast * fastTerm;
      const settled = Math.abs(progress - target) < 0.0001 && Math.abs(velocity) < 0.001;
      if (settled) {
        progress = target;
        velocity = 0;
      } else {
        frame = requestAnimationFrame(tick);
      }
      render();
    }

    function schedule() {
      if (frame || motionPreference.matches) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function updateMotionPreference() {
      cancelAnimationFrame(frame);
      frame = 0;
      velocity = 0;
      lastTime = 0;
      if (!track) return;
      track.classList.toggle('is-animated', !motionPreference.matches);
      if (motionPreference.matches) {
        for (const { element } of cards) element.style.removeProperty('--reveal-opacity');
        return;
      }
      measure();
      const trackRect = track.getBoundingClientRect();
      const scrolled = -trackRect.top;
      progress = clamp(scrolled / scrollDistance);
      render();
    }

    const resizeObserver = new ResizeObserver(() => {
      if (motionPreference.matches) return;
      measure();
      render();
      schedule();
    });
    resizeObserver.observe(stage);

    window.addEventListener('scroll', schedule, { passive: true });
    motionPreference.addEventListener('change', updateMotionPreference);
    updateMotionPreference();

    // Custom cursor handling
    const hideProjectCursor = () => document.body.classList.remove('has-project-cursor');
    const onPointerMove = (event: PointerEvent) => {
      if (!projectCursor) return;
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
        hideProjectCursor();
        return;
      }
      const x = Math.min(event.clientX + 2, window.innerWidth - 56);
      const y = Math.max(5, Math.min(event.clientY - 9, window.innerHeight - 19));
      projectCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      document.body.classList.add('has-project-cursor');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hideProjectCursor);
    window.addEventListener('blur', hideProjectCursor);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener('scroll', schedule);
      motionPreference.removeEventListener('change', updateMotionPreference);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', hideProjectCursor);
      window.removeEventListener('blur', hideProjectCursor);
      hideProjectCursor();
    };
  }, []);

  return (
    <>
      <main
        ref={trackRef}
        id="projects"
        className="gallery-track is-animated bg-[#131313]"
        style={{ backgroundColor: '#131313' }}
      >
        <div id="projects-exhibition" className="absolute top-0 pointer-events-none" />
        <div
          ref={stageRef}
          className="gallery-stage bg-[#131313]"
          style={{ backgroundColor: '#131313' }}
        >
          <div
            ref={portfolioRef}
            className="portfolio bg-[#131313]"
            style={{ backgroundColor: '#131313' }}
          >
            <h1>
              <span className="title">Projects</span> <span className="subtitle">I’m proud of</span>
            </h1>
            <figure
              className="climora is-clickable"
              onClick={() => onSelectProject?.('climora-iot')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject?.('climora-iot');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open Climora Climate Anomaly Detection project"
            >
              <img src="/assets/climora.png" alt="Climora — Climate Anomaly Detection" />
            </figure>
            <figure
              className="cine is-clickable"
              onClick={() => onSelectProject?.('cine-suggest')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject?.('cine-suggest');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open Cine Suggest movie discovery project"
            >
              <img src="/assets/cine.png" alt="Cine Suggest movie discovery interface" />
            </figure>
            <figure
              className="collage is-clickable"
              onClick={() => onSelectProject?.('collage')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject?.('collage');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="I shape things that dont exist"
            >
              <img src="/assets/collage.png" alt="Design portfolio collage" />
            </figure>
            <figure
              className="be is-clickable"
              onClick={() => onSelectProject?.('be-plus')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject?.('be-plus');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open BE+ campaign project"
            >
              <img src="/assets/be-plus.png" alt="BE+ campaign artwork" />
            </figure>
            <figure
              className="ride is-clickable"
              aria-label="Co-ride and Rapido"
              onClick={() => onSelectProject?.('rapido')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject?.('rapido');
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="divider" aria-hidden="true">
                |
              </span>
              <img className="rapido" src="/assets/rapido.png" alt="Rapido" />
              <img className="coride" src="/assets/coride.png" alt="Co-ride" />
            </figure>
            <figure
              className="surplus is-clickable"
              onClick={() => onSelectProject?.('nivala')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectProject?.('nivala');
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Open Nivala leftover food management project"
            >
              <img
                src="/assets/surplus.png"
                alt="Share Surplus, Serve Humanity — illustrated food-sharing project"
              />
            </figure>
          </div>
          <p className="gallery-hint" aria-hidden="true">
            Scroll to reveal ↓
          </p>
        </div>
      </main>
      <div ref={cursorRef} className="project-cursor" aria-hidden="true">
        <span className="project-cursor-inner">
          open<span className="project-cursor-arrow">↗</span>
        </span>
      </div>
    </>
  );
}

export { ProjectsExhibitionSection as IShapeThingsHero };
export default ProjectsExhibitionSection;
