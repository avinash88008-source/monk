import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TwinButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'dark' | 'light' | 'muted-dark';
  size?: 'sm' | 'md';
  type?: 'button' | 'submit';
  className?: string;
  ariaLabel?: string;
}

export const TwinButton: React.FC<TwinButtonProps> = ({
  label,
  onClick,
  href,
  variant = 'dark',
  size = 'md',
  type = 'button',
  className = '',
  ariaLabel,
}) => {
  const pillColors =
    variant === 'light'
      ? 'bg-[#EAE8E4] text-[#2D2D2D] group-hover:bg-white'
      : variant === 'muted-dark'
        ? 'bg-[#2B2927] text-[#EAE8E4] group-hover:bg-[#3A3734]'
        : 'bg-[#2D2D2D] text-[#EAE8E4] group-hover:bg-[#191715]';

  const circleColors =
    variant === 'light'
      ? 'bg-[#EAE8E4] text-[#2D2D2D] group-hover:bg-white'
      : variant === 'muted-dark'
        ? 'bg-[#2B2927] text-[#EAE8E4] group-hover:bg-[#3A3734]'
        : 'bg-[#2D2D2D] text-[#EAE8E4] group-hover:bg-[#191715]';

  const pillSize =
    size === 'sm' ? 'px-5 py-2.5 text-[13px]' : 'px-7 py-4 text-[14px]';
  const circleSize = size === 'sm' ? 'w-10 h-10' : 'w-[52px] h-[52px]';
  const iconSize = size === 'sm' ? 14 : 16;

  const content = (
    <>
      <span
        className={`twin-pill rounded-full font-medium leading-none whitespace-nowrap shrink-0 flex items-center justify-center ${pillSize} ${pillColors}`}
      >
        {label}
      </span>
      <span
        className={`twin-circle rounded-full shrink-0 flex items-center justify-center ${circleSize} ${circleColors}`}
        aria-hidden="true"
      >
        <ArrowRight size={iconSize} strokeWidth={1.75} className="twin-arrow" />
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        aria-label={ariaLabel || label}
        className={`monks-twin-btn group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2D2D] ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={`monks-twin-btn group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2D2D2D] ${className}`}
    >
      {content}
    </button>
  );
};
