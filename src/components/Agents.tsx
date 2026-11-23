import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Pause, Play, Volume2, VolumeX, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VIDEO_ASSETS } from '../data/monksData';
import { TwinButton } from './TwinButton';

gsap.registerPlugin(ScrollTrigger);

interface AgentsProps {
  onExploreMonksFlow: () => void;
}

export const Agents: React.FC<AgentsProps> = ({ onExploreMonksFlow }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(58);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.agents-reveal', {
        y: 32,
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

      if (videoContainerRef.current) {
        gsap.fromTo(
          videoContainerRef.current,
          { y: 36, scale: 0.97, opacity: 0.85 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: videoContainerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (!hasStarted) {
      setHasStarted(true);
      setIsLoading(true);
    }

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        // Fallback if unmuted autoplay blocked by browser policy
        video.muted = true;
        setIsMuted(true);
        await video.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const nextTime = Number(e.target.value);
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  const progressPct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <section
      id="agents"
      ref={sectionRef}
      className="bg-[#EAE8E4] text-[#2D2D2D] pt-16 md:pt-24 pb-20 md:pb-32"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        {/* Heading Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-6 lg:gap-x-8 items-start mb-16 md:mb-24">
          <div className="lg:col-span-3 lg:pt-3 agents-reveal">
            <p className="text-[13px] md:text-[14px] font-medium text-[#2D2D2D]">Our Agents</p>
          </div>

          <div className="lg:col-span-9 max-w-[780px]">
            <h2 className="agents-reveal font-monks-extended text-[clamp(2rem,3.9vw,3.35rem)] leading-[1.08] tracking-[-0.03em] [text-wrap:balance]">
              Your always-on agents for last-mile intelligence — rapid, real, and{' '}
              <span className="text-[#78756E]">powered by IWON- Flow</span>
            </h2>

            <div className="agents-reveal mt-9">
              <TwinButton
                label="Explore IWON- Flow"
                variant="dark"
                size="md"
                onClick={onExploreMonksFlow}
              />
            </div>
          </div>
        </div>

        {/* Interactive Monks.Flow Manifesto Video Showcase */}
        <div
          ref={videoContainerRef}
          onClick={handleTogglePlay}
          className="relative max-w-[1040px] mx-auto aspect-video bg-[#191715] overflow-hidden shadow-lg cursor-pointer group"
        >
          <video
            ref={videoRef}
            src={hasStarted ? VIDEO_ASSETS.monksFlowManifesto.sourceUrl : undefined}
            poster={VIDEO_ASSETS.monksFlowManifesto.posterUrl}
            preload="none"
            playsInline
            muted={isMuted}
            onLoadedMetadata={() => {
              if (videoRef.current && videoRef.current.duration) {
                setDuration(videoRef.current.duration);
              }
              setIsLoading(false);
            }}
            onCanPlay={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
            onPlaying={() => {
              setIsLoading(false);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            className="w-full h-full object-cover"
          />

          {/* Poster fallback image until started */}
          {!hasStarted && (
            <img
              src={VIDEO_ASSETS.monksFlowManifesto.posterUrl}
              alt="IWON- Flow brand manifesto video poster"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* Subtle overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
              isPlaying ? 'bg-black/0 group-hover:bg-black/20' : 'bg-black/20'
            }`}
          />

          {/* Center Watch Video CTA */}
          {(!isPlaying || isLoading) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="inline-flex items-center gap-1 pointer-events-auto">
                <span className="px-5 py-3 rounded-full bg-[#2D2D2D]/95 text-[#EAE8E4] text-[13px] font-medium flex items-center gap-2.5 backdrop-blur-sm">
                  <span>{hasStarted && isLoading ? 'Loading video' : 'Watch video'}</span>
                  <span className="tabular-nums text-[#EAE8E4]/70">
                    {VIDEO_ASSETS.monksFlowManifesto.duration}
                  </span>
                </span>
                <span className="w-11 h-11 rounded-full bg-[#2D2D2D]/95 text-[#EAE8E4] flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
                  {isLoading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Play size={14} className="translate-x-[1px]" fill="currentColor" />
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Custom Bottom Video Control Bar (visible when active) */}
          {hasStarted && (
            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 inset-x-0 px-4 md:px-6 py-3.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent text-[#EAE8E4] flex items-center gap-3 md:gap-4 transition-opacity duration-300 ${
                isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
              }`}
            >
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="translate-x-[1px]" />}
              </button>

              <span className="text-[12px] tabular-nums shrink-0 text-[#EAE8E4]/90">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center">
                <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#EAE8E4] transition-all duration-100"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={currentTime}
                  onChange={handleScrub}
                  aria-label="Seek video progress"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>

              <span className="text-[12px] tabular-nums shrink-0 text-[#EAE8E4]/75">
                {formatTime(duration)}
              </span>

              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>

              <button
                type="button"
                onClick={handleFullscreen}
                aria-label="Toggle fullscreen"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Maximize2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
