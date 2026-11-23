import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_STEPS } from '../data/monksData';

gsap.registerPlugin(ScrollTrigger);

type FormValues = Record<string, string>;

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const currentStep = CONTACT_STEPS[stepIndex];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.contact-reveal', {
        y: 30,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validateCurrentStep = (): boolean => {
    const raw = (values[currentStep.name] || '').trim();
    if (currentStep.required && !raw) {
      setError('This is required!');
      return false;
    }
    if (currentStep.type === 'email' && raw) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(raw)) {
        setError('Please enter a valid work email!');
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (stepIndex < CONTACT_STEPS.length - 1) {
      setStepIndex((prev) => prev + 1);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setError(null);
      setStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setValues({});
    setStepIndex(0);
    setError(null);
    setSubmitted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep.type !== 'textarea') {
      e.preventDefault();
      handleNext();
    }
  };

  const firstName = values.firstname?.trim() || 'there';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-[#EAE8E4] text-[#2D2D2D] pt-16 md:pt-24 pb-28 md:pb-36"
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-10 items-start">
          {/* Left Headline */}
          <div className="lg:col-span-5">
            <h2 className="contact-reveal font-monks-extended text-[clamp(2rem,3.6vw,3.15rem)] leading-[1.08] tracking-[-0.03em] max-w-[460px] [text-wrap:balance]">
              Let’s unlock what’s possible together.
            </h2>
          </div>

          {/* Right Conversational Form */}
          <div className="lg:col-span-7 contact-reveal" aria-live="polite">
            <div className="max-w-[660px] lg:ml-auto">
              {/* Chat Intro Bubble + .monks Avatar */}
              <div className="flex items-start gap-5 mb-8">
                <div
                  className="w-[82px] h-[82px] md:w-[96px] md:h-[96px] rounded-full bg-[#001D38] text-[#BCFFEF] flex items-center justify-center shrink-0 shadow-md"
                  aria-hidden="true"
                >
                  <span className="text-[16px] md:text-[18px] font-extrabold tracking-[-0.03em]">
                    .monks
                  </span>
                </div>

                <div className="relative flex-1 pt-4">
                  <div className="bg-[#5B1BFF] text-[#EAE8E4] rounded-2xl px-6 py-5 shadow-sm max-w-[380px]">
                    {submitted ? (
                      <>
                        <p className="text-[16px] font-semibold mb-1.5">Thanks {firstName}.</p>
                        <p className="text-[14px] leading-relaxed text-[#EAE8E4]/95">
                          Keep an eye on your email. One of our monks will be in touch with you
                          soon.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-[15px] font-medium mb-1">Hey 👋</p>
                        <p className="text-[14px] leading-relaxed text-[#EAE8E4]/95">
                          Please fill out the following quick questions so our team can get in touch
                          with you.
                        </p>
                      </>
                    )}
                  </div>
                  {/* Trailing chat dot */}
                  <span
                    aria-hidden="true"
                    className="block w-4 h-4 rounded-full bg-[#5B1BFF] -ml-6 mt-1.5"
                  />
                </div>
              </div>

              {/* Form Card or Submitted Summary */}
              {!submitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleNext();
                  }}
                  noValidate
                  className="lg:pl-[190px]"
                >
                  <div className="mb-3 flex items-center justify-between text-[12px] text-[#6F6C66]">
                    <span>
                      Question {stepIndex + 1} of {CONTACT_STEPS.length}
                    </span>
                    {currentStep.label !== currentStep.placeholder && (
                      <span>{currentStep.label}</span>
                    )}
                  </div>

                  {currentStep.type === 'radio' && currentStep.options ? (
                    <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#2D2D2D]/5 space-y-2">
                      <p className="text-[13px] font-semibold text-[#2D2D2D] mb-2">
                        {currentStep.label}
                      </p>
                      {currentStep.options.map((opt) => {
                        const checked = values[currentStep.name] === opt;
                        return (
                          <label
                            key={opt}
                            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors text-[14px] ${
                              checked
                                ? 'bg-[#5B1BFF]/10 text-[#2D2D2D] font-medium'
                                : 'hover:bg-[#EAE8E4]/60 text-[#4A4844]'
                            }`}
                          >
                            <input
                              type="radio"
                              name={currentStep.name}
                              value={opt}
                              checked={checked}
                              onChange={() => {
                                setValues((prev) => ({ ...prev, [currentStep.name]: opt }));
                                setError(null);
                              }}
                              className="accent-[#5B1BFF] w-4 h-4"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : currentStep.type === 'textarea' ? (
                    <textarea
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      name={currentStep.name}
                      rows={3}
                      value={values[currentStep.name] || ''}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, [currentStep.name]: e.target.value }));
                        if (error) setError(null);
                      }}
                      placeholder={currentStep.placeholder}
                      aria-label={currentStep.label}
                      className="w-full bg-white rounded-2xl px-6 py-4 text-[15px] text-[#2D2D2D] placeholder:text-[#4A4844]/75 shadow-sm border border-transparent focus:border-[#5B1BFF] focus:outline-none resize-none"
                    />
                  ) : (
                    <input
                      ref={(el) => {
                        inputRef.current = el;
                      }}
                      type={currentStep.type}
                      name={currentStep.name}
                      value={values[currentStep.name] || ''}
                      onChange={(e) => {
                        setValues((prev) => ({ ...prev, [currentStep.name]: e.target.value }));
                        if (error) setError(null);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={currentStep.placeholder}
                      aria-label={currentStep.label}
                      className="w-full bg-white rounded-2xl px-6 py-5 text-[15px] text-[#2D2D2D] placeholder:text-[#2D2D2D]/80 shadow-sm border border-transparent focus:border-[#5B1BFF] focus:outline-none"
                    />
                  )}

                  {error && (
                    <p role="alert" className="mt-2.5 text-[13px] font-medium text-[#B91C1C]">
                      {error}
                    </p>
                  )}

                  {/* Step Indicators & Next/Back Controls */}
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2" role="tablist" aria-label="Form steps">
                      {CONTACT_STEPS.map((s, idx) => {
                        const isActive = idx === stepIndex;
                        const isDone = idx < stepIndex;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              if (idx <= stepIndex) {
                                setError(null);
                                setStepIndex(idx);
                              }
                            }}
                            aria-label={`Step ${idx + 1}: ${s.label}`}
                            aria-current={isActive ? 'step' : undefined}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              isActive
                                ? 'bg-[#2D2D2D] scale-110'
                                : isDone
                                  ? 'bg-[#2D2D2D]/55 cursor-pointer'
                                  : 'border border-[#2D2D2D]/40 bg-transparent'
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {stepIndex > 0 && (
                        <button
                          type="button"
                          onClick={handlePrev}
                          aria-label="Previous question"
                          className="w-11 h-11 rounded-full bg-white/75 hover:bg-white text-[#2D2D2D] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <ArrowLeft size={16} strokeWidth={1.75} />
                        </button>
                      )}

                      <button
                        type="submit"
                        aria-label={
                          stepIndex === CONTACT_STEPS.length - 1
                            ? 'Submit contact form'
                            : 'Continue to the next step'
                        }
                        className="w-14 h-14 rounded-full bg-white hover:bg-[#2D2D2D] text-[#2D2D2D] hover:text-[#EAE8E4] shadow-sm flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2D2D]"
                      >
                        {stepIndex === CONTACT_STEPS.length - 1 ? (
                          <Check size={18} strokeWidth={2} />
                        ) : (
                          <ArrowRight size={18} strokeWidth={1.75} />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="lg:pl-[190px]">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#2D2D2D]/5 space-y-3">
                    <p className="text-[12px] font-medium text-[#6F6C66]">Submission summary</p>
                    <p className="text-[15px] leading-relaxed text-[#2D2D2D]">
                      “Hi, I am {values.firstname} {values.lastname} from {values.company}. Contact
                      me at {values.email}.”
                    </p>
                    <p className="text-[13px] text-[#6F6C66]">
                      Region: {values.declared_region || 'Global'} · Role: {values.jobtitle}
                    </p>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="mt-2 inline-flex items-center gap-2 text-[13px] font-semibold text-[#5B1BFF] hover:underline cursor-pointer"
                    >
                      <RotateCcw size={14} />
                      <span>Submit another inquiry</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
