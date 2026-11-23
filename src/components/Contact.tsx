import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Info, Loader2, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CONTACT_COMPANY_SIZES,
  CONTACT_LOCATIONS,
  CONTACT_SERVICES,
  IWON_TEAM_PORTRAITS,
  PARTNER_PLACEHOLDER_MARKS,
} from '../data/monksData';
import {
  ContactSubmissionError,
  ContactSubmissionResult,
  submitContactInquiry,
} from '../services/contactService';

gsap.registerPlugin(ScrollTrigger);

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  companySize: string;
  location: string;
  message: string;
  acceptedPrivacy: boolean;
  website: string; // Honeypot field
}

interface SubmittedSummary {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  service: string;
  companySize: string;
  location: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  service: '',
  companySize: '',
  location: '',
  message: '',
  acceptedPrivacy: false,
  website: '',
};

const MAX_MESSAGE_LEN = 500;
const RECOMMENDED_MIN_LEN = 20;

const PartnerLogoMark: React.FC<{ shape: (typeof PARTNER_PLACEHOLDER_MARKS)[number]['shape'] }> = ({
  shape,
}) => {
  switch (shape) {
    case 'circle':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="10" cy="10" r="2.5" fill="currentColor" />
        </svg>
      );
    case 'bars':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="2" y="9" width="3.5" height="8" fill="currentColor" />
          <rect x="8" y="4" width="3.5" height="13" fill="currentColor" />
          <rect x="14" y="7" width="3.5" height="10" fill="currentColor" />
        </svg>
      );
    case 'layers':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 6.5L10 3L17 6.5L10 10L3 6.5Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 10.5L10 14L17 10.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 14.5L10 18L17 14.5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'arc':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 15A7 7 0 0 1 17 15" stroke="currentColor" strokeWidth="2" />
          <circle cx="10" cy="15" r="2" fill="currentColor" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 2.5L17.5 10L10 17.5L2.5 10L10 2.5Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case 'square':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1.8" />
          <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case 'dots':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="5" cy="5" r="2" fill="currentColor" />
          <circle cx="15" cy="5" r="2" fill="currentColor" />
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="5" cy="15" r="2" fill="currentColor" />
          <circle cx="15" cy="15" r="2" fill="currentColor" />
        </svg>
      );
    case 'ring':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2" />
          <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
};

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const middleRingRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const resultBannerRef = useRef<HTMLDivElement>(null);
  const lastSubmittedSignatureRef = useRef<string | null>(null);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ContactSubmissionResult | null>(null);
  const [submittedSummary, setSubmittedSummary] = useState<SubmittedSummary | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPrivacySummary, setShowPrivacySummary] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.contact-panel-reveal', {
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      gsap.from('.contact-field-stagger', {
        y: 18,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.contact-form-grid',
          start: 'top 82%',
          once: true,
        },
      });

      if (outerRingRef.current) {
        gsap.to(outerRingRef.current, {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: 'none',
        });
      }

      if (middleRingRef.current) {
        gsap.to(middleRingRef.current, {
          rotation: -360,
          duration: 44,
          repeat: -1,
          ease: 'none',
        });
      }

      gsap.utils.toArray<HTMLElement>('.orbit-portrait').forEach((el, idx) => {
        gsap.to(el, {
          y: idx % 2 === 0 ? -7 : 7,
          duration: 2.6 + idx * 0.35,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!submissionResult || !resultBannerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      resultBannerRef.current,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
    );
  }, [submissionResult]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    } else if (form.firstName.trim().length > 80) {
      nextErrors.firstName = 'First name must be 80 characters or fewer.';
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    } else if (form.lastName.trim().length > 80) {
      nextErrors.lastName = 'Last name must be 80 characters or fewer.';
    }

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Email address is required.';
    } else if (trimmedEmail.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.company.trim()) {
      nextErrors.company = 'Company name is required.';
    } else if (form.company.trim().length > 120) {
      nextErrors.company = 'Company name must be 120 characters or fewer.';
    }

    if (!form.service) nextErrors.service = 'Please select a service.';
    if (!form.companySize) nextErrors.companySize = 'Please select your company size.';
    if (!form.location) nextErrors.location = 'Please select a location.';

    if (!form.message.trim()) {
      nextErrors.message = 'Please share a brief overview of your project.';
    } else if (form.message.trim().length < 10) {
      nextErrors.message = 'Please provide at least 10 characters so our team has context.';
    } else if (form.message.trim().length > MAX_MESSAGE_LEN) {
      nextErrors.message = `Project message must be ${MAX_MESSAGE_LEN} characters or fewer.`;
    }

    if (!form.acceptedPrivacy) {
      nextErrors.acceptedPrivacy = 'Please accept the Privacy Policy to continue.';
    }
    return nextErrors;
  };

  const mapServerFieldErrors = (serverErrors?: Record<string, string>): FormErrors => {
    if (!serverErrors) return {};
    const mapped: FormErrors = {};
    if (serverErrors.first_name) mapped.firstName = serverErrors.first_name;
    if (serverErrors.last_name) mapped.lastName = serverErrors.last_name;
    if (serverErrors.email) mapped.email = serverErrors.email;
    if (serverErrors.company) mapped.company = serverErrors.company;
    if (serverErrors.service_required) mapped.service = serverErrors.service_required;
    if (serverErrors.company_size) mapped.companySize = serverErrors.company_size;
    if (serverErrors.location) mapped.location = serverErrors.location;
    if (serverErrors.message) mapped.message = serverErrors.message;
    return mapped;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const trimmedSnapshot: SubmittedSummary = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      company: form.company.trim(),
      service: form.service,
      companySize: form.companySize,
      location: form.location,
    };

    const signature = JSON.stringify({
      ...trimmedSnapshot,
      email: trimmedSnapshot.email.toLowerCase(),
      message: form.message.trim(),
    });

    if (lastSubmittedSignatureRef.current === signature) {
      setSubmitError(
        'This exact inquiry was already submitted in this session. Edit your message or send a new inquiry.'
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitContactInquiry({
        first_name: trimmedSnapshot.firstName,
        last_name: trimmedSnapshot.lastName,
        email: trimmedSnapshot.email,
        company: trimmedSnapshot.company,
        service_required: trimmedSnapshot.service,
        company_size: trimmedSnapshot.companySize,
        location: trimmedSnapshot.location,
        message: form.message.trim(),
        website: form.website,
      });

      lastSubmittedSignatureRef.current = signature;
      setSubmittedSummary(trimmedSnapshot);
      setSubmissionResult(result);
      // Reset the form only after confirmed successful submission
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      if (err instanceof ContactSubmissionError && err.fieldErrors) {
        const mapped = mapServerFieldErrors(err.fieldErrors);
        if (Object.keys(mapped).length > 0) {
          setErrors(mapped);
        }
      }
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Unable to process your inquiry right now. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmissionResult(null);
    setSubmittedSummary(null);
    setSubmitError(null);
  };

  const handleButtonHover = (entering: boolean) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !submitBtnRef.current) return;
    gsap.to(submitBtnRef.current, {
      scale: entering ? 1.01 : 1,
      duration: 0.22,
      ease: 'power2.out',
    });
  };

  const messageLen = form.message.length;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#EFECE6] text-[#2D2D2D] py-20 md:py-28 px-4 sm:px-6 md:px-10"
    >
      <div className="max-w-[1320px] mx-auto">
        {/* Centered White Split-Panel Container */}
        <div className="bg-white rounded-[26px] md:rounded-[34px] p-3.5 sm:p-5 lg:p-6 shadow-[0_14px_45px_rgba(25,23,21,0.06)] border border-[#2D2D2D]/[0.05]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            {/* LEFT PANEL (~30-33%): IWON- Animated Team Orbit Visualization */}
            <div className="contact-panel-reveal lg:col-span-4 bg-[#FAF9F6] rounded-[20px] md:rounded-[26px] p-6 sm:p-7 flex flex-col justify-between min-h-[380px] lg:min-h-[640px] relative overflow-hidden border border-[#2D2D2D]/[0.06]">
              {/* Top Brand Lockup */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="text-[22px] font-extrabold tracking-[-0.04em] text-[#141413]">
                  IWON-
                </span>
                <span className="text-[12px] font-medium text-[#6F6C66]">Global Studio</span>
              </div>

              {/* Concentric Orbit & Floating Team Portraits */}
              <div className="relative my-8 sm:my-10 w-[220px] h-[220px] sm:w-[265px] sm:h-[265px] mx-auto flex items-center justify-center shrink-0">
                {/* Soft Lime-Green Central Glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-4 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(200,255,61,0.52) 0%, rgba(200,255,61,0.18) 46%, rgba(200,255,61,0) 74%)',
                  }}
                />

                {/* Outer Concentric Orbit Ring */}
                <div
                  ref={outerRingRef}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-[#2D2D2D]/12"
                >
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#C8FF3D] border border-[#141413]/25" />
                </div>

                {/* Middle Dashed Concentric Orbit Ring */}
                <div
                  ref={middleRingRef}
                  aria-hidden="true"
                  className="absolute inset-[18%] rounded-full border border-dashed border-[#2D2D2D]/18"
                >
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#141413]/70" />
                </div>

                {/* Inner Accent Ring */}
                <div
                  aria-hidden="true"
                  className="absolute inset-[34%] rounded-full border border-[#9FE21A]/50 bg-[#C8FF3D]/15"
                />

                {/* Center IWON- Core Mark */}
                <div className="relative z-20 w-[72px] h-[72px] sm:w-[82px] sm:h-[82px] rounded-full bg-[#141413] text-[#C8FF3D] flex items-center justify-center shadow-lg">
                  <span className="text-[15px] sm:text-[16px] font-extrabold tracking-[-0.04em]">
                    IWON-
                  </span>
                </div>

                {/* Circular Team Portraits */}
                {IWON_TEAM_PORTRAITS.map((person) => (
                  <div
                    key={person.id}
                    className={`orbit-portrait absolute z-20 ${person.positionClass} ${person.sizeClass} rounded-full p-0.5 bg-white shadow-md ring-1 ring-[#2D2D2D]/10 overflow-hidden`}
                  >
                    <img
                      src={person.src}
                      alt={person.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full bg-[#E5E3DD]"
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Caption & Social Links */}
              <div className="relative z-10 space-y-4">
                <p className="text-[13px] leading-relaxed text-[#4A4844]">
                  Connect directly with our strategists, creative directors, and AI architects across
                  New York, London, Amsterdam, and Singapore.
                </p>

                <div className="flex items-center gap-2">
                  {[
                    { label: 'LinkedIn', mark: 'in', href: 'https://www.linkedin.com/' },
                    { label: 'X', mark: '𝕏', href: 'https://x.com/' },
                    { label: 'Instagram', mark: '◎', href: 'https://www.instagram.com/' },
                    { label: 'TikTok', mark: '♪', href: 'https://www.tiktok.com/' },
                  ].map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`IWON- on ${soc.label}`}
                      className="w-10 h-10 rounded-full border border-[#2D2D2D]/15 bg-white hover:bg-[#141413] hover:text-[#C8FF3D] hover:border-[#141413] text-[#141413] flex items-center justify-center text-[13px] font-medium transition-colors"
                    >
                      {soc.mark}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT PANEL (~67-70%): Vibrant Lime Green Contact Form */}
            <div className="contact-panel-reveal lg:col-span-8 bg-[#C8FF3D] text-[#141413] rounded-[20px] md:rounded-[26px] p-6 sm:p-8 md:p-11 flex flex-col justify-between">
              <div>
                <div className="mb-7 md:mb-8">
                  <h2 className="font-monks-extended text-[clamp(1.75rem,3.1vw,2.65rem)] leading-[1.08] tracking-[-0.03em] text-[#141413] [text-wrap:balance]">
                    Let&apos;s create something together.
                  </h2>
                  <p className="mt-2.5 text-[15px] md:text-[16px] leading-relaxed text-[#141413]/85 max-w-[54ch]">
                    Tell us about your project. Our team will get back to you within 24 hours.
                  </p>
                </div>

                {submissionResult ? (
                  <div
                    ref={resultBannerRef}
                    role="status"
                    aria-live="polite"
                    className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#141413]/10 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={22} className="text-[#141413] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[18px] font-bold text-[#141413]">Inquiry Received</p>
                        <p className="text-[13px] font-medium text-[#6F6C66] tabular-nums mt-0.5">
                          Reference: {submissionResult.referenceId}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl p-4 text-[13px] leading-relaxed flex items-start gap-2.5 bg-[#ECFCCB] border border-[#65A30D]/30 text-[#141413]">
                      <Info size={16} className="shrink-0 mt-0.5 text-[#141413]" />
                      <span>{submissionResult.notice}</span>
                    </div>

                    {submittedSummary && (
                      <div className="border-t border-[#141413]/10 pt-4 text-[13px] text-[#4A4844] grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p>
                          <strong className="text-[#141413]">Contact:</strong>{' '}
                          {submittedSummary.firstName} {submittedSummary.lastName} (
                          {submittedSummary.email})
                        </p>
                        <p>
                          <strong className="text-[#141413]">Company:</strong>{' '}
                          {submittedSummary.company}
                        </p>
                        <p>
                          <strong className="text-[#141413]">Service:</strong>{' '}
                          {submittedSummary.service}
                        </p>
                        <p>
                          <strong className="text-[#141413]">Company Size:</strong>{' '}
                          {submittedSummary.companySize}
                        </p>
                        <p>
                          <strong className="text-[#141413]">Location:</strong>{' '}
                          {submittedSummary.location}
                        </p>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-5 py-3 rounded-xl bg-[#141413] text-white text-[14px] font-semibold hover:bg-[#2A2927] transition-colors cursor-pointer"
                      >
                        Send another inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="contact-form-grid space-y-5 relative">
                    {/* Honeypot field for spam protection (hidden from human visitors & assistive tech) */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-[9999px] w-px h-px overflow-hidden opacity-0 pointer-events-none"
                    >
                      <label htmlFor="iwon-website">Website</label>
                      <input
                        id="iwon-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(e) => updateField('website', e.target.value)}
                      />
                    </div>
                    {/* Row 1: First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="contact-field-stagger">
                        <label
                          htmlFor="iwon-first-name"
                          className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                        >
                          First Name *
                        </label>
                        <input
                          id="iwon-first-name"
                          name="firstName"
                          type="text"
                          autoComplete="given-name"
                          value={form.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          placeholder="Jordan"
                          aria-invalid={Boolean(errors.firstName)}
                          className={`w-full bg-white text-[#141413] placeholder:text-[#6F6C66]/70 rounded-xl px-4 py-3.5 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] ${
                            errors.firstName ? 'border-[#B91C1C]' : 'border-transparent'
                          }`}
                        />
                        {errors.firstName && (
                          <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div className="contact-field-stagger">
                        <label
                          htmlFor="iwon-last-name"
                          className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                        >
                          Last Name *
                        </label>
                        <input
                          id="iwon-last-name"
                          name="lastName"
                          type="text"
                          autoComplete="family-name"
                          value={form.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          placeholder="Vance"
                          aria-invalid={Boolean(errors.lastName)}
                          className={`w-full bg-white text-[#141413] placeholder:text-[#6F6C66]/70 rounded-xl px-4 py-3.5 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] ${
                            errors.lastName ? 'border-[#B91C1C]' : 'border-transparent'
                          }`}
                        />
                        {errors.lastName && (
                          <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Email Address & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="contact-field-stagger">
                        <label
                          htmlFor="iwon-email"
                          className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                        >
                          Email Address *
                        </label>
                        <input
                          id="iwon-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="jordan@company.com"
                          aria-invalid={Boolean(errors.email)}
                          className={`w-full bg-white text-[#141413] placeholder:text-[#6F6C66]/70 rounded-xl px-4 py-3.5 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] ${
                            errors.email ? 'border-[#B91C1C]' : 'border-transparent'
                          }`}
                        />
                        {errors.email && (
                          <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="contact-field-stagger">
                        <label
                          htmlFor="iwon-company"
                          className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                        >
                          Company *
                        </label>
                        <input
                          id="iwon-company"
                          name="company"
                          type="text"
                          autoComplete="organization"
                          value={form.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          placeholder="Northstar Studio"
                          aria-invalid={Boolean(errors.company)}
                          className={`w-full bg-white text-[#141413] placeholder:text-[#6F6C66]/70 rounded-xl px-4 py-3.5 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] ${
                            errors.company ? 'border-[#B91C1C]' : 'border-transparent'
                          }`}
                        />
                        {errors.company && (
                          <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                            {errors.company}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 3: Service Required & Company Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="contact-field-stagger">
                        <label
                          htmlFor="iwon-service"
                          className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                        >
                          Service Required *
                        </label>
                        <div className="relative">
                          <select
                            id="iwon-service"
                            name="service"
                            value={form.service}
                            onChange={(e) => updateField('service', e.target.value)}
                            aria-invalid={Boolean(errors.service)}
                            className={`w-full appearance-none bg-white text-[#141413] rounded-xl px-4 py-3.5 pr-10 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] cursor-pointer ${
                              !form.service ? 'text-[#6F6C66]' : 'text-[#141413]'
                            } ${errors.service ? 'border-[#B91C1C]' : 'border-transparent'}`}
                          >
                            <option value="">Select a service</option>
                            {CONTACT_SERVICES.map((svc) => (
                              <option key={svc} value={svc}>
                                {svc}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141413]/70"
                          />
                        </div>
                        {errors.service && (
                          <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                            {errors.service}
                          </p>
                        )}
                      </div>

                      <div className="contact-field-stagger">
                        <label
                          htmlFor="iwon-company-size"
                          className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                        >
                          Company Size *
                        </label>
                        <div className="relative">
                          <select
                            id="iwon-company-size"
                            name="companySize"
                            value={form.companySize}
                            onChange={(e) => updateField('companySize', e.target.value)}
                            aria-invalid={Boolean(errors.companySize)}
                            className={`w-full appearance-none bg-white text-[#141413] rounded-xl px-4 py-3.5 pr-10 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] cursor-pointer ${
                              !form.companySize ? 'text-[#6F6C66]' : 'text-[#141413]'
                            } ${errors.companySize ? 'border-[#B91C1C]' : 'border-transparent'}`}
                          >
                            <option value="">Select company size</option>
                            {CONTACT_COMPANY_SIZES.map((sz) => (
                              <option key={sz} value={sz}>
                                {sz}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141413]/70"
                          />
                        </div>
                        {errors.companySize && (
                          <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                            {errors.companySize}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Row 4: Location */}
                    <div className="contact-field-stagger">
                      <label
                        htmlFor="iwon-location"
                        className="block text-[13px] font-semibold text-[#141413] mb-1.5"
                      >
                        Location *
                      </label>
                      <div className="relative">
                        <select
                          id="iwon-location"
                          name="location"
                          value={form.location}
                          onChange={(e) => updateField('location', e.target.value)}
                          aria-invalid={Boolean(errors.location)}
                          className={`w-full appearance-none bg-white text-[#141413] rounded-xl px-4 py-3.5 pr-10 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] cursor-pointer ${
                            !form.location ? 'text-[#6F6C66]' : 'text-[#141413]'
                          } ${errors.location ? 'border-[#B91C1C]' : 'border-transparent'}`}
                        >
                          <option value="">Select your region</option>
                          {CONTACT_LOCATIONS.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141413]/70"
                        />
                      </div>
                      {errors.location && (
                        <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Row 5: Project Message */}
                    <div className="contact-field-stagger">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label
                          htmlFor="iwon-message"
                          className="block text-[13px] font-semibold text-[#141413]"
                        >
                          Project Message *
                        </label>
                        <span className="text-[12px] font-medium text-[#141413]/75 tabular-nums">
                          {messageLen}/{MAX_MESSAGE_LEN}
                        </span>
                      </div>
                      <textarea
                        id="iwon-message"
                        name="message"
                        rows={4}
                        maxLength={MAX_MESSAGE_LEN}
                        value={form.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        placeholder="Share your goals, timeline, and what you're looking to build..."
                        aria-invalid={Boolean(errors.message)}
                        className={`w-full bg-white text-[#141413] placeholder:text-[#6F6C66]/70 rounded-xl px-4 py-3.5 text-[15px] border transition-shadow focus:outline-none focus:ring-2 focus:ring-[#141413] resize-y min-h-[112px] ${
                          errors.message ? 'border-[#B91C1C]' : 'border-transparent'
                        }`}
                      />
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[12px]">
                        {errors.message ? (
                          <p role="alert" className="font-semibold text-[#991B1B]">
                            {errors.message}
                          </p>
                        ) : (
                          <p className="text-[#141413]/75">
                            {messageLen < RECOMMENDED_MIN_LEN
                              ? `Add at least ${RECOMMENDED_MIN_LEN - messageLen} more characters for a helpful brief.`
                              : 'Brief looks clear and ready.'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Privacy Policy Agreement Checkbox */}
                    <div className="contact-field-stagger pt-1">
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={form.acceptedPrivacy}
                          onChange={(e) => updateField('acceptedPrivacy', e.target.checked)}
                          aria-invalid={Boolean(errors.acceptedPrivacy)}
                          className="mt-0.5 w-4 h-4 rounded accent-[#141413] cursor-pointer shrink-0"
                        />
                        <span className="text-[13px] leading-snug text-[#141413]/90">
                          I agree to the{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowPrivacySummary((prev) => !prev);
                            }}
                            className="underline font-semibold hover:opacity-75 cursor-pointer"
                          >
                            Privacy Policy
                          </button>{' '}
                          and consent to IWON- reviewing the project details provided above.
                        </span>
                      </label>
                      {showPrivacySummary && (
                        <p className="mt-2 ml-7 p-3 rounded-lg bg-white/75 text-[12px] leading-relaxed text-[#141413]">
                          IWON- collects only the project details you enter so our team can scope
                          your inquiry and follow up. No data is sold to third parties.
                        </p>
                      )}
                      {errors.acceptedPrivacy && (
                        <p role="alert" className="mt-1.5 text-[12px] font-semibold text-[#991B1B]">
                          {errors.acceptedPrivacy}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <div
                        role="alert"
                        className="rounded-xl bg-[#FEE2E2] border border-[#B91C1C]/30 px-4 py-3 text-[13px] font-medium text-[#991B1B] flex items-start gap-2.5"
                      >
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    {/* Full-Width Black Send Message Button */}
                    <div className="contact-field-stagger pt-2">
                      <button
                        ref={submitBtnRef}
                        type="submit"
                        disabled={isSubmitting}
                        onMouseEnter={() => handleButtonHover(true)}
                        onMouseLeave={() => handleButtonHover(false)}
                        className="w-full py-4 px-6 rounded-xl bg-[#141413] hover:bg-[#262523] disabled:opacity-65 text-white text-[15px] font-semibold inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141413]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={17} className="animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <ArrowRight size={17} strokeWidth={1.75} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phase 4: Monochrome Two-Row Placeholder Partner / Client Strip */}
        <div className="mt-14 md:mt-16 max-w-[1120px] mx-auto">
          <p className="text-center text-[12px] font-medium text-[#6F6C66] mb-6">
            Representative enterprise partner slots
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {PARTNER_PLACEHOLDER_MARKS.map((mark) => (
              <div
                key={mark.id}
                className="h-16 px-4 rounded-xl bg-white/65 border border-[#2D2D2D]/[0.07] flex items-center justify-center gap-2.5 text-[#2D2D2D]/55 hover:text-[#2D2D2D]/85 hover:bg-white transition-colors"
              >
                <PartnerLogoMark shape={mark.shape} />
                <span className="text-[12px] font-bold tracking-[0.14em] whitespace-nowrap">
                  {mark.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
