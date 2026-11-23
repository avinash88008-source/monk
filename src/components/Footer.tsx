import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import {
  FOOTER_POLICY_LINKS,
  FOOTER_PRIMARY_LINKS,
  LANGUAGES,
} from '../data/monksData';
import { TwinButton } from './TwinButton';

interface FooterProps {
  onNavigate: (target: string) => void;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  currentLanguage,
  onLanguageChange,
}) => {
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [selectedLangDraft, setSelectedLangDraft] = useState(currentLanguage);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [newsletterFirst, setNewsletterFirst] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterError, setNewsletterError] = useState<string | null>(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [policyToast, setPolicyToast] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterFirst.trim()) {
      setNewsletterError('Please enter your first name.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim());
    if (!emailOk) {
      setNewsletterError('Please enter a valid email address.');
      return;
    }
    setNewsletterError(null);
    setNewsletterSuccess(true);
  };

  return (
    <footer id="footer" className="bg-[#191715] text-[#EAE8E4] pt-20 md:pt-28 pb-12">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        {/* Top Multi-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 pb-20 md:pb-28">
          {/* Col 1: Keep Exploring */}
          <div className="md:col-span-3">
            <h2 className="text-[14px] font-medium text-[#EAE8E4]">Keep Exploring...</h2>
          </div>

          {/* Col 2: Large Nav Links */}
          <div className="md:col-span-3">
            <ul className="space-y-2.5">
              {FOOTER_PRIMARY_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.href);
                    }}
                    className="inline-block text-[30px] md:text-[38px] font-normal leading-[1.15] tracking-[-0.025em] text-[#EAE8E4] hover:opacity-65 transition-opacity"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Governance & Policy Links */}
          <div className="md:col-span-4">
            <ul className="space-y-3.5">
              {FOOTER_POLICY_LINKS.map((policy) => (
                <li key={policy}>
                  <button
                    type="button"
                    onClick={() => {
                      setPolicyToast(policy);
                      window.setTimeout(() => setPolicyToast(null), 3200);
                    }}
                    className="group inline-flex items-center gap-3 text-left text-[13px] font-medium text-[#EAE8E4]/90 hover:text-white cursor-pointer"
                  >
                    <span>{policy}</span>
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-[#2A2825] group-hover:bg-[#3A3734] inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    >
                      <ArrowRight size={13} strokeWidth={1.75} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Language Switcher */}
          <div className="md:col-span-2 flex md:justify-end items-start">
            <TwinButton
              label="Choose your language"
              variant="muted-dark"
              size="sm"
              onClick={() => {
                setSelectedLangDraft(currentLanguage);
                setLanguageModalOpen(true);
              }}
            />
          </div>
        </div>

        {policyToast && (
          <div
            role="status"
            className="mb-6 px-4 py-2.5 rounded-lg bg-[#2A2825] text-[#EAE8E4] text-[13px] inline-flex items-center gap-2"
          >
            <Check size={14} className="text-[#BCFFEF]" />
            <span>{policyToast} — Monks Global Governance &amp; Compliance</span>
          </div>
        )}

        {/* Bottom Hairline Bar */}
        <div className="border-t border-[#EAE8E4]/15 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Social Icons + Follow Us */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {[
                { label: 'TikTok', mark: '♪', href: 'https://www.tiktok.com/@monks' },
                { label: 'X', mark: '𝕏', href: 'https://x.com/monks' },
                { label: 'LinkedIn', mark: 'in', href: 'https://www.linkedin.com/company/monks' },
                { label: 'Instagram', mark: '◎', href: 'https://www.instagram.com/monks' },
              ].map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Follow Monks on ${soc.label}`}
                  className="w-9 h-9 rounded-full border border-[#EAE8E4]/25 hover:border-[#EAE8E4] hover:bg-[#EAE8E4]/10 flex items-center justify-center text-[13px] transition-colors"
                >
                  {soc.mark}
                </a>
              ))}
            </div>
            <span className="text-[13px] text-[#EAE8E4]/75 ml-1">Follow Us</span>
          </div>

          {/* Newsletter CTA */}
          <div>
            <button
              type="button"
              onClick={() => {
                setNewsletterSuccess(false);
                setNewsletterError(null);
                setNewsletterOpen(true);
              }}
              className="group inline-flex items-center gap-3 text-[13px] font-medium text-[#EAE8E4] hover:text-white cursor-pointer"
            >
              <span>Newsletter</span>
              <span className="w-8 h-8 rounded-full bg-[#2A2825] group-hover:bg-[#3A3734] inline-flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRight size={13} strokeWidth={1.75} />
              </span>
            </button>
          </div>

          {/* Copyright + Wordmark */}
          <div className="flex items-center gap-4 text-[13px] text-[#EAE8E4]/75">
            <span>Copyright 2026</span>
            <span className="text-[20px] font-extrabold tracking-[-0.04em] text-[#EAE8E4]">
              .monks
            </span>
          </div>
        </div>
      </div>

      {/* Language Selector Modal */}
      {languageModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choose your language"
          onClick={() => setLanguageModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#191715] text-[#EAE8E4] border border-[#EAE8E4]/15 rounded-2xl max-w-[440px] w-full p-6 md:p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-semibold">Choose your language</h3>
              <button
                type="button"
                onClick={() => setLanguageModalOpen(false)}
                aria-label="Close language modal"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-7">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLangDraft(lang)}
                  className={`px-4 py-3 rounded-xl text-left text-[14px] font-medium transition-colors cursor-pointer ${
                    selectedLangDraft === lang
                      ? 'bg-[#EAE8E4] text-[#191715]'
                      : 'bg-[#2A2825] text-[#EAE8E4] hover:bg-[#3A3734]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <TwinButton
              label="Confirm"
              variant="light"
              size="sm"
              onClick={() => {
                onLanguageChange(selectedLangDraft);
                setLanguageModalOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Newsletter Signup Modal (Monks Pink #FFB2E8 + Navy #001D38 theme) */}
      {newsletterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Newsletter signup"
          onClick={() => setNewsletterOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFB2E8] text-[#001D38] rounded-2xl max-w-[540px] w-full p-7 md:p-10 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="font-monks-extended text-[26px] md:text-[30px] leading-[1.1] tracking-tight">
                {newsletterSuccess
                  ? 'Thank you for signing up!'
                  : "Sharpen your edge in a world that won't wait"}
              </h3>
              <button
                type="button"
                onClick={() => setNewsletterOpen(false)}
                aria-label="Close newsletter signup"
                className="w-9 h-9 rounded-full bg-[#001D38]/10 hover:bg-[#001D38]/20 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {newsletterSuccess ? (
              <p className="text-[15px] leading-relaxed text-[#001D38]/85 mt-3">
                Welcome aboard, {newsletterFirst}. You will receive actionable insights, research,
                and proven strategies straight to {newsletterEmail}.
              </p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} noValidate className="space-y-4 mt-4">
                <p className="text-[14px] leading-relaxed text-[#001D38]/85">
                  Sign up to get email updates with actionable insights, cutting-edge research and
                  proven strategies.
                </p>
                <input
                  type="text"
                  value={newsletterFirst}
                  onChange={(e) => setNewsletterFirst(e.target.value)}
                  placeholder="First name*"
                  aria-label="First name"
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-[14px] text-[#001D38] placeholder:text-[#001D38]/60 focus:outline-none"
                />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Work email*"
                  aria-label="Work email"
                  className="w-full bg-white rounded-xl px-4 py-3.5 text-[14px] text-[#001D38] placeholder:text-[#001D38]/60 focus:outline-none"
                />
                {newsletterError && (
                  <p role="alert" className="text-[13px] font-semibold text-[#991B1B]">
                    {newsletterError}
                  </p>
                )}
                <div className="pt-2">
                  <TwinButton label="Subscribe" type="submit" variant="dark" size="sm" />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
