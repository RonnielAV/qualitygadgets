'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'cyan' | 'outline';
  showArrow?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function PrimaryButton({
  variant = 'primary',
  showArrow = false,
  children,
  className = '',
  ...props
}: PrimaryButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center gap-2.5 rounded-2xl px-7 py-4 text-sm font-extrabold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  let variantStyles = '';

  if (variant === 'primary') {
    variantStyles =
      'btn-primary-glow text-white border border-white/20';
  } else if (variant === 'cyan') {
    variantStyles =
      'btn-cyan-glow border border-brand-cyan/40';
  } else if (variant === 'outline') {
    variantStyles =
      'border border-dark-border bg-dark-surface/80 text-text-pure hover:border-brand-ultraviolet hover:text-brand-cyan hover:shadow-glow-purple backdrop-blur-md';
  }

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      <span>{children}</span>
      {showArrow && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
}
