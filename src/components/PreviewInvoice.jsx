import React from 'react';
import { FONT_THEMES } from '../data/templates';

export default function PreviewInvoice({ doc, invoiceRef }) {
  const {
    invoiceNumber = 'FAC-2026-001',
    invoiceDate = new Date().toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }),
    clientName = '',
    company = '',
    rnc = '',
    clientEmail = '',
    clientPhone = '',
    projectDescription = '',
    currency = 'RD$',
    items = [],
    discount = 0,
    notes = '',
    fontTheme = 'modern_montserrat',
    logoVariant = 'black', // 'black' | 'white' | 'grey'
  } = doc;

  const activeFont = FONT_THEMES.find(t => t.id === fontTheme) || FONT_THEMES.find(t => t.id === 'modern_montserrat') || FONT_THEMES[0];
  const unifiedFamily = activeFont.fontFamily;
  const isCursive = activeFont.isCursive;
  const letterSpacing = activeFont.letterSpacing || 'normal';

  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.qty) || 1;
    const price = Number(item.price) || 0;
    return sum + (qty * price);
  }, 0);

  const discountAmount = Number(discount) || 0;
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    const formatted = num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return currency === 'US$' ? `$${formatted} US` : `RD$ ${formatted}`;
  };

  const getLogoSrc = (variant) => {
    if (variant === 'white') return './assets/logos/logo-white-trans.png';
    if (variant === 'grey') return './assets/logos/logo-grey-trans.png';
    return './assets/logos/logo-black-trans.png';
  };

  const logoSrc = getLogoSrc(logoVariant);

  return (
    <div className="flex justify-center p-0 select-none w-full">
      {/* A4 Container */}
      <div
        ref={invoiceRef}
        id="invoice-document-canvas"
        className="bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
        style={{
          width: '750px',
          minWidth: '750px',
          maxWidth: '750px',
          height: '1060px',
          minHeight: '1060px',
          maxHeight: '1060px',
          boxSizing: 'border-box',
          fontFamily: unifiedFamily,
          letterSpacing: letterSpacing,
        }}
      >
        {/* ================= TOP HEADER ================= */}
        <div className="p-8 pb-6 flex items-start justify-between border-b border-stone-200" style={{ fontFamily: unifiedFamily }}>
          {/* Logo Eliotte MUA */}
          <div>
            <img
              src={logoSrc}
              alt="Eliotte MUA"
              className="h-16 w-auto object-contain"
            />
            <p className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium" style={{ fontFamily: unifiedFamily }}>
              Eliotte Casimiro • Makeup Artist
            </p>
          </div>

          {/* FACTURA Box */}
          <div className="text-right">
            <h2 className="text-3xl font-light tracking-[0.25em] text-stone-900 uppercase" style={{ fontFamily: unifiedFamily }}>
              FACTURA
            </h2>
            <div className="mt-2 border border-stone-900 px-4 py-2 inline-block bg-stone-50 text-left min-w-[200px]">
              <div className="flex justify-between text-sm font-semibold tracking-wide text-stone-800 border-b border-stone-300 pb-1 mb-1">
                <span className="mr-2">N° FACTURA:</span>
                <span className="text-stone-950 font-bold" style={{ fontFamily: unifiedFamily }}>{invoiceNumber}</span>
              </div>
              <div className="text-sm font-medium text-stone-700">
                <span className="font-semibold text-stone-900 block text-[11px] uppercase tracking-wider">FECHA:</span>
                <span style={{ fontFamily: unifiedFamily }}>{invoiceDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CLIENT INFO SECTION (FULL VISIBILITY) ================= */}
        <div className="px-8 py-5 bg-stone-50/60 border-b border-stone-200 text-sm" style={{ fontFamily: unifiedFamily }}>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Facturado a / Cotización para:
          </p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex items-baseline space-x-2 border-b border-stone-300/80 pb-1">
              <span className="font-semibold text-stone-900 w-20 shrink-0">Cliente:</span>
              <span className="font-medium text-stone-900 flex-1 break-words">{clientName || '—'}</span>
            </div>
            <div className="flex items-baseline space-x-2 border-b border-stone-300/80 pb-1">
              <span className="font-semibold text-stone-900 w-20 shrink-0">Correo:</span>
              <span className="font-medium text-stone-900 flex-1 break-words">{clientEmail || '—'}</span>
            </div>
            <div className="flex items-baseline space-x-2 border-b border-stone-300/80 pb-1">
              <span className="font-semibold text-stone-900 w-20 shrink-0">Empresa:</span>
              <span className="font-medium text-stone-900 flex-1 break-words">{company || '—'}</span>
            </div>
            <div className="flex items-baseline space-x-2 border-b border-stone-300/80 pb-1">
              <span className="font-semibold text-stone-900 w-20 shrink-0">Teléfono:</span>
              <span className="font-medium text-stone-900 flex-1 break-words">{clientPhone || '—'}</span>
            </div>
            {rnc && (
              <div className="flex items-baseline space-x-2 border-b border-stone-300/80 pb-1">
                <span className="font-semibold text-stone-900 w-20 shrink-0">RNC / Céd:</span>
                <span className="font-medium text-stone-900 flex-1 break-words">{rnc}</span>
              </div>
            )}
            {projectDescription && (
              <div className="col-span-2 flex items-baseline space-x-2 border-b border-stone-300/80 pb-1">
                <span className="font-semibold text-stone-900 w-20 shrink-0">Proyecto:</span>
                <span className="font-medium text-stone-900 flex-1 break-words">{projectDescription}</span>
              </div>
            )}
          </div>
        </div>

        {/* ================= ITEMS TABLE WITH UNIFIED FONT ================= */}
        <div className="px-8 py-6 flex-1 flex flex-col justify-start" style={{ fontFamily: unifiedFamily }}>
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-stone-900 text-stone-900 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-2.5 w-16 text-center">Cant.</th>
                <th className="py-2.5 px-3">Descripción de Servicio</th>
                <th className="py-2.5 px-3 text-right w-28">Precio Unit.</th>
                <th className="py-2.5 text-right w-28">Importe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {items.map((item, index) => {
                const qty = Number(item.qty) || 1;
                const price = Number(item.price) || 0;
                const lineTotal = qty * price;
                return (
                  <tr key={item.id || index} className="text-stone-800">
                    <td className="py-3 text-center font-medium" style={{ fontFamily: unifiedFamily }}>{qty}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-stone-900 block whitespace-pre-line">{item.description}</span>
                      {item.note && (
                        <span className="text-xs text-stone-500 italic block">{item.note}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-medium" style={{ fontFamily: unifiedFamily }}>{formatCurrency(price)}</td>
                    <td className="py-3 text-right font-bold text-stone-900" style={{ fontFamily: unifiedFamily }}>{formatCurrency(lineTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ================= TOTALS & SUMMARY WITH UNIFIED FONT ================= */}
          <div className="mt-6 pt-4 border-t-2 border-stone-300 flex flex-col sm:flex-row justify-between items-start gap-6">
            {/* Payment & Bank Information */}
            <div className="text-xs text-stone-600 max-w-sm space-y-1" style={{ fontFamily: unifiedFamily }}>
              <p className="font-bold text-stone-900 uppercase tracking-wider">
                Información de Pago:
              </p>
              <p className="text-stone-800 font-medium">
                Banco Popular Dominicano (BPD)
              </p>
              <p className="text-stone-800">
                Cuenta Corriente en pesos: <strong className="text-stone-900">814-307880</strong>
              </p>
              <p className="text-stone-800">
                Cédula: <strong className="text-stone-900">031-0422823-8</strong>
              </p>
              <p className="text-stone-800">
                Titular: <strong className="text-stone-900">Eliotte Casimiro</strong>
              </p>
              {notes && (
                <p className="pt-2 text-stone-600 italic whitespace-pre-line">
                  {notes}
                </p>
              )}
            </div>

            {/* Calculations Box with Unified Font */}
            <div className="w-full sm:w-64 space-y-2 text-xs sm:text-sm" style={{ fontFamily: unifiedFamily }}>
              <div className="flex justify-between py-1 border-b border-stone-200 text-stone-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-stone-200 text-emerald-700 font-medium">
                  <span>Descuento:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2.5 border-b-2 border-stone-900 text-stone-900 text-base sm:text-lg font-bold">
                <span>TOTAL:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM FOOTER WITH UNIFIED FONT ================= */}
        <div className="bg-stone-900 text-stone-200 px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between text-xs tracking-wide shrink-0" style={{ fontFamily: unifiedFamily }}>
          <div className="flex items-center space-x-3 mb-1 sm:mb-0">
            <span className="font-medium text-white">(849) 220-9464</span>
            <span className="text-stone-500">•</span>
            <span className="font-medium text-stone-300">eliottecasimiro129@gmail.com</span>
          </div>
          <div className="font-semibold text-white tracking-widest uppercase text-xs">
            @ELIOTTEMUA
          </div>
        </div>
      </div>
    </div>
  );
}
