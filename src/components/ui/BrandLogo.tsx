'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSlogan?: boolean;
}

export function BrandLogo({ size = 'md', showSlogan = false }: BrandLogoProps) {
  const logoDimensions = size === 'sm' ? 42 : size === 'lg' ? 64 : 52;
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl';

  return (
    <Link href="/" className="group flex items-center gap-3.5 transition-transform duration-300 hover:scale-[1.02]">
      {/* Logotipo Holográfico Oficial de Quality Gadgets */}
      <div className="relative flex-shrink-0">
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-2xl bg-dark-surface/60 border border-brand-ultraviolet/40 p-1 shadow-glow-purple transition-all duration-300 group-hover:border-brand-cyan group-hover:shadow-glow-cyan">
          <Image
            src="/images/logo.png"
            alt="Quality Gadgets RD Logo"
            width={logoDimensions}
            height={logoDimensions}
            priority
            className="h-full w-full object-contain drop-shadow-md"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-brand-cyan shadow-glow-cyan animate-pulse" />
      </div>

      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${titleSize} font-black tracking-tight text-white`}>
            QUALITY GADGETS
          </span>
          <span className={`${titleSize} font-black text-logo-gradient`}>
            RD
          </span>
        </div>
        {showSlogan ? (
          <span className="text-[11px] font-medium text-text-muted tracking-tight mt-1 hidden sm:block">
            El futuro en tus manos: Tecnología premium al alcance de un clic en RD
          </span>
        ) : (
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-cyan mt-1">
            Store Oficial RD
          </span>
        )}
      </div>
    </Link>
  );
}
