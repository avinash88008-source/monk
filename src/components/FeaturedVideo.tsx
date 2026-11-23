import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX, Maximize2, X, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIDEO_ASSETS } from '../data/monksData';

gsap.registerPlugin(ScrollTrigger);

export const FeaturedVideo: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const ovalPathRef = useRef<SVGPathElement>(null);

  const [shouldLoadInline, setShouldLoadInline] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);

  // Lazy-load the circular video only when section approaches viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoadInline(true);
          observer.disconnect();
        }
      },
      { rootMargin: '350px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Smooth background tint transition into signature Monks Pink (#FFB2E8)
      gsap.fromTo(
        sectionRef.current,
        { backgroundColor: '#EAE8E4' },
        {
          backgroundColor: '#FFB2E8',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 25%',
            scrub: true,
          },
        }
      );

      gsap.from('.watch-reveal', {
        y: 30,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      if (ovalPathRef.current) {
        const len = ovalPathRef.current.getTotalLength();
        gsap.set(ovalPathRef.current, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(ovalPathRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.monk-marquee-stage',
            start: 'top 70%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (shouldLoadInline && inlineVideoRef.current) {
      inlineVideoRef.current.play().catch(() => {});
    }
  }, [shouldLoadInline]);

  const openTheaterPlayer = () => {
    setIsModalLoading(true);
    setModalOpen(true);
    setIsModalPlaying(true);
    setIsModalMuted(false);
  };

  const toggleModalPlay = () => {
    const v = modalVideoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setIsModalPlaying(true);
    } else {
      v.pause();
      setIsModalPlaying(false);
    }
  };

  const toggleModalMute = () => {
    const v = modalVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsModalMuted(v.muted);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section
      id="watch"
      ref={sectionRef}
      className="relative bg-[#FFB2E8] text-[#2D2D2D] pt-24 md:pt-32 pb-28 md:pb-36 overflow-hidden transition-colors"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        {/* Top Watch Quote Header */}
        <div className="max-w-[960px] mx-auto mb-16 md:mb-24">
          <p className="watch-reveal text-[13px] md:text-[14px] font-medium text-[#2D2D2D] mb-4">
            Watch
          </p>
          <h2 className="watch-reveal font-monks-extended text-[clamp(1.9rem,3.6vw,3.1rem)] leading-[1.12] tracking-[-0.03em] [text-wrap:balance]">
            Sir Martin Sorrell shares how brands can use first-party data to achieve personalization
            at a massive scale.
          </h2>
        </div>
      </div>

      {/* Marquee & Masked Circular Video Stage */}
      <div className="monk-marquee-stage relative w-full pt-8 pb-32 md:pt-12 md:pb-40">
        {/* Background Outlined Marquee Row */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-x-0 top-1/2 -translate-y-1/2 -mt-12 flex items-center overflow-hidden opacity-90"
        >
          <div className="animate-monks-marquee monks-marquee-outline font-monks-extended text-[125px] md:text-[210px] leading-none whitespace-nowrap">
            <span>meet iwon-&nbsp;meet iwon-&nbsp;meet iwon-&nbsp;</span>
            <span>meet iwon-&nbsp;meet iwon-&nbsp;meet iwon-&nbsp;</span>
          </div>
        </div>

        {/* Foreground "iw [O-Video] n-" Lockup */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10">
          <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-10">
            {/* Left 'iw' + Meet Attribution anchored beneath */}
            <div className="relative flex items-end h-[120px] sm:h-[185px] md:h-[220px]">
              <span
                aria-hidden="true"
                className="font-monks-extended text-[110px] sm:text-[175px] md:text-[225px] leading-[0.82] text-[#2D2D2D] select-none"
              >
                iw
              </span>

              <div className="absolute top-full left-0 mt-5 md:mt-6 whitespace-nowrap">
                <div className="relative inline-flex items-center justify-center px-5 py-1.5 mb-2">
                  <span className="text-[13px] font-medium text-[#2D2D2D]">Meet</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 104 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute inset-0 w-full h-full text-[#2D2D2D]"
                  >
                    <path
                      ref={ovalPathRef}
                      d="M12 22C12 10 34 4 56 5C82 6 98 14 96 24C94 35 72 40 46 39C20 38 6 31 10 19"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-[15px] md:text-[16px] font-semibold leading-snug text-[#2D2D2D]">
                  Sir Martin Sorrell
                </p>
                <p className="text-[14px] md:text-[15px] text-[#2D2D2D]/85">
                  Executive Chairman · Guest Feature
                </p>
              </div>
            </div>

            {/* Center Masked Circular Video ("o") */}
            <button
              type="button"
              onClick={openTheaterPlayer}
              aria-label="Play full Sir Martin Sorrell interview video with audio"
              className="relative w-[195px] h-[195px] sm:w-[290px] sm:h-[290px] md:w-[395px] md:h-[395px] rounded-full overflow-hidden bg-[#2D2D2D] shrink-0 group cursor-pointer shadow-2xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#2D2D2D]"
            >
              <video
                ref={inlineVideoRef}
                src={shouldLoadInline ? VIDEO_ASSETS.sirMartinSorrell.sourceUrl : undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  const vid = e.currentTarget;
                  if (vid.currentTime < 0.5) {
                    vid.currentTime = 1.5;
                  }
                }}
                className="w-full h-full object-cover object-center scale-[1.82] transition-transform duration-700 group-hover:scale-[1.9]"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#2D2D2D]/85 text-[#EAE8E4] backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Play size={22} className="translate-x-[2px]" fill="currentColor" />
                </span>
              </div>
            </button>

            {/* Right 'n-' */}
            <div className="flex items-end h-[120px] sm:h-[185px] md:h-[220px]">
              <span
                aria-hidden="true"
                className="font-monks-extended text-[110px] sm:text-[175px] md:text-[225px] leading-[0.82] text-[#2D2D2D] select-none"
              >
                n-
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Theater Video Modal with Audio & Custom Controls */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Sir Martin Sorrell on first-party data personalization"
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[460px] aspect-[9/16] max-h-[88vh] bg-[#191715] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          >
            <video
              ref={modalVideoRef}
              src={VIDEO_ASSETS.sirMartinSorrell.sourceUrl}
              autoPlay
              playsInline
              muted={isModalMuted}
              onLoadedMetadata={() => {
                if (modalVideoRef.current?.duration) {
                  setDuration(modalVideoRef.current.duration);
                }
                setIsModalLoading(false);
              }}
              onCanPlay={() => setIsModalLoading(false)}
              onWaiting={() => setIsModalLoading(true)}
              onPlaying={() => {
                setIsModalLoading(false);
                setIsModalPlaying(true);
              }}
              onPause={() => setIsModalPlaying(false)}
              onTimeUpdate={() => {
                if (modalVideoRef.current) {
                  setCurrentTime(modalVideoRef.current.currentTime);
                }
              }}
              onClick={toggleModalPlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {isModalLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                <Loader2 size={32} className="text-white animate-spin" />
              </div>
            )}

            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/70 to-transparent flex items-center justify-between text-white">
              <div>
                <p className="text-[12px] text-white/75">Sir Martin Sorrell</p>
                <p className="text-[14px] font-medium">First-Party Data Personalization</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close video player"
                className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white flex items-center gap-3">
              <button
                type="button"
                onClick={toggleModalPlay}
                aria-label={isModalPlaying ? 'Pause' : 'Play'}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {isModalPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <span className="text-[11px] tabular-nums shrink-0">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (modalVideoRef.current) modalVideoRef.current.currentTime = val;
                  setCurrentTime(val);
                }}
                aria-label="Seek video"
                className="flex-1 accent-[#FFB2E8] cursor-pointer"
              />
              <span className="text-[11px] tabular-nums shrink-0 text-white/70">
                {formatTime(duration)}
              </span>
              <button
                type="button"
                onClick={toggleModalMute}
                aria-label={isModalMuted ? 'Unmute' : 'Mute'}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {isModalMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                type="button"
                onClick={() => modalVideoRef.current?.requestFullscreen?.().catch(() => {})}
                aria-label="Fullscreen"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
