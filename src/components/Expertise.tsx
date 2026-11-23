import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERTISE_DATA, ExpertiseItem } from '../data/monksData';
import { TwinButton } from './TwinButton';

gsap.registerPlugin(ScrollTrigger);

interface ExpertiseProps {
  onConnectClick: () => void;
}

export const Expertise: React.FC<ExpertiseProps> = ({ onConnectClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<ExpertiseItem | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.expertise-heading', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.expertise-card', {
        y: 40,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.expertise-grid',
          start: 'top 82%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="bg-[#EAE8E4] text-[#2D2D2D] pt-16 md:pt-24 pb-20 md:pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <h2 className="expertise-heading font-monks-extended text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.1] tracking-[-0.03em] mb-12 md:mb-14">
          Our Expertise
        </h2>

        <div className="expertise-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12 items-start">
          {EXPERTISE_DATA.map((item) => (
            <article key={item.id} className={`expertise-card group ${item.colSpanClass}`}>
              <button
                type="button"
                onClick={() => setActiveItem(item)}
                className="w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2D2D2D]"
              >
                <div className={`w-full overflow-hidden bg-[#DCDAD4] ${item.aspectClass}`}>
                  <img
                    src={item.image}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-5">
                  <p className="text-[12px] font-medium text-[#6F6C66] mb-2">{item.tag}</p>
                  <div className="inline">
                    <h3 className="inline text-[20px] md:text-[22px] font-medium leading-[1.3] tracking-[-0.015em] text-[#2D2D2D] group-hover:underline">
                      {item.title}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2D2D2D] text-[#EAE8E4] ml-3 align-middle transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <ArrowRight size={14} strokeWidth={1.75} />
                    </span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study / Playbook Modal */}
      {activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#EAE8E4] text-[#2D2D2D] max-w-[740px] w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="aspect-[16/9] w-full bg-[#191715] overflow-hidden relative">
              <img src={activeItem.image} alt={activeItem.alt} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                aria-label="Close expertise detail"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#EAE8E4]/95 text-[#2D2D2D] flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[12px] font-medium text-[#6F6C66] mb-2">{activeItem.tag}</p>
              <h3 className="font-monks-extended text-[24px] md:text-[28px] leading-tight mb-4">
                {activeItem.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-[#4A4844] mb-5">{activeItem.summary}</p>
              <ul className="space-y-2 border-t border-[#2D2D2D]/15 pt-4 mb-7">
                {activeItem.highlights.map((pt) => (
                  <li key={pt} className="text-[14px] text-[#2D2D2D] flex items-start gap-2.5">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2D2D2D] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <TwinButton
                label="Discuss this work"
                size="sm"
                onClick={() => {
                  setActiveItem(null);
                  onConnectClick();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
