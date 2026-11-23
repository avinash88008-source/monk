import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { HEADER_NAV, NavCategory } from '../data/monksData';

interface HeaderProps {
  onNavigate: (target: string) => void;
  currentLanguage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentLanguage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>('solutions');

  const mobileOverlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOverlayRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      if (!prefersReducedMotion) {
        gsap.fromTo(
          mobileOverlayRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        );
        gsap.fromTo(
          mobileOverlayRef.current.querySelectorAll('.mobile-nav-item'),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, delay: 0.08, ease: 'power3.out' }
        );
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!activeDropdown || !dropdownRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out' }
      );
    }
  }, [activeDropdown]);

  const activeCategory: NavCategory | undefined = HEADER_NAV.find(
    (item) => item.id === activeDropdown
  );

  const handleMouseEnter = (id: string, hasItems: boolean) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (hasItems) {
      setActiveDropdown(id);
    } else {
      setActiveDropdown(null);
    }
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const handleNavClick = (href?: string) => {
    setActiveDropdown(null);
    setMobileOpen(false);
    if (href) {
      onNavigate(href);
    }
  };

  const isLightHeader = scrolled || activeDropdown !== null;

  return (
    <>
      <header
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isLightHeader
            ? 'bg-[#EAE8E4]/95 backdrop-blur-md text-[#2D2D2D] border-b border-[#2D2D2D]/10'
            : 'bg-transparent text-[#EAE8E4]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-8">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#hero');
            }}
            className="text-[24px] md:text-[26px] font-extrabold tracking-[-0.04em] leading-none whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label="IWON- home"
          >
            IWON-
          </a>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
            {HEADER_NAV.map((item) => {
              const hasItems = Boolean(item.items && item.items.length > 0);
              const isOpen = activeDropdown === item.id;
              return hasItems ? (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => handleMouseEnter(item.id, true)}
                  onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium whitespace-nowrap shrink-0 py-2 hover:opacity-75 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.75}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              ) : (
                <a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => handleMouseEnter(item.id, false)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="text-[14px] font-medium whitespace-nowrap shrink-0 py-2 hover:opacity-75 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
          >
            <Menu size={24} strokeWidth={1.75} />
          </button>
        </div>

        {/* Desktop Dropdown Drawer */}
        {activeCategory && activeCategory.items && (
          <div
            ref={dropdownRef}
            onMouseEnter={() => {
              if (closeTimeoutRef.current) {
                window.clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            className="hidden lg:block border-t border-[#2D2D2D]/10 bg-[#EAE8E4] text-[#2D2D2D] shadow-xl"
          >
            <div className="max-w-[1440px] mx-auto px-10 py-10 grid grid-cols-12 gap-8">
              <div className="col-span-3 pr-6 border-r border-[#2D2D2D]/10">
                <p className="text-[12px] font-medium text-[#6F6C66] mb-2">{activeCategory.label}</p>
                <p className="text-[20px] font-monks-extended leading-tight tracking-tight">
                  Built for speed, precision, and cultural relevance.
                </p>
                <p className="text-[12px] text-[#6F6C66] mt-4">Region: {currentLanguage}</p>
              </div>
              <div className="col-span-9 grid grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-5">
                {activeCategory.items.map((sub) => (
                  <a
                    key={sub.label}
                    href={sub.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(sub.href);
                    }}
                    className="group block p-3 -m-3 rounded-xl hover:bg-[#2D2D2D]/5 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[14px] font-semibold text-[#2D2D2D] group-hover:underline">
                        {sub.label}
                      </span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      />
                    </div>
                    <p className="text-[12px] leading-relaxed text-[#6F6C66]">{sub.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      {mobileOpen && (
        <div
          ref={mobileOverlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 bg-[#191715] text-[#EAE8E4] flex flex-col overflow-y-auto"
        >
          <div className="px-5 h-16 flex items-center justify-between border-b border-[#EAE8E4]/10 shrink-0">
            <span className="text-[24px] font-extrabold tracking-[-0.04em]">IWON-</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
              className="w-11 h-11 inline-flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={24} strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 px-5 py-8 space-y-2">
            {HEADER_NAV.map((item) => {
              const hasItems = Boolean(item.items && item.items.length > 0);
              const isExpanded = mobileExpanded === item.id;
              return (
                <div key={item.id} className="mobile-nav-item border-b border-[#EAE8E4]/10 pb-3">
                  {hasItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(isExpanded ? null : item.id)}
                        className="w-full py-3 flex items-center justify-between text-left text-[22px] font-semibold tracking-tight cursor-pointer"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isExpanded && item.items && (
                        <div className="pl-2 pb-3 grid grid-cols-1 gap-2">
                          {item.items.map((sub) => (
                            <a
                              key={sub.label}
                              href={sub.href}
                              onClick={(e) => {
                                e.preventDefault();
                                handleNavClick(sub.href);
                              }}
                              className="py-2 text-[15px] text-[#EAE8E4]/80 hover:text-white flex items-center justify-between"
                            >
                              <span>{sub.label}</span>
                              <ArrowUpRight size={15} className="opacity-60" />
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="block py-3 text-[22px] font-semibold tracking-tight hover:opacity-80"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-5 border-t border-[#EAE8E4]/10 text-[12px] text-[#EAE8E4]/60 flex items-center justify-between">
            <span>IWON- Global</span>
            <span>{currentLanguage}</span>
          </div>
        </div>
      )}
    </>
  );
};
