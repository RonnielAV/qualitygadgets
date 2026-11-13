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
    layoutMode = 'spread', // 'spread' (de margen a margen) | 'center' (centrado)
    // Dynamic text size controls
    titleSize,
    subtitleSize,
    bodySize,
    numberSize,
  } = doc;

  const currentBg = customBgUrl || bgImage;

  // Resolve active unified font theme
  const activeFont = FONT_THEMES.find(t => t.id === fontTheme) || FONT_THEMES[0];
  const unifiedFamily = activeFont.fontFamily;
  const isCursive = activeFont.isCursive;
  const letterSpacing = activeFont.letterSpacing || 'normal';

  // Resolved dynamic font sizes (in pixels on the 750px canvas)
  const defaultTitleSize = isCursive ? 44 : 32;
  const defaultSubtitleSize = isCursive ? 38 : 28;
  const defaultBodySize = isCursive ? 34 : 26;
  const defaultNumberSize = isCursive ? 36 : 28;

  const resolvedTitleSize = Number(titleSize) || defaultTitleSize;
  const resolvedSubtitleSize = Number(subtitleSize) || defaultSubtitleSize;
  const resolvedBodySize = Number(bodySize) || defaultBodySize;
  const resolvedNumberSize = Number(numberSize) || defaultNumberSize;
  const resolvedTotalSize = Math.round(resolvedNumberSize * 1.3);
  const resolvedItemNoteSize = Math.max(12, Math.round(resolvedBodySize * 0.8));
  const resolvedDocNoteSize = Math.max(13, Math.round(resolvedBodySize * 0.72));

  // Purge any unwanted "Quinceañera" from the header banner
  const cleanSubtitle = (subtitle || '').trim();
  const shouldShowSubtitle = cleanSubtitle && cleanSubtitle.toLowerCase() !== 'quinceañera';

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

  // Chunk items into multiple pages if needed (5 items max on page 1, 6 on subsequent)
  const chunkQuoteItems = (allItems) => {
    if (!allItems || allItems.length <= 5) return [allItems || []];
    const chunks = [];
    chunks.push(allItems.slice(0, 5));
    let index = 5;
    while (index < allItems.length) {
      const remaining = allItems.length - index;
      if (remaining <= 5) {
        chunks.push(allItems.slice(index));
        break;
      } else {
        chunks.push(allItems.slice(index, index + 6));
        index += 6;
      }
    }
    return chunks;
  };

  const quotePages = chunkQuoteItems(items);
  const totalPages = quotePages.length;

  return (
    <div ref={quoteRef} className="flex flex-col items-center p-0 select-none w-full space-y-6">
      {quotePages.map((pageItems, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === totalPages - 1;
        const pageNum = pageIdx + 1;

        return (
          <div
            key={pageIdx}
            id={totalPages === 1 ? 'quote-document-canvas' : `quote-page-${pageNum}`}
            className="quote-document-page bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-300"
            style={{
              width: '750px',
              minWidth: '750px',
              maxWidth: '750px',
              minHeight: '1060px',
              height: '1060px',
              boxSizing: 'border-box',
              fontFamily: unifiedFamily,
            }}
          >
            {/* ================= TOP HEADER (CHARCOAL BANNER) ================= */}
            <div className="bg-[#525558] text-white px-8 py-3.5 flex items-center justify-between z-20 shrink-0 border-b border-stone-600/60 shadow-sm">
              <div className="flex items-center">
                <img
                  src={headerLogoSrc}
                  alt="Eliotte MUA"
                  className="h-16 w-auto object-contain drop-shadow"
                />
              </div>

              <div className="text-right">
                <h1
                  className={`leading-tight tracking-wide ${
                    isCursive 
                      ? 'font-semibold' 
                      : 'font-bold uppercase'
                  }`}
                  style={{
                    fontFamily: unifiedFamily,
                    color: headerTitleColor,
                    letterSpacing: letterSpacing,
                    fontSize: `${resolvedTitleSize}px`,
                    textShadow: headerTitleColor === '#ffffff' ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  {isFirstPage ? title : `${title} (Cont.)`}
                </h1>
                {shouldShowSubtitle && (
                  <span
                    className="block text-[14px] tracking-widest uppercase mt-0.5"
                    style={{
                      fontFamily: unifiedFamily,
                      color: headerTitleColor === '#ffffff' ? '#e2e8f0' : '#262626',
                    }}
                  >
                    {cleanSubtitle}
                  </span>
                )}
              </div>
            </div>

            {/* ================= MAIN CONTINUOUS BODY (PHOTO + SERVICES + CLIENT) ================= */}
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
              {/* Background Image Layer */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300 pointer-events-none"
                style={{
                  backgroundImage: `url('${currentBg}')`,
                  filter: 'brightness(0.98)',
                }}
              />

              {/* Soft natural radial wash */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,${0.82}) 0%, rgba(255,255,255,${0.62}) 65%, rgba(255,255,255,${0.74}) 100%)`,
                }}
              />

              {/* Watermark in bottom right of photo */}
              <div className="absolute right-6 bottom-32 pointer-events-none opacity-25 select-none z-10">
                <img
                  src={watermarkLogoSrc}
                  alt=""
                  className="h-28 w-auto object-contain transform -rotate-2"
                />
              </div>

              {/* ================= CENTER CONTENT (SERVICES, TOTALS, NOTES) ================= */}
              <div 
                className="relative z-10 w-full px-8 flex-1 flex flex-col justify-center items-center py-6 my-auto space-y-4"
                style={{ fontFamily: unifiedFamily }}
              >
                {/* Optional Section Subtitle */}
                {isFirstPage && sectionSubtitle && (
                  <div
                    className={`text-stone-900 tracking-wide mb-2 text-center w-full ${
                      isCursive ? 'font-semibold' : 'font-bold uppercase tracking-[0.15em]'
                    }`}
                    style={{ 
                      fontFamily: unifiedFamily,
                      fontSize: `${resolvedSubtitleSize}px`,
                      letterSpacing: letterSpacing,
                    }}
                  >
                    {sectionSubtitle}
                  </div>
                )}

                {/* Services List - Wide format spanning across margins */}
                <div className="w-full space-y-3.5">
                  {pageItems.map((item, index) => {
                    const itemTotal = (Number(item.qty) || 1) * (Number(item.price) || 0);
                    const hasExplicitTotal = item.price !== undefined && item.price !== 0;

                    if (layoutMode === 'center') {
                      return (
                        <div
                          key={item.id || index}
                          className="leading-relaxed text-stone-950 px-2 whitespace-pre-line text-center font-semibold"
                          style={{
                            fontFamily: unifiedFamily,
                            letterSpacing: letterSpacing,
                            lineHeight: 1.4,
                            fontSize: `${resolvedBodySize}px`,
                          }}
                        >
                          <span>{item.description}</span>
                          {item.note && (
                            <span 
                              className="text-stone-700 italic ml-2 font-normal"
                              style={{ fontSize: `${resolvedItemNoteSize}px` }}
                            >
                              ({item.note})
                            </span>
                          )}
                          {hasExplicitTotal && (
                            <span 
                              className="font-bold ml-3.5 inline-block text-stone-950"
                              style={{ fontSize: `${resolvedNumberSize}px` }}
                            >
                              {formatCurrency(itemTotal)}
                            </span>
                          )}
                          {item.optional && (
                            <span className="text-[12px] font-normal text-stone-600 uppercase tracking-wider ml-2.5 px-2 py-0.5 rounded bg-stone-200/80 align-middle">
                              Opcional
                            </span>
                          )}
                        </div>
                      );
                    }

                    // Default: 'spread' (De Margen a Margen)
                    return (
                      <div
                        key={item.id || index}
                        className="w-full flex items-baseline justify-between gap-4 py-1 border-b border-stone-200/50"
                        style={{
                          fontFamily: unifiedFamily,
                          letterSpacing: letterSpacing,
                        }}
                      >
                        <div className="text-left flex-1 min-w-0 pr-3">
                          <span 
                            className="text-stone-950 font-semibold"
                            style={{ 
                              fontSize: `${resolvedBodySize}px`,
                              lineHeight: 1.3,
                            }}
                          >
                            {item.description}
                          </span>
                          {item.note && (
                            <span 
                              className="text-stone-600 italic ml-2.5 font-normal"
                              style={{ fontSize: `${resolvedItemNoteSize}px` }}
                            >
                              ({item.note})
                            </span>
                          )}
                          {item.optional && (
                            <span className="text-[12px] font-normal text-stone-600 uppercase tracking-wider ml-2.5 px-2 py-0.5 rounded bg-stone-200/80 align-middle">
                              Opcional
                            </span>
                          )}
                        </div>

                        {hasExplicitTotal && (
                          <div className="text-right shrink-0">
                            <span 
                              className="font-bold text-stone-950"
                              style={{ fontSize: `${resolvedNumberSize}px` }}
                            >
                              {formatCurrency(itemTotal)}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!isLastPage && (
                  <div className="pt-2 text-stone-600 text-[14px] italic text-center w-full">
                    Continúa en la siguiente página...
                  </div>
                )}

                {/* Total Highlight (Only on Last Page) - Wide prominent bar */}
                {isLastPage && (
                  <div className="pt-3.5 pb-3 border-t-2 border-b-2 border-stone-800 w-full my-3">
                    {layoutMode === 'center' ? (
                      <div
                        className="text-stone-950 font-bold text-center"
                        style={{
                          fontFamily: unifiedFamily,
                          letterSpacing: letterSpacing,
                          fontSize: `${resolvedTotalSize}px`,
                        }}
                      >
                        <span>Total: </span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    ) : (
                      <div
                        className="w-full flex items-baseline justify-between"
                        style={{
                          fontFamily: unifiedFamily,
                          letterSpacing: letterSpacing,
                        }}
                      >
                        <span 
                          className="text-stone-950 font-bold"
                          style={{
                            fontSize: `${Math.round(resolvedTotalSize * 0.9)}px`,
                            letterSpacing: letterSpacing,
                          }}
                        >
                          Total:
                        </span>
                        <span 
                          className="text-stone-950 font-bold"
                          style={{
                            fontSize: `${resolvedTotalSize}px`,
                            letterSpacing: letterSpacing,
                          }}
                        >
                          {formatCurrency(total)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Notes & Bank Details (Only on Last Page) - Wide and legible */}
                {isLastPage && notes && (
                  <div className={`pt-2 w-full ${layoutMode === 'center' ? 'text-center' : 'text-left'}`}>
                    <div
                      className="text-stone-900 leading-relaxed whitespace-pre-line font-medium"
                      style={{
                        fontFamily: unifiedFamily,
                        letterSpacing: letterSpacing,
                        fontSize: `${resolvedDocNoteSize}px`,
                      }}
                    >
                      <p className="font-bold text-stone-950 text-[14px] uppercase tracking-[0.2em] mb-1.5">
                        NOTA :
                      </p>
                      {notes}
                    </div>
                  </div>
                )}
              </div>

              {/* ================= BOTTOM CLIENT INFORMATION ================= */}
              <div 
                className="relative z-10 w-full px-8 pb-3 pt-2 text-stone-900 bg-gradient-to-t from-white/90 via-white/50 to-transparent"
                style={{ fontFamily: unifiedFamily }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className={`italic text-stone-900 leading-normal ${isCursive ? 'text-xl font-bold' : 'text-sm font-semibold'}`}>
                    Cotización para:
                  </p>
                  {quoteNumber && (
                    <span className={`text-stone-900 font-bold tracking-wider leading-normal ${isCursive ? 'text-xl' : 'text-sm'}`}>
                      N°: {quoteNumber}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline border-b border-stone-700/80 pb-1 w-full">
                    <span className={`text-stone-950 mr-2 shrink-0 leading-normal ${isCursive ? 'text-xl font-bold' : 'text-sm font-semibold'}`}>
                      Cliente:
                    </span>
                    <span className={`flex-1 text-stone-950 break-words leading-normal ${isCursive ? 'text-xl font-semibold' : 'text-sm font-medium'}`}>
                      {clientName || ''}
                      {company && company !== clientName ? ` • ${company}` : ''}
                      {rnc ? ` • RNC: ${rnc}` : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8">
                    <div className="flex items-baseline border-b border-stone-700/80 pb-1">
                      <span className={`text-stone-950 mr-2 shrink-0 leading-normal ${isCursive ? 'text-xl font-bold' : 'text-sm font-semibold'}`}>
                        Fecha de evento:
                      </span>
                      <span className={`flex-1 text-stone-950 break-words leading-normal ${isCursive ? 'text-xl font-semibold' : 'text-sm font-medium'}`}>
                        {eventDate || ''}
                      </span>
                    </div>

                    <div className="flex items-baseline border-b border-stone-700/80 pb-1">
                      <span className={`text-stone-950 mr-2 shrink-0 leading-normal ${isCursive ? 'text-xl font-bold' : 'text-sm font-semibold'}`}>
                        Correo:
                      </span>
                      <span className={`flex-1 text-stone-950 break-words leading-normal ${isCursive ? 'text-xl font-semibold' : 'text-sm font-medium'}`}>
                        {clientEmail || ''}
                      </span>
                    </div>
                  </div>

                  {clientPhone && (
                    <div className="flex items-baseline border-b border-stone-700/80 pb-1 max-w-sm">
                      <span className={`text-stone-950 mr-2 shrink-0 leading-normal ${isCursive ? 'text-xl font-bold' : 'text-sm font-semibold'}`}>
                        Teléfono:
                      </span>
                      <span className={`flex-1 text-stone-950 break-words leading-normal ${isCursive ? 'text-xl font-semibold' : 'text-sm font-medium'}`}>
                        {clientPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= BOTTOM FOOTER (CHARCOAL BANNER) ================= */}
            <div className="bg-[#525558] text-white px-8 py-3 flex items-center justify-between z-20 shrink-0 border-t border-stone-600/60 shadow-sm">
              <div className="text-left space-y-1" style={{ fontFamily: unifiedFamily }}>
                <p className="text-sm font-light tracking-wide text-stone-100 leading-normal">
                  (849) 220-9464 &nbsp;|&nbsp; eliottecasimiro129@gmail.com
                </p>
                <p className="text-sm font-semibold tracking-widest text-white leading-normal">
                  @ELIOTTEMUA
                </p>
              </div>

              <div className="flex items-center space-x-3">
                {totalPages > 1 && (
                  <span className="text-xs text-stone-300 font-mono">
                    Página {pageNum} de {totalPages}
                  </span>
                )}
                {showQr && (
                  <div className="bg-white p-1 rounded-sm shadow-sm shrink-0">
                    <img
                      src="./assets/qr_code.png"
                      alt="QR Eliotte MUA"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
