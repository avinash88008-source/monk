import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TwinButton } from './TwinButton';

gsap.registerPlugin(ScrollTrigger);

interface ConnectProps {
  onReachOut: () => void;
}

export const Connect: React.FC<ConnectProps> = ({ onReachOut }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const circlePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.connect-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      if (circlePathRef.current) {
        const len = circlePathRef.current.getTotalLength();
        gsap.set(circlePathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(circlePathRef.current, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="connect"
      ref={sectionRef}
      className="bg-[#EAE8E4] text-[#2D2D2D] py-20 md:py-32"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-8 items-start">
          <div className="lg:col-span-2 lg:pt-4 connect-reveal">
            <p className="text-[13px] md:text-[14px] font-medium text-[#2D2D2D]">Connect</p>
          </div>

          <div className="lg:col-span-10">
            <h2 className="connect-reveal text-[clamp(2.5rem,5vw,4.35rem)] font-medium leading-[1.08] tracking-[-0.03em] text-[#2D2D2D]">
              What can we do for{' '}
              <span className="relative inline-block">
                you
                <svg
                  aria-hidden="true"
                  viewBox="0 0 180 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="pointer-events-none absolute -left-4 -right-4 -top-4 -bottom-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] text-[#2D2D2D]"
                >
                  <path
                    ref={circlePathRef}
                    d="M36 32C62 10 132 8 158 34C178 54 156 90 104 96C46 102 12 80 16 48C20 22 68 14 128 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              ?
            </h2>

            <div className="connect-reveal mt-10">
              <TwinButton label="Reach out" variant="dark" size="md" onClick={onReachOut} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
