import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIDEO_ASSETS } from '../data/monksData';
import { TwinButton } from './TwinButton';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onConnectClick: () => void;
  onScrollDownClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onConnectClick, onScrollDownClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
      });

      if (videoRef.current) {
        gsap.to(videoRef.current, {
          scale: 1.08,
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleHeroVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] flex items-center overflow-hidden bg-[#191715] text-[#EAE8E4]"
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_ASSETS.heroSizzle.localUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover will-change-transform"
        />
        {/* Measured contrast scrim */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55"
          aria-hidden="true"
        />
      </div>

      {/* Hero Copy */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-[1440px] mx-auto px-5 md:px-10 pt-24 pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-8 items-start">
          <div className="lg:col-span-2 lg:pt-4 hero-stagger">
            <p className="text-[13px] md:text-[14px] font-medium tracking-wide text-[#EAE8E4]/95">
              Our Promise
            </p>
          </div>

          <div className="lg:col-span-10">
            <h1 className="hero-stagger text-[clamp(2.6rem,5.4vw,4.75rem)] leading-[1.05] tracking-[-0.025em] max-w-[920px] [text-wrap:balance]">
              <span className="font-monks-serif block lg:inline font-normal">
                Transforming brands
              </span>{' '}
              <span className="font-monks-sans font-medium block mt-1">
                for the real-time world
              </span>
            </h1>

            <div className="hero-stagger mt-8 md:mt-10">
              <TwinButton
                label="Let's connect"
                variant="light"
                size="md"
                onClick={onConnectClick}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hand-drawn Scroll Hint */}
      <button
        type="button"
        onClick={onScrollDownClick}
        aria-label="Scroll to strategic solutions"
        className="hero-stagger absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-white rounded-lg p-1"
      >
        <svg
          width="88"
          height="92"
          viewBox="0 0 88 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-scroll-hint text-[#EAE8E4]/90 group-hover:text-white transition-colors"
        >
          <ellipse
            cx="40"
            cy="26"
            rx="24"
            ry="17"
            transform="rotate(-10 40 26)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <text
            x="40"
            y="29"
            textAnchor="middle"
            fill="currentColor"
            fontSize="10"
            letterSpacing="1.5"
            className="font-monks-sans uppercase font-medium"
          >
            SCROLL
          </text>
          <path
            d="M49 38C64 49 67 68 58 84"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M54 79L58 85L64 81"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Background Video Play/Pause Control */}
      <button
        type="button"
        onClick={toggleHeroVideo}
        aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
        className="absolute bottom-6 right-5 md:right-10 z-10 w-11 h-11 rounded-full border border-[#EAE8E4]/45 bg-black/25 backdrop-blur-sm text-[#EAE8E4] flex items-center justify-center hover:bg-black/50 hover:border-white transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
      >
        {isPlaying ? <Pause size={15} /> : <Play size={15} className="translate-x-[1px]" />}
      </button>
    </section>
  );
};
