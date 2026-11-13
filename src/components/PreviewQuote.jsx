import React from 'react';
import { FONT_THEMES } from '../data/templates';

export default function PreviewQuote({ doc, quoteRef }) {
  const {
    quoteNumber = 'COT-2026-001',
    title = 'Wedding',
    subtitle = '',
    sectionSubtitle = '',
    headerTitleColor = '#1a1a1a', // Canva authentic black script default
    clientName = '',
    clientEmail = '',
    clientPhone = '',
    company = '',
    rnc = '',
    eventDate = '',
    currency = 'US$',
    bgImage = './assets/cotizacion-1.jpg',
    customBgUrl = '',
    bgOpacity = 0.85,
    items = [],
    notes = '',
    fontTheme = 'canva_caveat',
    logoVariant = 'white', // 'white' | 'black' | 'grey'
    showQr = true,
  } = doc;

  const currentBg = customBgUrl || bgImage;

  // Resolve active unified font theme
  const activeFont = FONT_THEMES.find(t => t.id === fontTheme) || FONT_THEMES[0];
  const unifiedFamily = activeFont.fontFamily;
  const isCursive = activeFont.isCursive;
  const letterSpacing = activeFont.letterSpacing || 'normal';

  // Resolve logo image by contrast
  const getLogoSrc = (variant) => {
    if (variant === 'black') return './assets/logos/logo-black-trans.png';
    if (variant === 'grey') return './assets/logos/logo-grey-trans.png';
    return './assets/logos/logo-white-trans.png';
  };

  const headerLogoSrc = getLogoSrc(logoVariant);
  const watermarkLogoSrc = logoVariant === 'black' 
    ? './assets/logos/logo-black-trans.png' 
    : (logoVariant === 'white' ? './assets/logos/logo-white-trans.png' : './assets/logos/logo-grey-trans.png');

  // Calculate total
  const total = items.reduce((sum, item) => {
    const qty = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    return sum + (qty * price);
  }, 0);

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    const formatted = Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const sign = num < 0 ? '-' : '';
    return currency === 'US$' ? `${sign}$${formatted}us` : `${sign}RD$ ${formatted}`;
  };

  return (
    <div className="flex justify-center p-2 sm:p-4 select-none">
      {/* A4 Proportion Container: 1414 x 2000 ratio (1 : 1.4144) matching original Canva arts */}
      <div
        ref={quoteRef}
        id="quote-document-canvas"
        className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-300"
        style={{
          aspectRatio: '1414 / 2000',
          minHeight: '880px',
          fontFamily: unifiedFamily, // Apply unified typography across the entire document root
        }}
      >
        {/* ================= TOP HEADER (CHARCOAL BANNER) ================= */}
        <div className="bg-[#525558] text-white px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-20 shrink-0 border-b border-stone-600/60 shadow-sm">
          {/* Logo Eliotte MUA with selected contrast */}
          <div className="flex items-center">
            <img
              src={headerLogoSrc}
              alt="Eliotte MUA"
              className="h-11 sm:h-14 md:h-16 w-auto object-contain drop-shadow"
            />
          </div>

          {/* Title on the right with the unified font & Canva black/charcoal script style */}
          <div className="text-right">
            <h1
              className={`leading-tight tracking-wide ${
                isCursive 
                  ? 'text-3xl sm:text-4xl md:text-5xl font-semibold' 
                  : 'text-2xl sm:text-3xl md:text-4xl font-bold uppercase'
              }`}
              style={{
                fontFamily: unifiedFamily,
                color: headerTitleColor,
                letterSpacing: letterSpacing,
                textShadow: headerTitleColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {title}
            </h1>
            {subtitle && (
              <span
                className="block text-xs sm:text-sm tracking-widest uppercase mt-0.5"
                style={{
                  fontFamily: unifiedFamily,
                  color: headerTitleColor === '#ffffff' ? '#e2e8f0' : '#262626',
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* ================= MAIN CONTINUOUS BODY (PHOTO + SERVICES + CLIENT) ================= */}
        <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
          {/* Background Image Layer: Clean photo without text artifacts */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 pointer-events-none"
            style={{
              backgroundImage: `url('${currentBg}')`,
              filter: 'brightness(0.98)',
            }}
          />

          {/* Soft natural radial wash to ensure 100% legibility while keeping the model visible */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,${0.82}) 0%, rgba(255,255,255,${0.62}) 65%, rgba(255,255,255,${0.74}) 100%)`,
            }}
          />

          {/* Watermark in bottom right of photo (above client lines) */}
          <div className="absolute right-5 bottom-32 pointer-events-none opacity-25 select-none z-10">
            <img
              src={watermarkLogoSrc}
              alt=""
              className="h-20 sm:h-28 w-auto object-contain transform -rotate-2"
            />
          </div>

          {/* ================= CENTER CONTENT (SERVICES, TOTALS, NOTES) ================= */}
          <div 
            className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-10 py-4 my-auto space-y-3 sm:space-y-4"
            style={{ fontFamily: unifiedFamily }}
          >
            
            {/* Optional Section Subtitle (e.g., "Price List Santiago") */}
            {sectionSubtitle && (
              <div
                className={`text-stone-900 tracking-wide mb-1 ${
                  isCursive ? 'text-2xl sm:text-3xl font-semibold' : 'text-base sm:text-lg font-bold uppercase tracking-wider'
                }`}
                style={{ fontFamily: unifiedFamily }}
              >
                {sectionSubtitle}
              </div>
            )}

            {/* Services List with UNIFIED FONT for descriptions, notes and prices */}
            <div className="w-full space-y-2 sm:space-y-3">
              {items.map((item, index) => {
                const itemTotal = (Number(item.qty) || 1) * (Number(item.price) || 0);
                const hasExplicitTotal = item.price !== undefined && item.price !== 0;

                return (
                  <div
                    key={item.id || index}
                    className={`leading-snug text-stone-950 px-2 whitespace-pre-line ${
                      isCursive
                        ? 'text-xl sm:text-2xl md:text-[25px] font-semibold'
                        : 'text-sm sm:text-base md:text-[17px] font-medium'
                    }`}
                    style={{
                      fontFamily: unifiedFamily,
                      letterSpacing: letterSpacing,
                      lineHeight: 1.35,
                    }}
                  >
                    <span>{item.description}</span>
                    {item.note && (
                      <span className="text-stone-700 italic ml-1">
                        ({item.note})
                      </span>
                    )}
                    {hasExplicitTotal && (
                      <span className="font-bold ml-2">
                        {formatCurrency(itemTotal)}
                      </span>
                    )}
                    {item.optional && (
                      <span className="text-xs sm:text-sm font-normal text-stone-600 uppercase tracking-wider ml-2 px-1.5 py-0.5 rounded bg-stone-200/70">
                        Opcional
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Total Highlight with UNIFIED FONT */}
            <div className="pt-2 pb-1 border-t border-b border-stone-800/40 w-full max-w-md my-2">
              <div
                className={`text-stone-950 font-bold ${
                  isCursive ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-xl sm:text-2xl md:text-3xl'
                }`}
                style={{
                  fontFamily: unifiedFamily,
                  letterSpacing: letterSpacing,
                }}
              >
                <span>Total: </span>
                <span className="underline decoration-1 underline-offset-4">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Notes & Bank Details with UNIFIED FONT */}
            {notes && (
              <div className="pt-1 max-w-lg mx-auto">
                <div
                  className={`text-stone-900 leading-snug whitespace-pre-line ${
                    isCursive
                      ? 'text-base sm:text-lg md:text-xl font-medium'
                      : 'text-xs sm:text-sm md:text-base font-normal'
                  }`}
                  style={{
                    fontFamily: unifiedFamily,
                    letterSpacing: letterSpacing,
                  }}
                >
                  <p className="font-bold text-stone-950 text-xs sm:text-sm uppercase tracking-widest mb-0.5">
                    NOTA :
                  </p>
                  {notes}
                </div>
              </div>
            )}
          </div>

          {/* ================= BOTTOM CLIENT INFORMATION (NO TRUNCATION, FULL VISIBILITY) ================= */}
          <div 
            className="relative z-10 w-full px-6 sm:px-10 pb-3 pt-2 text-stone-900 bg-gradient-to-t from-white/85 via-white/45 to-transparent"
            style={{ fontFamily: unifiedFamily }}
          >
            {/* Header of client section with Cotización para + N° Cotización */}
            <div className="flex items-center justify-between mb-1.5">
              <p className={`italic text-stone-900 ${isCursive ? 'text-lg sm:text-xl font-bold' : 'text-xs sm:text-sm font-semibold'}`}>
                Cotización para:
              </p>
              {quoteNumber && (
                <span className={`text-stone-900 font-bold tracking-wider ${isCursive ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm'}`}>
                  N°: {quoteNumber}
                </span>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              {/* Row 1: Cliente & RNC (Full width available, NO TRUNCATION EVER) */}
              <div className="flex flex-wrap items-baseline border-b border-stone-700/80 pb-0.5 w-full">
                <span className={`text-stone-950 mr-2 shrink-0 ${isCursive ? 'text-lg sm:text-xl font-bold' : 'text-xs sm:text-sm font-semibold'}`}>
                  Cliente:
                </span>
                <span className={`flex-1 text-stone-950 break-words leading-tight ${isCursive ? 'text-lg sm:text-xl font-semibold' : 'text-xs sm:text-sm font-medium'}`}>
                  {clientName || ''}
                  {company && company !== clientName ? ` • ${company}` : ''}
                  {rnc ? ` • RNC: ${rnc}` : ''}
                </span>
              </div>

              {/* Row 2: Fecha de evento & Correo (Flexible, No truncation) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                <div className="flex items-baseline border-b border-stone-700/80 pb-0.5">
                  <span className={`text-stone-950 mr-2 shrink-0 ${isCursive ? 'text-lg sm:text-xl font-bold' : 'text-xs sm:text-sm font-semibold'}`}>
                    Fecha de evento:
                  </span>
                  <span className={`flex-1 text-stone-950 break-words leading-tight ${isCursive ? 'text-lg sm:text-xl font-semibold' : 'text-xs sm:text-sm font-medium'}`}>
                    {eventDate || ''}
                  </span>
                </div>

                <div className="flex items-baseline border-b border-stone-700/80 pb-0.5">
                  <span className={`text-stone-950 mr-2 shrink-0 ${isCursive ? 'text-lg sm:text-xl font-bold' : 'text-xs sm:text-sm font-semibold'}`}>
                    Correo:
                  </span>
                  <span className={`flex-1 text-stone-950 break-words leading-tight ${isCursive ? 'text-lg sm:text-xl font-semibold' : 'text-xs sm:text-sm font-medium'}`}>
                    {clientEmail || ''}
                  </span>
                </div>
              </div>

              {/* Row 3 (Optional): Teléfono if present */}
              {clientPhone && (
                <div className="flex items-baseline border-b border-stone-700/80 pb-0.5 max-w-sm">
                  <span className={`text-stone-950 mr-2 shrink-0 ${isCursive ? 'text-lg sm:text-xl font-bold' : 'text-xs sm:text-sm font-semibold'}`}>
                    Teléfono:
                  </span>
                  <span className={`flex-1 text-stone-950 break-words leading-tight ${isCursive ? 'text-lg sm:text-xl font-semibold' : 'text-xs sm:text-sm font-medium'}`}>
                    {clientPhone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= BOTTOM FOOTER (CHARCOAL BANNER) WITH UNIFIED FONT ================= */}
        <div className="bg-[#525558] text-white px-6 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between z-20 shrink-0 border-t border-stone-600/60 shadow-sm">
          {/* Contact Details with Unified Font */}
          <div className="text-left space-y-0.5" style={{ fontFamily: unifiedFamily }}>
            <p className="text-[12px] sm:text-sm md:text-base font-light tracking-wide text-stone-100">
              (849) 220-9464 &nbsp;|&nbsp; eliottecasimiro129@gmail.com
            </p>
            <p className="text-[12px] sm:text-sm md:text-base font-semibold tracking-widest text-white">
              @ELIOTTEMUA
            </p>
          </div>

          {/* QR Code in white square */}
          {showQr && (
            <div className="bg-white p-1 rounded-sm shadow-sm shrink-0">
              <img
                src="./assets/qr_code.png"
                alt="QR Eliotte MUA"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
