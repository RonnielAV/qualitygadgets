import React from 'react';
import { FONT_THEMES, DEFAULT_MASTER_CLASS } from '../data/templates';
import { Sparkles, MapPin, Users, CheckCircle, BookOpen, Clock, FileText } from 'lucide-react';

export default function PreviewMasterClass({ 
  doc, 
  masterClassRef, 
  activePage, 
  setActivePage 
}) {
  const {
    clientName = 'BEIA Academy',
    contactPerson = '',
    phone = '(849) 220-9464',
    email = 'eliottecasimiro129@gmail.com',
    instagram = '@eliottemua',
    currency = 'USD',
    locations = [],
    syllabusQuote = '',
    instructor = 'Eliotte Casimiro',
    modules = [],
    practiceSection = {},
    customNote = '',
    fontTheme = 'cursive_signature',
  } = doc;

  const activeFont = FONT_THEMES.find(t => t.id === fontTheme) || FONT_THEMES[0];
  const unifiedFamily = activeFont.fontFamily;
  const isCursive = activeFont.isCursive;

  const formatPrice = (price, curr = currency) => {
    const num = Number(price) || 0;
    return curr === 'USD' ? `USD $${num.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `RD$ ${num.toLocaleString()}`;
  };

  const pages = [
    { id: 'cover', num: '1', title: 'Portada Oficial' },
    { id: 'page1', num: '2', title: 'Módulos 1 & 2' },
    { id: 'page2', num: '3', title: 'Módulos 3, 4 & 5' },
    { id: 'page3', num: '4', title: 'Módulos 6 & 7 + Práctica' },
    { id: 'proposal', num: '5', title: 'Propuesta Comercial' },
  ];

  const typewriterFont = "'Courier New', Courier, monospace";

  return (
    <div className="flex flex-col items-center p-0 sm:p-2 select-none w-full">
      {/* ================= PAGE SELECTOR TOOLBAR ================= */}
      <div className="no-print mb-4 w-full max-w-[760px] bg-white p-2 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          {pages.map((p) => {
            const isActive = activePage === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePage(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-amber-800 text-white' : 'bg-stone-300 text-stone-800'
                }`}>
                  {p.num}
                </span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-stone-500 px-2">
          Página {pages.findIndex(p => p.id === activePage) + 1} de {pages.length}
        </div>
      </div>

      {/* ================= PAGE 1: PORTADA OFICIAL ================= */}
      {activePage === 'cover' && (
        <div
          ref={masterClassRef}
          id="masterclass-canvas-cover"
          className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
          style={{
            aspectRatio: '1414 / 2000',
            minHeight: '860px',
          }}
        >
          <img
            src="./assets/masterclass/Portada.png"
            alt="Portada Master Class by Eliotte MUA"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {clientName && (
            <div className="relative z-10 p-8 flex justify-end items-start pointer-events-none">
              <span
                className="text-xs uppercase tracking-widest text-stone-900 bg-white/90 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm font-semibold border border-stone-300"
                style={{ fontFamily: unifiedFamily }}
              >
                Propuesta Exclusiva • {clientName}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ================= PAGE 2: PROGRAMA - MÓDULOS 1 & 2 ================= */}
      {activePage === 'page1' && (
        <div
          ref={masterClassRef}
          id="masterclass-canvas-page1"
          className="w-full max-w-[760px] bg-white shadow-2xl relative overflow-hidden text-stone-900 border border-stone-200"
          style={{
            aspectRatio: '1414 / 2000',
            minHeight: '860px',
          }}
        >
          {/* Authentic Canva High-Fashion Background with Model, Numbers 1 & 2, Cursive "Programa" */}
          <img
            src="./assets/masterclass/Indice de Temas.png"
            alt="Master Class Programa 1"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Statement Quote Box Overlay (React Reactive) */}
          <div
            className="absolute bg-[#5c5c5c] text-white p-3 sm:p-4 flex flex-col justify-between"
            style={{
              left: '37%',
              top: '7.8%',
              width: '58%',
              minHeight: '17%',
              maxHeight: '22%',
              fontFamily: typewriterFont,
            }}
          >
            <p className="text-[10px] sm:text-[11.5px] leading-relaxed italic text-stone-100">
              "{syllabusQuote || DEFAULT_MASTER_CLASS.syllabusQuote}"
            </p>
            <p className="text-right font-bold text-[10px] sm:text-xs text-stone-200 mt-1">
              — {instructor || 'Eliotte Casimiro'}
            </p>
          </div>

          {/* Module 1 Reactive Overlay */}
          {modules[0] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '33.5%',
                top: '44.5%',
                width: '61.5%',
                minHeight: '19.5%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[0].number || 1}. {modules[0].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[0].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Module 2 Reactive Overlay */}
          {modules[1] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '5.5%',
                top: '68.5%',
                width: '58%',
                minHeight: '21%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[1].number || 2}. {modules[1].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[1].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ================= PAGE 3: PROGRAMA - MÓDULOS 3, 4 & 5 ================= */}
      {activePage === 'page2' && (
        <div
          ref={masterClassRef}
          id="masterclass-canvas-page2"
          className="w-full max-w-[760px] bg-white shadow-2xl relative overflow-hidden text-stone-900 border border-stone-200"
          style={{
            aspectRatio: '1414 / 2000',
            minHeight: '860px',
          }}
        >
          {/* Authentic Canva High-Fashion Page 2 Background with Photos & Gradient Numbers */}
          <img
            src="./assets/masterclass/Indice de Temas (2).png"
            alt="Master Class Programa 2"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Module 3 Reactive Overlay */}
          {modules[2] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '34%',
                top: '10.5%',
                width: '61%',
                minHeight: '26%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[2].number || 3}. {modules[2].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[2].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Module 4 Reactive Overlay */}
          {modules[3] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '6.5%',
                top: '42.5%',
                width: '58%',
                minHeight: '27%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[3].number || 4}. {modules[3].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[3].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Module 5 Reactive Overlay */}
          {modules[4] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '33%',
                top: '69.5%',
                width: '58%',
                minHeight: '23%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[4].number || 5}. {modules[4].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[4].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ================= PAGE 4: PROGRAMA - MÓDULOS 6 & 7 + PRÁCTICA ================= */}
      {activePage === 'page3' && (
        <div
          ref={masterClassRef}
          id="masterclass-canvas-page3"
          className="w-full max-w-[760px] bg-white shadow-2xl relative overflow-hidden text-stone-900 border border-stone-200"
          style={{
            aspectRatio: '1414 / 2000',
            minHeight: '860px',
          }}
        >
          {/* Authentic Canva High-Fashion Page 3 Background with Photos & Practice Box */}
          <img
            src="./assets/masterclass/Indice de Temas (3).png"
            alt="Master Class Programa 3"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Module 6 Reactive Overlay */}
          {modules[5] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '34%',
                top: '12.8%',
                width: '58%',
                minHeight: '16%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[5].number || 6}. {modules[5].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[5].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Module 7 Reactive Overlay */}
          {modules[6] && (
            <div
              className="absolute bg-white flex flex-col justify-start"
              style={{
                left: '6.5%',
                top: '38.5%',
                width: '56%',
                minHeight: '22%',
                fontFamily: typewriterFont,
              }}
            >
              <h3 className="font-bold text-xs sm:text-sm text-stone-900 tracking-tight mb-1.5 leading-snug">
                {modules[6].number || 7}. {modules[6].title}
              </h3>
              <ul className="space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs text-stone-900 pl-1 leading-snug">
                {modules[6].topics?.map((topic, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="font-bold shrink-0">•</span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Práctica con Modelo Reactive Overlay (over the dark gray box) */}
          <div
            className="absolute bg-[#5c5c5c] text-white p-3.5 sm:p-5 flex flex-col justify-start space-y-1.5 overflow-hidden"
            style={{
              left: '28.3%',
              top: '65.8%',
              width: '66.8%',
              minHeight: '24%',
              fontFamily: typewriterFont,
            }}
          >
            <h4 className="font-bold text-xs sm:text-sm tracking-wide text-white uppercase">
              {practiceSection?.title || 'Práctica con Modelo'}
            </h4>
            <p className="text-[10px] sm:text-[11.5px] text-stone-100 leading-relaxed italic">
              {practiceSection?.text || DEFAULT_MASTER_CLASS.practiceSection.text}
            </p>
          </div>
        </div>
      )}

      {/* ================= PAGE 5: PROPUESTA COMERCIAL PERSONALIZADA ================= */}
      {activePage === 'proposal' && (
        <div
          ref={masterClassRef}
          id="masterclass-canvas-proposal"
          className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
          style={{
            aspectRatio: '1414 / 2000',
            minHeight: '860px',
            fontFamily: unifiedFamily
          }}
        >
          {/* Subtle typography watermark background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat bg-center"
            style={{
              backgroundImage: "radial-gradient(#222 1px, transparent 1px), radial-gradient(#222 1px, #fff 1px)",
              backgroundSize: "24px 24px"
            }}
          />

          {/* Top Header Bar */}
          <div className="bg-[#5c5c5c] text-white px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-between z-10 shrink-0 border-b border-stone-600 shadow-sm">
            <h1
              className="text-2xl sm:text-3xl text-white tracking-wide"
              style={{
                fontFamily: unifiedFamily,
                fontWeight: isCursive ? 600 : 700,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              Propuesta Comercial
            </h1>
            <div className="text-right" style={{ fontFamily: unifiedFamily }}>
              <span className="text-xs uppercase tracking-widest text-stone-300 font-semibold block">
                Master Class by Eliotte MUA
              </span>
              <span className="text-[11px] text-stone-400">
                {clientName ? `Para: ${clientName}` : 'Formación Profesional'}
              </span>
            </div>
          </div>

          {/* Body with Locations & Packages */}
          <div
            className="relative z-10 flex-1 px-6 sm:px-12 py-6 overflow-y-auto flex flex-col justify-start space-y-6"
            style={{ fontFamily: unifiedFamily }}
          >
            {locations.map((loc, idx) => (
              <div
                key={loc.id || idx}
                className="space-y-3 pb-5 border-b border-stone-200 last:border-b-0"
              >
                {/* Location / Package Header */}
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-900 inline-block"></span>
                  <span>{loc.name}</span>
                </h3>

                {/* Price and Min participants in Courier/Typewriter style */}
                <div className="space-y-1 pl-4 text-xs sm:text-sm text-stone-900">
                  <p className="font-semibold text-stone-900 text-sm sm:text-base">
                    Costo por participante: <span className="font-bold underline">{formatPrice(loc.costPerPerson, loc.currency || currency)}</span>
                  </p>
                  <p className="text-stone-700">
                    Cantidad mínima de participantes: <strong>{loc.minParticipants || 5} personas</strong>.
                  </p>
                </div>

                {/* Includes List */}
                <div className="pl-4 pt-1 space-y-1.5">
                  <p className="text-xs sm:text-sm font-bold text-stone-900">
                    Incluye:
                  </p>
                  <ul className="space-y-1 text-xs sm:text-sm text-stone-800 pl-3">
                    {loc.includes?.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2 leading-relaxed">
                        <span className="text-stone-900 font-bold shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Specific Note */}
                {loc.note && (
                  <div className="pl-4 pt-1 text-xs sm:text-sm text-stone-900 font-semibold italic">
                    Nota: {loc.note}
                  </div>
                )}
              </div>
            ))}

            {/* General Custom Note */}
            {customNote && (
              <div className="mt-4 p-3 bg-stone-50 border-l-2 border-stone-900 text-xs sm:text-sm text-stone-800 whitespace-pre-line">
                {customNote}
              </div>
            )}
          </div>

          {/* Bottom Footer Bar */}
          <div className="bg-[#5c5c5c] text-white px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-10 shrink-0 border-t border-stone-600">
            {/* Left QR */}
            <div className="bg-white p-1 rounded-sm shadow-sm shrink-0">
              <img
                src="./assets/qr_code.png"
                alt="QR Code"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
              />
            </div>

            {/* Center Contact */}
            <div className="text-center space-y-0.5 text-xs sm:text-sm text-stone-100" style={{ fontFamily: unifiedFamily }}>
              <p className="tracking-widest font-semibold">{instagram}</p>
              <p className="font-medium">{phone}</p>
              <p className="text-[10px] sm:text-[11px] text-stone-300">{email}</p>
            </div>

            {/* Right QR */}
            <div className="bg-white p-1 rounded-sm shadow-sm shrink-0">
              <img
                src="./assets/qr_code.png"
                alt="QR Code"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
