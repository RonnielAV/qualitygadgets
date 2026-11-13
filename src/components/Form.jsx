import React, { useState } from 'react';
import { 
  QUOTE_TEMPLATES, 
  ALL_BACKGROUNDS, 
  QUICK_SERVICES_CATALOG, 
  BUSINESS_INFO,
  FONT_THEMES,
  LOGO_VARIANTS,
  DEFAULT_MASTER_CLASS
} from '../data/templates';
import { 
  Sparkles, 
  FileText, 
  Receipt, 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  CheckCircle2, 
  Layers, 
  RotateCcw,
  Sliders,
  GraduationCap,
  MapPin,
  BookOpen,
  ListPlus,
  Type,
  Palette,
  Hash,
  AlertTriangle,
  Tag,
  PlusCircle,
  Percent,
  Coins,
  Users,
  UserPlus
} from 'lucide-react';
import { isNumberDuplicated } from '../utils/numberingUtils';

export default function Form({ 
  docType, 
  setDocType, 
  quoteDoc, 
  setQuoteDoc, 
  invoiceDoc, 
  setInvoiceDoc,
  masterClassDoc,
  setMasterClassDoc,
  activeMasterClassPage,
  setActiveMasterClassPage,
  history = [],
  clients = [],
  onSaveClients,
  onOpenClientsModal,
  onSelectClientForDoc,
  showToast,
  onNewQuote,
  onNewInvoice,
  onNextQuoteNumber,
  onNextInvoiceNumber
}) {
  const [activeTab, setActiveTab] = useState('template'); 
  const [mcTab, setMcTab] = useState('proposal'); // 'proposal' | 'syllabus'

  const isQuote = docType === 'quote';
  const isInvoice = docType === 'invoice';
  const isMasterClass = docType === 'masterclass';

  const updateCurrentDoc = (field, value) => {
    if (isQuote) {
      setQuoteDoc(prev => ({ ...prev, [field]: value }));
    } else if (isInvoice) {
      setInvoiceDoc(prev => ({ ...prev, [field]: value }));
    } else {
      setMasterClassDoc(prev => ({ ...prev, [field]: value }));
    }
  };

  // ================= CLIENT SELECTION & QUICK-SAVE HANDLERS =================
  const handleApplySelectedClient = (clientId) => {
    if (!clientId) return;
    const selected = clients.find(c => c.id === clientId);
    if (selected) {
      if (onSelectClientForDoc) {
        onSelectClientForDoc(selected);
      } else {
        updateCurrentDoc('clientName', selected.name || '');
        updateCurrentDoc('company', selected.company || '');
        updateCurrentDoc('rnc', selected.rnc || '');
        updateCurrentDoc('clientEmail', selected.email || '');
        updateCurrentDoc('clientPhone', selected.phone || '');
      }
      showToast?.(`Datos de "${selected.name}" cargados en el documento.`);
    }
  };

  const handleQuickSaveCurrentClient = () => {
    const targetDoc = isQuote ? quoteDoc : invoiceDoc;
    const name = (targetDoc.clientName || '').trim();
    if (!name) {
      showToast?.('⚠️ Escribe el nombre del cliente antes de guardarlo.');
      return;
    }

    const company = (targetDoc.company || '').trim();
    const rnc = (targetDoc.rnc || '').trim();
    const email = (targetDoc.clientEmail || '').trim();
    const phone = (targetDoc.clientPhone || '').trim();

    // Check if client already exists by name or company
    const existingIndex = clients.findIndex(c => 
      c.name?.toLowerCase().trim() === name.toLowerCase() ||
      (company && c.company && c.company.toLowerCase().trim() === company.toLowerCase())
    );

    let updatedClients;
    if (existingIndex >= 0) {
      updatedClients = [...clients];
      updatedClients[existingIndex] = {
        ...updatedClients[existingIndex],
        name: name,
        company: company,
        rnc: rnc,
        email: email,
        phone: phone,
        updatedAt: new Date().toISOString(),
      };
      showToast?.(`¡Cliente "${name}" actualizado en el directorio!`);
    } else {
      const newClient = {
        id: 'cli_' + Date.now(),
        name: name,
        company: company,
        rnc: rnc,
        email: email,
        phone: phone,
        notes: isQuote ? `Evento: ${targetDoc.eventDate || ''}` : `Factura: ${targetDoc.projectDescription || ''}`,
        createdAt: new Date().toISOString(),
      };
      updatedClients = [newClient, ...clients];
      showToast?.(`¡Cliente "${name}" guardado con éxito en el directorio!`);
    }

    if (onSaveClients) {
      onSaveClients(updatedClients);
    }
  };

  // ================= QUOTE & INVOICE ITEM HANDLERS =================
  const handleAddCustomItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      price: 0,
      qty: 1,
      note: '',
      optional: false,
    };
    const targetDoc = isQuote ? quoteDoc : invoiceDoc;
    updateCurrentDoc('items', [...(targetDoc.items || []), newItem]);
  };

  const handleAddDiscountItem = () => {
    const targetDoc = isQuote ? quoteDoc : invoiceDoc;
    const isUSD = targetDoc.currency === 'US$';
    const newItem = {
      id: Date.now().toString(),
      description: '-Descuento por servicio frecuente / cliente especial',
      price: isUSD ? -50 : -5000,
      qty: 1,
      note: 'Descuento',
      optional: false,
    };
    updateCurrentDoc('items', [...(targetDoc.items || []), newItem]);
  };

  const handleAddCatalogItem = (service) => {
    const targetDoc = isQuote ? quoteDoc : invoiceDoc;
    const isUSD = targetDoc.currency === 'US$';
    const price = isUSD ? service.priceUS : service.priceRD;
    const newItem = {
      id: Date.now().toString(),
      description: service.name,
      price: price,
      qty: 1,
      note: '',
      optional: false,
    };
    updateCurrentDoc('items', [...(targetDoc.items || []), newItem]);
  };

  const handleUpdateItem = (index, field, value) => {
    const targetDoc = isQuote ? quoteDoc : invoiceDoc;
    const updated = [...(targetDoc.items || [])];
    updated[index] = { ...updated[index], [field]: value };
    updateCurrentDoc('items', updated);
  };

  const handleRemoveItem = (index) => {
    const targetDoc = isQuote ? quoteDoc : invoiceDoc;
    const updated = [...(targetDoc.items || [])];
    updated.splice(index, 1);
    updateCurrentDoc('items', updated);
  };

  const handleSelectTemplate = (template) => {
    setQuoteDoc(prev => ({
      ...prev,
      templateId: template.id,
      quoteNumber: prev.quoteNumber || template.quoteNumber || 'COT-2026-001',
      title: template.headerTitle,
      subtitle: template.headerTitleEn || '',
      sectionSubtitle: template.sectionSubtitle || '',
      headerTitleColor: template.headerTitleColor || '#1a1a1a',
      currency: template.currency,
      bgImage: template.defaultBg,
      customBgUrl: '',
      clientName: template.clientName !== undefined ? template.clientName : prev.clientName,
      clientEmail: template.clientEmail !== undefined ? template.clientEmail : prev.clientEmail,
      eventDate: template.eventDate !== undefined ? template.eventDate : prev.eventDate,
      rnc: template.rnc !== undefined ? template.rnc : prev.rnc,
      notes: template.defaultNote,
      fontTheme: template.fontTheme || prev.fontTheme || 'canva_caveat',
      items: template.sampleItems.map(item => ({ ...item, id: Math.random().toString() })),
    }));
  };

  const handleCustomImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCurrentDoc('customBgUrl', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ================= MASTER CLASS HANDLERS =================
  const handleAddLocation = () => {
    const newLoc = {
      id: Date.now().toString(),
      name: 'Nueva Sede / Paquete',
      costPerPerson: 200,
      currency: masterClassDoc.currency || 'USD',
      minParticipants: 5,
      includes: [
        'Masterclass Profesional de Maquillaje.',
        'Material de apoyo.',
        'Certificado digital o físico.',
        'Acompañamiento técnico durante la práctica.',
        'Retroalimentación individual.'
      ],
      note: 'Cada participante debe llevar su modelo para practicar.'
    };
    setMasterClassDoc(prev => ({
      ...prev,
      locations: [...(prev.locations || []), newLoc]
    }));
  };

  const handleUpdateLocation = (index, field, value) => {
    const updated = [...(masterClassDoc.locations || [])];
    updated[index] = { ...updated[index], [field]: value };
    setMasterClassDoc(prev => ({ ...prev, locations: updated }));
  };

  const handleRemoveLocation = (index) => {
    const updated = [...(masterClassDoc.locations || [])];
    updated.splice(index, 1);
    setMasterClassDoc(prev => ({ ...prev, locations: updated }));
  };

  const handleAddIncludePoint = (locIndex) => {
    const updated = [...(masterClassDoc.locations || [])];
    updated[locIndex].includes = [...(updated[locIndex].includes || []), 'Nuevo beneficio / material'];
    setMasterClassDoc(prev => ({ ...prev, locations: updated }));
  };

  const handleUpdateIncludePoint = (locIndex, incIndex, value) => {
    const updated = [...(masterClassDoc.locations || [])];
    updated[locIndex].includes[incIndex] = value;
    setMasterClassDoc(prev => ({ ...prev, locations: updated }));
  };

  const handleRemoveIncludePoint = (locIndex, incIndex) => {
    const updated = [...(masterClassDoc.locations || [])];
    updated[locIndex].includes.splice(incIndex, 1);
    setMasterClassDoc(prev => ({ ...prev, locations: updated }));
  };

  const handleUpdateModule = (modIndex, field, value) => {
    const updated = [...(masterClassDoc.modules || [])];
    updated[modIndex] = { ...updated[modIndex], [field]: value };
    setMasterClassDoc(prev => ({ ...prev, modules: updated }));
  };

  const handleUpdateTopic = (modIndex, topIndex, value) => {
    const updated = [...(masterClassDoc.modules || [])];
    updated[modIndex].topics[topIndex] = value;
    setMasterClassDoc(prev => ({ ...prev, modules: updated }));
  };

  const handleAddTopic = (modIndex) => {
    const updated = [...(masterClassDoc.modules || [])];
    updated[modIndex].topics = [...(updated[modIndex].topics || []), 'Nuevo tema especializado'];
    setMasterClassDoc(prev => ({ ...prev, modules: updated }));
  };

  const handleRemoveTopic = (modIndex, topIndex) => {
    const updated = [...(masterClassDoc.modules || [])];
    updated[modIndex].topics.splice(topIndex, 1);
    setMasterClassDoc(prev => ({ ...prev, modules: updated }));
  };

  const currentFontTheme = (isQuote ? quoteDoc : (isInvoice ? invoiceDoc : masterClassDoc)).fontTheme || 'canva_caveat';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-full">
      {/* ================= TOP SELECTOR: Cotización vs Factura vs Master Class ================= */}
      <div className="bg-stone-900 p-2 sm:p-2.5 flex space-x-1.5 sm:space-x-2">
        <button
          type="button"
          onClick={() => setDocType('quote')}
          className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all ${
            isQuote
              ? 'bg-rose-500 text-white shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="truncate">Cotizaciones</span>
        </button>

        <button
          type="button"
          onClick={() => setDocType('invoice')}
          className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all ${
            isInvoice
              ? 'bg-stone-100 text-stone-900 shadow-md'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span className="truncate">Facturas</span>
        </button>

        <button
          type="button"
          onClick={() => setDocType('masterclass')}
          className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center space-x-1.5 text-xs font-semibold transition-all ${
            isMasterClass
              ? 'bg-amber-400 text-stone-900 shadow-md font-bold'
              : 'text-stone-400 hover:text-white hover:bg-stone-800'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span className="truncate">Master Class</span>
        </button>
      </div>

      {/* ================= MASTER CLASS VIEW SWITCHER & SUB-TABS ================= */}
      {isMasterClass ? (
        <div className="border-b border-stone-200 bg-stone-50 p-2.5 space-y-2">
          {/* Pager */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-stone-500 text-[11px] uppercase tracking-wider">Página del Portafolio:</span>
            <div className="inline-flex rounded-lg border border-stone-300 p-0.5 bg-stone-200/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveMasterClassPage('cover')}
                className={`px-2 py-1 rounded font-medium ${activeMasterClassPage === 'cover' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
              >
                1. Portada
              </button>
              <button
                type="button"
                onClick={() => setActiveMasterClassPage('page1')}
                className={`px-2 py-1 rounded font-medium ${activeMasterClassPage === 'page1' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
              >
                2. Mód 1-2
              </button>
              <button
                type="button"
                onClick={() => setActiveMasterClassPage('page2')}
                className={`px-2 py-1 rounded font-medium ${activeMasterClassPage === 'page2' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
              >
                3. Mód 3-5
              </button>
              <button
                type="button"
                onClick={() => setActiveMasterClassPage('page3')}
                className={`px-2 py-1 rounded font-medium ${activeMasterClassPage === 'page3' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
              >
                4. Mód 6-7
              </button>
              <button
                type="button"
                onClick={() => setActiveMasterClassPage('proposal')}
                className={`px-2 py-1 rounded font-medium ${activeMasterClassPage === 'proposal' ? 'bg-white shadow text-stone-900' : 'text-stone-600'}`}
              >
                5. Propuesta
              </button>
            </div>
          </div>

          {/* Form Tabs */}
          <div className="flex border-t border-stone-200 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setMcTab('proposal')}
              className={`flex-1 py-1.5 font-semibold text-center border-b-2 transition-colors ${
                mcTab === 'proposal'
                  ? 'border-amber-500 text-stone-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              📍 Cliente & Sedes / Precios
            </button>
            <button
              type="button"
              onClick={() => setMcTab('syllabus')}
              className={`flex-1 py-1.5 font-semibold text-center border-b-2 transition-colors ${
                mcTab === 'syllabus'
                  ? 'border-amber-500 text-stone-900 font-bold'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              📖 Temario & Tipografía
            </button>
          </div>
        </div>
      ) : (
        /* ================= QUOTE & INVOICE NAVIGATION TABS ================= */
        <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto text-xs sm:text-sm">
          {isQuote && (
            <button
              type="button"
              onClick={() => setActiveTab('template')}
              className={`px-4 py-3 font-medium flex items-center space-x-1.5 whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'template'
                  ? 'border-rose-500 text-rose-600 bg-white font-semibold'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Plantilla & Fotos</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`px-4 py-3 font-medium flex items-center space-x-1.5 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'client'
                ? 'border-rose-500 text-rose-600 bg-white font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Cliente & Fechas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`px-4 py-3 font-medium flex items-center space-x-1.5 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'items'
                ? 'border-rose-500 text-rose-600 bg-white font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Servicios ({((isQuote ? quoteDoc : invoiceDoc).items || []).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-3 font-medium flex items-center space-x-1.5 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-rose-500 text-rose-600 bg-white font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Banco & Notas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`px-4 py-3 font-medium flex items-center space-x-1.5 whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'typography'
                ? 'border-rose-500 text-rose-600 bg-white font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Tipografía & Logo</span>
          </button>
        </div>
      )}

      {/* ================= TAB CONTENTS ================= */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

        {/* ----------------- MASTER CLASS TAB 1: PROPOSAL & PACKAGES ----------------- */}
        {isMasterClass && mcTab === 'proposal' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-1">
                Datos del Cliente / Institución
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Personaliza la propuesta comercial para la academia, estudio o grupo de participantes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cliente / Academia / Estudio
                  </label>
                  <input
                    type="text"
                    value={masterClassDoc.clientName || ''}
                    onChange={(e) => updateCurrentDoc('clientName', e.target.value)}
                    placeholder="Ej: BEIA Academy / Estudio Privado"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 outline-none"
                  />
                  {clients.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          updateCurrentDoc('clientName', e.target.value);
                          e.target.value = '';
                        }
                      }}
                      defaultValue=""
                      className="mt-1.5 w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-600 focus:ring-2 focus:ring-amber-400 outline-none"
                    >
                      <option value="" disabled>-- Autocompletar desde Directorio de Clientes --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.company || c.name}>
                          {c.name} {c.company ? `(${c.company})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Moneda
                  </label>
                  <select
                    value={masterClassDoc.currency || 'USD'}
                    onChange={(e) => updateCurrentDoc('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-400 outline-none bg-white"
                  >
                    <option value="USD">Dólares (USD $)</option>
                    <option value="RD$">Pesos Dominicanos (RD$)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Locations / Packages List */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Sedes o Opciones de Master Class ({masterClassDoc.locations?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="px-2.5 py-1 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Sede / Paquete</span>
                </button>
              </div>

              <div className="space-y-4">
                {(masterClassDoc.locations || []).map((loc, locIdx) => (
                  <div
                    key={loc.id || locIdx}
                    className="p-3.5 bg-stone-50 rounded-xl border border-stone-300 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-500" />
                        <span>Opción {locIdx + 1}:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(locIdx)}
                        className="text-stone-400 hover:text-red-500 transition-colors p-1"
                        title="Eliminar sede"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                          Nombre de Sede / Ciudad
                        </label>
                        <input
                          type="text"
                          value={loc.name}
                          onChange={(e) => handleUpdateLocation(locIdx, 'name', e.target.value)}
                          placeholder="Ej: BEIA Santo Domingo"
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs font-semibold focus:ring-1 focus:ring-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                          Costo por Participante
                        </label>
                        <input
                          type="number"
                          value={loc.costPerPerson}
                          onChange={(e) => handleUpdateLocation(locIdx, 'costPerPerson', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs font-mono font-semibold focus:ring-1 focus:ring-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                          Mínimo de Personas
                        </label>
                        <input
                          type="number"
                          value={loc.minParticipants}
                          onChange={(e) => handleUpdateLocation(locIdx, 'minParticipants', parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs font-mono focus:ring-1 focus:ring-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    {/* Includes List */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-stone-700 uppercase">
                          Lo que incluye esta opción:
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddIncludePoint(locIdx)}
                          className="text-[11px] text-amber-700 hover:underline font-semibold"
                        >
                          + Agregar beneficio
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {loc.includes?.map((inc, incIdx) => (
                          <div key={incIdx} className="flex items-center space-x-1.5">
                            <span className="text-stone-400 text-xs">•</span>
                            <input
                              type="text"
                              value={inc}
                              onChange={(e) => handleUpdateIncludePoint(locIdx, incIdx, e.target.value)}
                              className="flex-1 px-2 py-1 bg-white border border-stone-300 rounded text-xs focus:ring-1 focus:ring-amber-400 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveIncludePoint(locIdx, incIdx)}
                              className="text-stone-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specific Note */}
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Nota Específica:
                      </label>
                      <input
                        type="text"
                        value={loc.note || ''}
                        onChange={(e) => handleUpdateLocation(locIdx, 'note', e.target.value)}
                        placeholder="Ej: Cada participante debe llevar su modelo para practicar."
                        className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-md text-xs italic focus:ring-1 focus:ring-amber-400 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Note */}
            <div className="pt-4 border-t border-stone-200">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Condiciones Generales & Reserva de Fecha:
              </label>
              <textarea
                rows={3}
                value={masterClassDoc.customNote || ''}
                onChange={(e) => updateCurrentDoc('customNote', e.target.value)}
                placeholder="Condiciones de pago, cancelación, etc."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* ----------------- MASTER CLASS TAB 2: SYLLABUS / PROGRAMA EDITABLE ----------------- */}
        {isMasterClass && mcTab === 'syllabus' && (
          <div className="space-y-5">
            {/* Font theme selector for Master Class */}
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Tipografía de la Propuesta Comercial:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => updateCurrentDoc('fontTheme', theme.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      currentFontTheme === theme.id
                        ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-1 ring-amber-300'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900">{theme.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                        {theme.badge}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-stone-700 truncate" style={{ fontFamily: theme.fontFamily }}>
                      Eliotte MUA Masterclass
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Syllabus Quote */}
            <div className="pt-4 border-t border-stone-200">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Declaración / Introducción de la Master Class:
              </label>
              <textarea
                rows={3}
                value={masterClassDoc.syllabusQuote || ''}
                onChange={(e) => updateCurrentDoc('syllabusQuote', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>

            {/* Modules List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Módulos de Formación ({masterClassDoc.modules?.length || 0})
                </h4>
                <button
                  type="button"
                  onClick={() => setMasterClassDoc(prev => ({ ...prev, modules: DEFAULT_MASTER_CLASS.modules }))}
                  className="text-xs text-amber-700 hover:underline"
                >
                  Restablecer Módulos Oficiales
                </button>
              </div>

              {(masterClassDoc.modules || []).map((mod, modIdx) => (
                <div
                  key={modIdx}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded bg-stone-900 text-white font-mono text-xs flex items-center justify-center font-bold">
                      {mod.number || modIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => handleUpdateModule(modIdx, 'title', e.target.value)}
                      className="flex-1 px-2 py-1 bg-white border border-stone-300 rounded text-xs font-bold text-stone-900 outline-none"
                    />
                  </div>

                  <div className="pl-4 space-y-1">
                    {mod.topics?.map((top, topIdx) => (
                      <div key={topIdx} className="flex items-center space-x-1.5">
                        <span className="text-stone-400 text-xs">•</span>
                        <input
                          type="text"
                          value={top}
                          onChange={(e) => handleUpdateTopic(modIdx, topIdx, e.target.value)}
                          className="flex-1 px-2 py-0.5 bg-white border border-stone-300 rounded text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(modIdx, topIdx)}
                          className="text-stone-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddTopic(modIdx)}
                      className="text-[10px] text-amber-700 hover:underline font-semibold block mt-1"
                    >
                      + Agregar tema
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- COTIZACIÓN TAB 1: TEMPLATE & CLEAN PHOTOS ----------------- */}
        {isQuote && activeTab === 'template' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center space-x-2">
                <span>1. Elige el tipo de Cotización:</span>
              </h3>
              <p className="text-xs text-stone-500 mb-3">
                Imágenes limpias oficiales de la carpeta <code>Eliotte MUA Cotizaciones</code> (sin texto ni marcas previas):
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {QUOTE_TEMPLATES.map((tmpl) => {
                  const isSelected = quoteDoc.templateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`text-left p-3 rounded-xl border-2 transition-all flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-200'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs sm:text-sm text-stone-900">
                          {tmpl.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                      </div>

                      <div className="w-full h-28 rounded-lg overflow-hidden bg-stone-100 relative mb-2">
                        <img
                          src={tmpl.defaultBg}
                          alt={tmpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                          <span className="text-[10px] text-white font-medium uppercase tracking-wider">
                            {tmpl.currency}
                          </span>
                        </div>
                      </div>

                      <span className="text-[11px] text-stone-500 line-clamp-1">
                        {tmpl.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background Gallery Selector: Clean Photos strictly from Eliotte MUA Cotizaciones */}
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
                Fotografías Limpias Oficiales (Eliotte MUA Cotizaciones):
              </h4>
              <p className="text-xs text-stone-500 mb-3">
                Selecciona la fotografía oficial limpia o sube una imagen personalizada:
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {ALL_BACKGROUNDS.map((bg) => {
                  const isCurrent = quoteDoc.bgImage === bg.url && !quoteDoc.customBgUrl;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => {
                        updateCurrentDoc('bgImage', bg.url);
                        updateCurrentDoc('customBgUrl', '');
                      }}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${
                        isCurrent
                          ? 'border-rose-500 ring-2 ring-rose-300 scale-95 shadow-md'
                          : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] text-white p-1 text-center font-semibold truncate">
                        {bg.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Upload Custom Photo */}
              <div className="mt-3">
                <label className="flex items-center justify-center p-3 border-2 border-dashed border-stone-300 rounded-xl hover:border-rose-400 bg-stone-50 hover:bg-rose-50/30 cursor-pointer transition-colors text-xs text-stone-600 space-x-2">
                  <Upload className="w-4 h-4 text-stone-500" />
                  <span>Subir otra fotografía desde tu dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </label>
                {quoteDoc.customBgUrl && (
                  <div className="mt-2 flex items-center justify-between text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                    <span>✓ Fotografía personalizada cargada con éxito</span>
                    <button
                      type="button"
                      onClick={() => updateCurrentDoc('customBgUrl', '')}
                      className="text-stone-500 hover:text-red-500 underline"
                    >
                      Restablecer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Document Header Text Customization */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Título de Cabecera
                  </label>
                  <input
                    type="text"
                    value={quoteDoc.title || ''}
                    onChange={(e) => updateCurrentDoc('title', e.target.value)}
                    placeholder="Ej: Wedding / Cotización"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Subtítulo Central (opcional)
                  </label>
                  <input
                    type="text"
                    value={quoteDoc.sectionSubtitle || ''}
                    onChange={(e) => updateCurrentDoc('sectionSubtitle', e.target.value)}
                    placeholder="Ej: Price List Santiago"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Color del Título
                  </label>
                  <select
                    value={quoteDoc.headerTitleColor || '#1a1a1a'}
                    onChange={(e) => updateCurrentDoc('headerTitleColor', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none bg-white font-medium"
                  >
                    <option value="#1a1a1a">Negro Elegante (Canva Original)</option>
                    <option value="#ffffff">Blanco Puro</option>
                    <option value="#374151">Gris Oscuro Carbón</option>
                    <option value="#d4af37">Dorado Champán</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- CLIENT & DATES (Quote & Invoice) ----------------- */}
        {!isMasterClass && activeTab === 'client' && (
          <div className="space-y-4">
            {/* Consecutive Document Number Card */}
            <div className="bg-gradient-to-r from-stone-50 to-stone-100 p-3 sm:p-4 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    {isQuote ? 'N° de Cotización Consecutiva:' : 'N° de Factura Consecutiva:'}
                  </span>
                </label>
                <div className="flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={isQuote ? onNextQuoteNumber : onNextInvoiceNumber}
                    className="px-2.5 py-1 bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-md text-[11px] font-semibold flex items-center space-x-1 shadow-2xs transition-all"
                    title="Avanzar y generar el siguiente número consecutivo libre"
                  >
                    <Plus className="w-3 h-3 text-rose-600" />
                    <span>+ Siguiente N°</span>
                  </button>
                  <button
                    type="button"
                    onClick={isQuote ? onNewQuote : onNewInvoice}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-md text-[11px] font-semibold flex items-center space-x-1 shadow-2xs transition-all"
                    title="Comenzar un nuevo documento con nuevo número correlativo"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>+ Nuevo Doc</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={isQuote ? (quoteDoc.quoteNumber || 'COT-2026-001') : (invoiceDoc.invoiceNumber || 'FAC-2026-001')}
                  onChange={(e) => updateCurrentDoc(isQuote ? 'quoteNumber' : 'invoiceNumber', e.target.value.toUpperCase())}
                  placeholder={isQuote ? "COT-2026-001" : "FAC-2026-001"}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold tracking-wider text-stone-900 focus:ring-2 focus:ring-rose-400 outline-none uppercase"
                />
              </div>

              {/* Duplicate Warning */}
              {((isQuote && isNumberDuplicated('quote', quoteDoc.quoteNumber, history)) ||
                (isInvoice && isNumberDuplicated('invoice', invoiceDoc.invoiceNumber, history))) && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded-lg flex items-center space-x-2 text-xs text-amber-800 font-medium animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    ⚠️ Este número ya existe en el historial. Haz clic en <strong>"+ Siguiente N°"</strong> para no duplicar.
                  </span>
                </div>
              )}
            </div>

            {/* Quick Client Selection Banner */}
            <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-rose-950 uppercase tracking-wider flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-rose-600" />
                  <span>Directorio de Clientes:</span>
                </label>
                {onOpenClientsModal && (
                  <button
                    type="button"
                    onClick={onOpenClientsModal}
                    className="text-[11px] text-rose-700 hover:text-rose-900 font-bold underline underline-offset-2 flex items-center space-x-1 transition-colors"
                  >
                    <span>Abrir Directorio ({clients.length})</span>
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <select
                  onChange={(e) => {
                    handleApplySelectedClient(e.target.value);
                    e.target.value = '';
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs text-stone-900 font-semibold focus:ring-2 focus:ring-rose-400 outline-none shadow-2xs"
                >
                  <option value="" disabled>
                    ⚡ Selecciona un cliente para autocompletar ({clients.length} disponibles)...
                  </option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `— ${c.company}` : ''} {c.rnc ? `(RNC: ${c.rnc})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              Datos del Cliente y Facturación
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  <span>Nombre del Cliente</span>
                </label>
                <input
                  type="text"
                  value={(isQuote ? quoteDoc : invoiceDoc).clientName || ''}
                  onChange={(e) => updateCurrentDoc('clientName', e.target.value)}
                  placeholder="Ej: Eugenia Pérez / Carlos"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  value={(isQuote ? quoteDoc : invoiceDoc).clientEmail || ''}
                  onChange={(e) => updateCurrentDoc('clientEmail', e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>Teléfono / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={(isQuote ? quoteDoc : invoiceDoc).clientPhone || ''}
                  onChange={(e) => updateCurrentDoc('clientPhone', e.target.value)}
                  placeholder="Ej: (809) 555-1234"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-stone-400" />
                  <span>Empresa (Opcional)</span>
                </label>
                <input
                  type="text"
                  value={(isQuote ? quoteDoc : invoiceDoc).company || ''}
                  onChange={(e) => updateCurrentDoc('company', e.target.value)}
                  placeholder="Ej: Persio Abreu SRL / Producciones"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  RNC / Cédula (Opcional)
                </label>
                <input
                  type="text"
                  value={(isQuote ? quoteDoc : invoiceDoc).rnc || ''}
                  onChange={(e) => updateCurrentDoc('rnc', e.target.value)}
                  placeholder="Ej: 102-32053-5"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>

              {isQuote ? (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Fecha del Evento</span>
                  </label>
                  <input
                    type="text"
                    value={quoteDoc.eventDate || ''}
                    onChange={(e) => updateCurrentDoc('eventDate', e.target.value)}
                    placeholder="Ej: 25 de octubre 2026"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                      <Receipt className="w-3.5 h-3.5 text-stone-400" />
                      <span>Número de Factura</span>
                    </label>
                    <input
                      type="text"
                      value={invoiceDoc.invoiceNumber || ''}
                      onChange={(e) => updateCurrentDoc('invoiceNumber', e.target.value)}
                      placeholder="FAC-2026-001"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>Fecha de Emisión</span>
                    </label>
                    <input
                      type="text"
                      value={invoiceDoc.invoiceDate || ''}
                      onChange={(e) => updateCurrentDoc('invoiceDate', e.target.value)}
                      placeholder="31 de julio del 2026"
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                    />
                  </div>
                </>
              )}
            </div>

            {!isQuote && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Descripción General del Proyecto
                </label>
                <textarea
                  rows={2}
                  value={invoiceDoc.projectDescription || ''}
                  onChange={(e) => updateCurrentDoc('projectDescription', e.target.value)}
                  placeholder="Ej: Maquillaje y estilismo para campaña comercial otoño-invierno 2026"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-400 outline-none"
                />
              </div>
            )}

            {/* Quick Save Client to Directory */}
            <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900 flex items-center space-x-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-rose-600" />
                  <span>¿Cliente nuevo o datos modificados?</span>
                </span>
                <p className="text-[11px] text-stone-500">
                  Guárdalo en tu directorio con un solo clic para usarlo en el futuro.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickSaveCurrentClient}
                className="w-full sm:w-auto px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs transition-all active:scale-[0.98] shrink-0"
                title="Guardar este cliente en el directorio"
              >
                <UserPlus className="w-3.5 h-3.5 text-rose-400" />
                <span>Guardar en Directorio</span>
              </button>
            </div>

            {/* Currency selector */}
            <div className="pt-3 border-t border-stone-200 flex items-center space-x-4">
              <span className="text-xs font-semibold text-stone-700">Moneda del Documento:</span>
              <div className="inline-flex rounded-lg border border-stone-300 p-0.5 bg-stone-100">
                <button
                  type="button"
                  onClick={() => updateCurrentDoc('currency', 'US$')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    (isQuote ? quoteDoc : invoiceDoc).currency === 'US$'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Dólares (US$)
                </button>
                <button
                  type="button"
                  onClick={() => updateCurrentDoc('currency', 'RD$')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    (isQuote ? quoteDoc : invoiceDoc).currency === 'RD$'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Pesos Dom. (RD$)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- ITEMS / SERVICES (Quote & Invoice) ----------------- */}
        {!isMasterClass && activeTab === 'items' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                  Servicios y Precios
                </h3>
                <p className="text-xs text-stone-500">
                  Agrega, edita descripciones completas o aplica descuentos.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition-colors flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar Servicio</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddDiscountItem}
                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center space-x-1"
                  title="Agregar una línea de descuento promocional o cliente frecuente"
                >
                  <Percent className="w-3.5 h-3.5 text-emerald-600" />
                  <span>- Descuento</span>
                </button>
              </div>
            </div>

            {/* Quick Catalog Chips */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
              <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-2">
                ⚡ Agregar rápidamente del catálogo Eliotte MUA:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1">
                {QUICK_SERVICES_CATALOG.map((srv, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddCatalogItem(srv)}
                    className="text-[11px] px-2.5 py-1 bg-white hover:bg-rose-50 hover:border-rose-300 border border-stone-300 rounded-md text-stone-700 hover:text-rose-700 transition-colors flex items-center space-x-1"
                  >
                    <span>+ {srv.name}</span>
                    <span className="text-stone-400 font-mono">
                      ({(isQuote ? quoteDoc : invoiceDoc).currency === 'US$' ? `$${srv.priceUS}` : `RD$${srv.priceRD}`})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Item Cards - 2 Rows for MAXIMUM comfort and ZERO truncation */}
            <div className="space-y-3">
              {((isQuote ? quoteDoc : invoiceDoc).items || []).map((item, index) => {
                const itemTotal = (Number(item.qty) || 1) * (Number(item.price) || 0);
                const isUSD = (isQuote ? quoteDoc : invoiceDoc).currency === 'US$';
                const formattedSubtotal = isUSD 
                  ? `${itemTotal < 0 ? '-' : ''}$${Math.abs(itemTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })} us`
                  : `${itemTotal < 0 ? '-' : ''}RD$ ${Math.abs(itemTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

                return (
                  <div
                    key={item.id || index}
                    className="p-3.5 bg-stone-50/80 rounded-xl border border-stone-200 hover:border-stone-300 transition-all space-y-2.5 shadow-2xs"
                  >
                    {/* Row 1: Full-width Description Input/Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-1">
                          <span className="w-4 h-4 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center text-[10px] font-mono">
                            {index + 1}
                          </span>
                          <span>Descripción del Servicio:</span>
                        </label>
                        {item.optional && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                            Opcional
                          </span>
                        )}
                        {item.price < 0 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                            Línea de Descuento
                          </span>
                        )}
                      </div>
                      <textarea
                        rows={item.description && item.description.includes('\n') ? 2 : 1}
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        placeholder="Descripción completa del servicio (ej. Servicio de maquillaje full day para fotos...)"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-medium text-stone-900 focus:ring-2 focus:ring-rose-400 outline-none resize-none leading-relaxed"
                      />
                    </div>

                    {/* Row 2: Controls neatly aligned with clear labels */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center pt-1 border-t border-stone-200/60">
                      {/* Cantidad */}
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.qty || 1}
                          onChange={(e) => handleUpdateItem(index, 'qty', parseInt(e.target.value) || 1)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono text-center font-bold text-stone-800 focus:ring-1 focus:ring-rose-400 outline-none"
                        />
                      </div>

                      {/* Precio Unitario */}
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                          Precio Unit. ({isUSD ? 'US$' : 'RD$'})
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono font-bold text-right text-stone-900 focus:ring-1 focus:ring-rose-400 outline-none"
                        />
                      </div>

                      {/* Detalle / Nota */}
                      <div>
                        <label className="block text-[10px] font-semibold text-stone-500 mb-0.5">
                          Nota / Detalle
                        </label>
                        <input
                          type="text"
                          value={item.note || ''}
                          onChange={(e) => handleUpdateItem(index, 'note', e.target.value)}
                          placeholder="ej: 4 damas"
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs italic text-stone-700 focus:ring-1 focus:ring-rose-400 outline-none"
                        />
                      </div>

                      {/* Subtotal & Actions */}
                      <div className="flex items-center justify-between sm:justify-end space-x-2 pt-3 sm:pt-0">
                        <div className="text-right">
                          <span className="block text-[10px] text-stone-400 font-medium">Subtotal</span>
                          <span className={`text-xs font-bold font-mono ${itemTotal < 0 ? 'text-emerald-700' : 'text-stone-900'}`}>
                            {formattedSubtotal}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 pl-1 border-l border-stone-200">
                          {isQuote && (
                            <label className="p-1.5 hover:bg-stone-200/60 rounded-md cursor-pointer flex items-center" title="Marcar como opcional">
                              <input
                                type="checkbox"
                                checked={!!item.optional}
                                onChange={(e) => handleUpdateItem(index, 'optional', e.target.checked)}
                                className="rounded text-rose-500 focus:ring-rose-400"
                              />
                              <span className="text-[10px] font-semibold text-stone-600 ml-1 sm:hidden">Opc.</span>
                            </label>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Eliminar este servicio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculation Summary Card */}
            {((isQuote ? quoteDoc : invoiceDoc).items || []).length > 0 && (
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-stone-600 font-medium">
                  Resumen de la Cotización / Factura:
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-stone-500">
                    Total Servicios: <strong>{((isQuote ? quoteDoc : invoiceDoc).items || []).length}</strong>
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    Total: {((isQuote ? quoteDoc : invoiceDoc).currency === 'US$' ? '$' : 'RD$ ')}
                    {Math.abs(
                      ((isQuote ? quoteDoc : invoiceDoc).items || []).reduce((sum, item) => sum + ((Number(item.qty) || 1) * (Number(item.price) || 0)), 0)
                    ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            {/* Discount for Invoice */}
            {!isQuote && (
              <div className="pt-3 border-t border-stone-200 flex justify-end items-center space-x-3">
                <span className="text-xs font-semibold text-stone-700">Descuento Global Adicional:</span>
                <input
                  type="number"
                  value={invoiceDoc.discount || 0}
                  onChange={(e) => updateCurrentDoc('discount', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-32 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono text-right focus:ring-1 focus:ring-rose-400 outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* ----------------- NOTES & BANK DETAILS (Quote & Invoice) ----------------- */}
        {!isMasterClass && activeTab === 'notes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              Condiciones de Pago & Datos Bancarios
            </h3>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">🏦 Cuenta Oficial Eliotte MUA pre-configurada:</p>
              <p>• {BUSINESS_INFO.bank}</p>
              <p>• {BUSINESS_INFO.accountType}: <strong>{BUSINESS_INFO.accountNumber}</strong></p>
              <p>• Cédula: <strong>{BUSINESS_INFO.idCard}</strong> | Titular: <strong>{BUSINESS_INFO.name}</strong></p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Texto de la NOTA en el documento
              </label>
              <textarea
                rows={4}
                value={(isQuote ? quoteDoc : invoiceDoc).notes || ''}
                onChange={(e) => updateCurrentDoc('notes', e.target.value)}
                placeholder="Escribe las condiciones de pago, separación de fecha, etc."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>
          </div>
        )}

        {/* ----------------- TYPOGRAPHY & LOGO (Unified Formats for All Sections) ----------------- */}
        {!isMasterClass && activeTab === 'typography' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Type className="w-4 h-4 text-rose-500" />
                  <span>Formatos de Texto / Tipografía Unificada:</span>
                </h3>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                La tipografía que elijas se aplicará de forma <strong>armoniosa y homogénea en toda la plantilla</strong> (encabezado, servicios, precios, totales, notas y cliente) adaptando el tamaño a cada sección.
              </p>

              {/* Font Theme Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FONT_THEMES.map((theme) => {
                  const isSelected = currentFontTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => updateCurrentDoc('fontTheme', theme.id)}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-200'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-stone-900 flex items-center space-x-1.5">
                          <span>{theme.name}</span>
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                          {theme.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mb-1.5">{theme.subtitle}</p>
                      
                      {/* Live typography preview specimen */}
                      <div className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900">
                        <p className="text-base font-semibold leading-tight" style={{ fontFamily: theme.fontFamily }}>
                          Eliotte MUA • Cotización
                        </p>
                        <p className="text-xs text-stone-600 mt-0.5" style={{ fontFamily: theme.fontFamily }}>
                          Servicio de maquillaje para novia (Airbrush) $200.00 us
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Variant Selector according to background contrast */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  Logo Eliotte MUA según Fondo y Contraste:
                </label>
                <span className="text-[11px] text-stone-500 font-medium">
                  {(isQuote ? quoteDoc : invoiceDoc).logoVariant === 'white' ? '⚪ Blanco' : ((isQuote ? quoteDoc : invoiceDoc).logoVariant === 'black' ? '⚫ Negro' : '🔘 Gris Plata')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-2.5">
                Selecciona la versión del logo con el mejor contraste para tu diseño:
              </p>

              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. White logo */}
                <button
                  type="button"
                  onClick={() => updateCurrentDoc('logoVariant', 'white')}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-between transition-all ${
                    (isQuote ? quoteDoc : invoiceDoc).logoVariant === 'white'
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="w-full h-12 bg-stone-900 rounded-lg flex items-center justify-center p-1.5 mb-1.5 shadow-inner">
                    <img
                      src="./assets/logos/logo-white-trans.png"
                      alt="Logo Blanco"
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Blanco Puro</span>
                  <span className="text-[9px] text-stone-500 text-center leading-tight">Fondo oscuro</span>
                </button>

                {/* 2. Black logo */}
                <button
                  type="button"
                  onClick={() => updateCurrentDoc('logoVariant', 'black')}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-between transition-all ${
                    (isQuote ? quoteDoc : invoiceDoc).logoVariant === 'black'
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="w-full h-12 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-center p-1.5 mb-1.5 shadow-inner">
                    <img
                      src="./assets/logos/logo-black-trans.png"
                      alt="Logo Negro"
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Negro Profundo</span>
                  <span className="text-[9px] text-stone-500 text-center leading-tight">Fondo claro</span>
                </button>

                {/* 3. Grey logo */}
                <button
                  type="button"
                  onClick={() => updateCurrentDoc('logoVariant', 'grey')}
                  className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-between transition-all ${
                    (isQuote ? quoteDoc : invoiceDoc).logoVariant === 'grey'
                      ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-200'
                      : 'border-stone-200 hover:border-stone-400 bg-white'
                  }`}
                >
                  <div className="w-full h-12 bg-stone-400 rounded-lg flex items-center justify-center p-1.5 mb-1.5 shadow-inner">
                    <img
                      src="./assets/logos/logo-grey-trans.png"
                      alt="Logo Gris"
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-stone-800">Gris / Plata</span>
                  <span className="text-[9px] text-stone-500 text-center leading-tight">Contraste suave</span>
                </button>
              </div>
            </div>

            {/* Opacity slider for quote */}
            {isQuote && (
              <div className="pt-3 border-t border-stone-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Nitidez de la Foto de Fondo:
                  </label>
                  <span className="text-xs font-mono text-stone-500">
                    {Math.round((quoteDoc.bgOpacity || 0.88) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quoteDoc.bgOpacity || 0.88}
                  onChange={(e) => updateCurrentDoc('bgOpacity', parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            )}

            {/* QR Code toggle */}
            {isQuote && (
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-stone-800">Mostrar Código QR en el pie de página</p>
                  <p className="text-[11px] text-stone-500">Código QR escaneable oficial de Eliotte</p>
                </div>
                <input
                  type="checkbox"
                  checked={quoteDoc.showQr !== false}
                  onChange={(e) => updateCurrentDoc('showQr', e.target.checked)}
                  className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400"
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
