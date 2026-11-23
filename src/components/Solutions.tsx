import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOLUTIONS_DATA, SolutionCardData } from '../data/monksData';
import { TwinButton } from './TwinButton';

gsap.registerPlugin(ScrollTrigger);

interface SolutionsProps {
  onNavigateContact: () => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onNavigateContact }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedSolution, setSelectedSolution] = useState<SolutionCardData | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.solutions-heading', {
        y: 30,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.solution-card', {
        y: 44,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.solutions-grid',
          start: 'top 82%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="solutions"
      ref={sectionRef}
      className="relative bg-[#EAE8E4] text-[#2D2D2D] pt-24 md:pt-32 pb-20 md:pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <h2 className="solutions-heading font-monks-extended text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.12] max-w-[1160px] [text-wrap:balance] mb-16 md:mb-24">
          Your trusted partner for innovation across four strategic service offerings:
        </h2>

        <div className="solutions-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7 gap-y-16 items-start">
          {SOLUTIONS_DATA.map((item) => (
            <article
              key={item.number}
              className={`solution-card group relative ${
                item.offsetDown ? 'lg:mt-16' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedSolution(item)}
                className="w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D2D2D] rounded-sm"
              >
                {/* Giant white numeral peeking behind top-right of card */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none block text-right font-monks-extended text-[84px] md:text-[104px] leading-[0.72] text-white/95 pr-1 -mb-6 relative z-0 transition-transform duration-500 group-hover:-translate-y-1.5"
                >
                  {item.number}
                </span>

                {/* Card Image */}
                <div className="relative z-10 w-full aspect-[645/600] overflow-hidden bg-[#DCDAD4]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                {/* Metadata & Title */}
                <div className="mt-5">
                  <p className="text-[12px] font-medium text-[#6F6C66] mb-2">{item.category}</p>
                  <div className="flex items-center gap-3">
                    <h3 className="text-[21px] md:text-[23px] font-medium tracking-[-0.015em] text-[#2D2D2D] group-hover:underline">
                      {item.title}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="w-7 h-7 rounded-full bg-[#2D2D2D] text-[#EAE8E4] inline-flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <ArrowRight size={14} strokeWidth={1.75} />
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-[1.5] text-[#4A4844] max-w-[30ch]">
                    {item.description}
                  </p>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedSolution.title}
          onClick={() => setSelectedSolution(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#EAE8E4] text-[#2D2D2D] max-w-[780px] w-full rounded-2xl overflow-hidden shadow-2xl border border-[#2D2D2D]/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 bg-[#DCDAD4] aspect-[645/600] md:aspect-auto">
                <img
                  src={selectedSolution.image}
                  alt={selectedSolution.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-medium text-[#6F6C66]">
                      {selectedSolution.number} / {selectedSolution.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedSolution(null)}
                      aria-label="Close solution details"
                      className="w-9 h-9 rounded-full bg-[#2D2D2D]/10 hover:bg-[#2D2D2D]/20 inline-flex items-center justify-center cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <h3 className="font-monks-extended text-[28px] leading-tight mb-3">
                    {selectedSolution.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#4A4844] mb-5">
                    {selectedSolution.outcome}
                  </p>
                  <div className="space-y-2.5 border-t border-[#2D2D2D]/15 pt-4">
                    {selectedSolution.pillars.map((pillar) => (
                      <div key={pillar} className="flex items-center gap-2.5 text-[14px] font-medium">
                        <Check size={15} className="text-[#2D2D2D] shrink-0" />
                        <span>{pillar}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-7 pt-4 border-t border-[#2D2D2D]/15">
                  <TwinButton
                    label="Talk to a specialist"
                    size="sm"
                    onClick={() => {
                      setSelectedSolution(null);
                      onNavigateContact();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
