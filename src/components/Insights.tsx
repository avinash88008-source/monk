import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INSIGHTS_DATA, InsightItem } from '../data/monksData';
import { TwinButton } from './TwinButton';

gsap.registerPlugin(ScrollTrigger);

interface InsightsProps {
  onConnectClick: () => void;
}

export const Insights: React.FC<InsightsProps> = ({ onConnectClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedInsight, setSelectedInsight] = useState<InsightItem | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.insights-heading', {
        y: 26,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });

      gsap.from('.insight-row', {
        y: 22,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.insights-list',
          start: 'top 82%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="insights"
      ref={sectionRef}
      className="bg-[#EAE8E4] text-[#2D2D2D] pt-24 md:pt-32 pb-20 md:pb-28"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <h2 className="insights-heading font-monks-extended text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.1] tracking-[-0.03em] mb-14 md:mb-20">
          On our minds
        </h2>

        <div className="insights-list border-t border-[#2D2D2D]/25">
          {INSIGHTS_DATA.map((item) => (
            <article
              key={item.id}
              className="insight-row group border-b border-[#2D2D2D]/25 py-5 md:py-6 transition-colors hover:bg-[#2D2D2D]/[0.03]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-3 lg:gap-x-6 items-center">
                {/* Type */}
                <div className="lg:col-span-2">
                  <span className="text-[13px] font-medium text-[#2D2D2D]/85">{item.type}</span>
                </div>

                {/* Mixed Sans + Serif Title */}
                <div className="lg:col-span-6 pr-4">
                  <button
                    type="button"
                    onClick={() => setSelectedInsight(item)}
                    className="text-left text-[17px] md:text-[18px] leading-[1.35] text-[#2D2D2D] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2D2D]"
                  >
                    <span className="font-semibold tracking-[-0.015em]">{item.titleBold}</span>{' '}
                    <span className="font-monks-serif">{item.titleRegular}</span>
                  </button>
                </div>

                {/* Read time */}
                <div className="lg:col-span-2">
                  <span className="text-[13px] text-[#4A4844] tabular-nums">
                    <strong className="font-semibold text-[#2D2D2D]">
                      {item.readTime.split(' ')[0]} {item.readTime.split(' ')[1]}
                    </strong>{' '}
                    {item.readTime.split(' ').slice(2).join(' ')}
                  </span>
                </div>

                {/* Read now CTA */}
                <div className="lg:col-span-2 flex lg:justify-end">
                  <TwinButton
                    label="Read now"
                    size="sm"
                    variant="dark"
                    onClick={() => setSelectedInsight(item)}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Insight Reader Modal */}
      {selectedInsight && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedInsight.titleBold} ${selectedInsight.titleRegular}`}
          onClick={() => setSelectedInsight(null)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#EAE8E4] text-[#2D2D2D] max-w-[680px] w-full rounded-2xl p-6 md:p-10 shadow-2xl border border-[#2D2D2D]/15"
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <p className="text-[13px] text-[#6F6C66] tabular-nums">
                {selectedInsight.type} · {selectedInsight.readTime}
              </p>
              <button
                type="button"
                onClick={() => setSelectedInsight(null)}
                aria-label="Close insight"
                className="w-9 h-9 rounded-full bg-[#2D2D2D]/10 hover:bg-[#2D2D2D]/20 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <h3 className="text-[24px] md:text-[28px] leading-[1.2] mb-5">
              <span className="font-monks-extended">{selectedInsight.titleBold}</span>{' '}
              <span className="font-monks-serif">{selectedInsight.titleRegular}</span>
            </h3>

            <p className="text-[15px] leading-relaxed text-[#4A4844] mb-6">
              {selectedInsight.summary}
            </p>

            <div className="border-t border-[#2D2D2D]/15 pt-5 mb-7">
              <p className="text-[12px] font-semibold text-[#6F6C66] mb-3">Key Takeaways</p>
              <ul className="space-y-2.5">
                {selectedInsight.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="text-[14px] leading-relaxed flex items-start gap-2.5">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#2D2D2D] shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <TwinButton
              label="Connect with our team"
              size="sm"
              onClick={() => {
                setSelectedInsight(null);
                onConnectClick();
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
};
