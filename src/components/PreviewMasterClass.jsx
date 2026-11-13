import React from 'react';
import { FONT_THEMES, DEFAULT_MASTER_CLASS } from '../data/templates';
import { Sparkles, MapPin, Users, CheckCircle, BookOpen, Clock, FileText, Image as ImageIcon, Layers } from 'lucide-react';

export default function PreviewMasterClass({ 
  doc, 
  masterClassRef, 
  activePage, 
  setActivePage,
  onUpdateDisplayMode 
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
    displayMode = 'artistic', // 'artistic' (Plantilla Oficial Canva Fija) | 'dynamic' (Diseño Editorial Dinámico)
  } = doc;

  const isArtistic = displayMode === 'artistic';

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
    { id: 'page3', num: '4', title: 'Módulos 6, 7 + Práctica' },
    { id: 'proposal', num: '5', title: 'Propuesta Comercial' },
  ];

  const typewriterFont = "'Courier New', Courier, monospace";
  const headingFont = "'Montserrat', 'Inter', system-ui, sans-serif";

  // Shared Header for Editorial pages
  const renderHeader = (titleText) => (
    <div className="bg-[#5c5c5c] text-white px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between z-10 shrink-0 border-b border-stone-600 shadow-sm">
      <h1
        className="text-xl sm:text-2xl text-white tracking-wide"
        style={{
          fontFamily: unifiedFamily,
          fontWeight: isCursive ? 600 : 700,
          textShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        {titleText}
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
  );

  // Shared Footer for Editorial pages
  const renderFooter = () => (
    <div className="bg-[#5c5c5c] text-white px-6 sm:px-8 py-3 flex items-center justify-between z-10 shrink-0 border-t border-stone-600">
      <div className="bg-white p-1 rounded-sm shadow-sm shrink-0">
        <img
          src="./assets/qr_code.png"
          alt="QR Code"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
      </div>

      <div className="text-center space-y-0.5 text-xs text-stone-100" style={{ fontFamily: unifiedFamily }}>
        <p className="tracking-widest font-semibold">{instagram}</p>
        <p className="font-medium">{phone}</p>
        <p className="text-[10px] text-stone-300">{email}</p>
      </div>

      <div className="bg-white p-1 rounded-sm shadow-sm shrink-0">
        <img
          src="./assets/qr_code.png"
          alt="QR Code"
          className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
        />
      </div>
    </div>
  );

  // Subtle watermark background
  const renderWatermarkBackground = () => (
    <div 
      className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat bg-center"
      style={{
        backgroundImage: "radial-gradient(#222 1px, transparent 1px), radial-gradient(#222 1px, #fff 1px)",
        backgroundSize: "24px 24px"
      }}
    />
  );

  // ================= 1. PORTADA OFICIAL =================
  const renderCover = (ref, id) => (
    <div
      ref={ref}
      id={id}
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
  );

  // ================= 2. PÁGINA 2: MÓDULOS 1 & 2 =================
  // Modo Canva Oficial (Cero sobreposiciones, 100% puro)
  const renderCanvaPage1 = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
      }}
    >
      <img
        src="./assets/masterclass/Indice de Temas.png"
        alt="Master Class Programa 1"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );

  // Modo Editorial Dinámico (Editable, responsive, sin textos fantasmas)
  const renderEditorialPage1 = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
        fontFamily: unifiedFamily,
      }}
    >
      {renderWatermarkBackground()}
      {renderHeader('Programa • Fundamentos & Teoría')}

      <div className="relative z-10 flex-1 px-6 sm:px-10 py-6 overflow-y-auto flex flex-col justify-start space-y-6">
        {/* Statement / Quote Card */}
        <div className="bg-[#5c5c5c] text-white p-4 sm:p-5 rounded-2xl shadow-sm space-y-2 border border-stone-600">
          <p className="text-xs sm:text-[13px] leading-relaxed italic text-stone-100" style={{ fontFamily: typewriterFont }}>
            "{syllabusQuote || DEFAULT_MASTER_CLASS.syllabusQuote}"
          </p>
          <p className="text-right font-bold text-xs text-stone-300">
            — {instructor || 'Eliotte Casimiro'}
          </p>
        </div>

        {/* Modules 1 and 2 Cards */}
        <div className="space-y-5">
          {modules.slice(0, 2).map((mod, idx) => (
            <div 
              key={mod.id || idx}
              className="p-5 bg-stone-50 rounded-2xl border border-stone-200/90 shadow-2xs flex items-start space-x-4"
            >
              <div className="text-4xl sm:text-5xl font-black text-stone-900 font-serif shrink-0 leading-none pt-0.5 w-10 text-center">
                {mod.number || (idx + 1)}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight" style={{ fontFamily: headingFont }}>
                  {mod.title}
                </h3>
                <ul className="space-y-1.5 text-xs sm:text-[13px] text-stone-800 leading-snug" style={{ fontFamily: typewriterFont }}>
                  {mod.topics?.map((top, tIdx) => (
                    <li key={tIdx} className="flex items-start space-x-2">
                      <span className="font-bold text-stone-900 shrink-0">•</span>
                      <span>{top}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  // ================= 3. PÁGINA 3: MÓDULOS 3, 4 & 5 =================
  // Modo Canva Oficial
  const renderCanvaPage2 = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
      }}
    >
      <img
        src="./assets/masterclass/Indice de Temas (2).png"
        alt="Master Class Programa 2"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );

  // Modo Editorial Dinámico
  const renderEditorialPage2 = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
        fontFamily: unifiedFamily,
      }}
    >
      {renderWatermarkBackground()}
      {renderHeader('Programa • Técnicas PRO & Rostro')}

      <div className="relative z-10 flex-1 px-6 sm:px-10 py-6 overflow-y-auto flex flex-col justify-start space-y-5">
        {modules.slice(2, 5).map((mod, idx) => (
          <div 
            key={mod.id || idx}
            className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200/90 shadow-2xs flex items-start space-x-4"
          >
            <div className="text-4xl sm:text-5xl font-black text-stone-900 font-serif shrink-0 leading-none pt-0.5 w-10 text-center">
              {mod.number || (idx + 3)}
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight" style={{ fontFamily: headingFont }}>
                {mod.title}
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-[13px] text-stone-800 leading-snug" style={{ fontFamily: typewriterFont }}>
                {mod.topics?.map((top, tIdx) => (
                  <li key={tIdx} className="flex items-start space-x-2">
                    <span className="font-bold text-stone-900 shrink-0">•</span>
                    <span>{top}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {renderFooter()}
    </div>
  );

  // ================= 4. PÁGINA 4: MÓDULOS 6, 7 & MÓDULO 8+ + PRÁCTICA =================
  // Modo Canva Oficial
  const renderCanvaPage3 = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
      }}
    >
      <img
        src="./assets/masterclass/Indice de Temas (3).png"
        alt="Master Class Programa 3"
        className="w-full h-full object-cover pointer-events-none"
      />
    </div>
  );

  // Modo Editorial Dinámico (Acomoda Módulo 6, 7, 8, 9... y Práctica sin límites)
  const renderEditorialPage3 = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
        fontFamily: unifiedFamily,
      }}
    >
      {renderWatermarkBackground()}
      {renderHeader('Programa • Especializaciones & Práctica')}

      <div className="relative z-10 flex-1 px-6 sm:px-10 py-5 overflow-y-auto flex flex-col justify-start space-y-4">
        {/* Modules 6, 7 and any 8, 9, 10... */}
        {modules.slice(5).map((mod, idx) => (
          <div 
            key={mod.id || idx}
            className="p-4 sm:p-4.5 bg-stone-50 rounded-2xl border border-stone-200/90 shadow-2xs flex items-start space-x-4"
          >
            <div className="text-4xl sm:text-5xl font-black text-stone-900 font-serif shrink-0 leading-none pt-0.5 w-10 text-center">
              {mod.number || (idx + 6)}
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="font-bold text-sm sm:text-base text-stone-900 tracking-tight" style={{ fontFamily: headingFont }}>
                {mod.title}
              </h3>
              <ul className="space-y-1 text-xs sm:text-[12.5px] text-stone-800 leading-snug" style={{ fontFamily: typewriterFont }}>
                {mod.topics?.map((top, tIdx) => (
                  <li key={tIdx} className="flex items-start space-x-2">
                    <span className="font-bold text-stone-900 shrink-0">•</span>
                    <span>{top}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Práctica con Modelo Section */}
        <div className="p-4 sm:p-5 bg-[#5c5c5c] text-white rounded-2xl shadow-sm space-y-2 border border-stone-600 mt-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
            <h4 className="font-bold text-xs sm:text-sm tracking-wider uppercase text-white">
              {practiceSection?.title || 'Práctica con Modelo'}
            </h4>
          </div>
          <p className="text-xs sm:text-[12.5px] text-stone-100 leading-relaxed italic" style={{ fontFamily: typewriterFont }}>
            {practiceSection?.text || DEFAULT_MASTER_CLASS.practiceSection.text}
          </p>
        </div>
      </div>

      {renderFooter()}
    </div>
  );

  // ================= 5. PROPUESTA COMERCIAL =================
  const renderProposal = (ref, id) => (
    <div
      ref={ref}
      id={id}
      className="w-full max-w-[760px] bg-white shadow-2xl relative flex flex-col justify-between overflow-hidden text-stone-900 border border-stone-200"
      style={{
        aspectRatio: '1414 / 2000',
        minHeight: '860px',
        fontFamily: unifiedFamily
      }}
    >
      {renderWatermarkBackground()}
      {renderHeader('Propuesta Comercial')}

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
                Costo por participante: <span className="font-bold text-stone-950">{formatPrice(loc.costPerPerson, loc.currency || currency)}</span>
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

      {renderFooter()}
    </div>
  );

  // Helper selector for pages based on displayMode
  const getPageRenderer = (pageId, ref, id) => {
    if (pageId === 'cover') return renderCover(ref, id);
    if (pageId === 'proposal') return renderProposal(ref, id);

    if (isArtistic) {
      if (pageId === 'page1') return renderCanvaPage1(ref, id);
      if (pageId === 'page2') return renderCanvaPage2(ref, id);
      if (pageId === 'page3') return renderCanvaPage3(ref, id);
    } else {
      if (pageId === 'page1') return renderEditorialPage1(ref, id);
      if (pageId === 'page2') return renderEditorialPage2(ref, id);
      if (pageId === 'page3') return renderEditorialPage3(ref, id);
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center p-0 sm:p-2 select-none w-full">
      {/* ================= PAGE SELECTOR TOOLBAR ================= */}
      <div className="no-print mb-4 w-full max-w-[760px] bg-white p-2.5 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
          {pages.map((p) => {
            const isActive = activePage === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePage(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-stone-700 text-white' : 'bg-stone-300 text-stone-800'
                }`}>
                  {p.num}
                </span>
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* ================= DUAL MODE SWITCHER (IDEA 3) ================= */}
        {onUpdateDisplayMode && (
          <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded-xl text-xs shrink-0">
            <button
              type="button"
              onClick={() => onUpdateDisplayMode('artistic')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                isArtistic
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Muestra las piezas originales de Canva tal como fueron diseñadas (Cero textos fantasmas)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Plantilla Oficial Canva</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateDisplayMode('dynamic')}
              className={`px-2.5 py-1 rounded-lg font-semibold flex items-center space-x-1.5 transition-all ${
                !isArtistic
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Diseño editorial para cursos personalizados con Módulo 8 o más"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-300" />
              <span>Diseño Editorial Dinámico {modules.length > 7 ? `(${modules.length} Módulos)` : ''}</span>
            </button>
          </div>
        )}
      </div>

      {/* Helpful banner if user configured 8+ modules while in artistic mode */}
      {isArtistic && modules.length > 7 && (
        <div className="no-print mb-4 w-full max-w-[760px] bg-stone-100 border border-stone-300 rounded-xl p-2.5 flex items-center justify-between text-xs text-stone-800 shadow-2xs">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-stone-600 shrink-0" />
            <span>
              Tienes <strong>{modules.length} módulos configurados</strong>. La plantilla de Canva oficial está diseñada para 7 módulos. Activa el <strong>Diseño Editorial Dinámico</strong> para ver el Módulo 8.
            </span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateDisplayMode?.('dynamic')}
            className="ml-3 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg text-xs shrink-0 transition-colors"
          >
            Ver Módulo {modules.length} en Editorial
          </button>
        </div>
      )}

      {/* ================= ACTIVE PAGE VIEW ================= */}
      {getPageRenderer(activePage, masterClassRef, 'masterclass-canvas-active')}

      {/* ================= HIDDEN FULL DOSSIER CONTAINER (ALL 5 PAGES FOR PDF EXPORT) ================= */}
      <div
        id="masterclass-full-dossier"
        className="no-print"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '0',
          width: '750px',
          pointerEvents: 'none',
        }}
      >
        {getPageRenderer('cover', null, 'mc-export-page-1')}
        {getPageRenderer('page1', null, 'mc-export-page-2')}
        {getPageRenderer('page2', null, 'mc-export-page-3')}
        {getPageRenderer('page3', null, 'mc-export-page-4')}
        {getPageRenderer('proposal', null, 'mc-export-page-5')}
      </div>
    </div>
  );
}
