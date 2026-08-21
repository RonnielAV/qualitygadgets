'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Check,
  Building2,
  Phone,
  Mail,
  MapPin,
  Link as LinkIcon,
  CreditCard,
  Truck,
  ShieldCheck,
  Save,
  Sparkles,
  Layers,
  X
} from 'lucide-react';
import { useStore, FooterConfig, FooterLink } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function FooterSettingsView() {
  const { footerConfig, updateFooterConfig } = useStore();

  // Basic Info State
  const [companyName, setCompanyName] = useState(footerConfig?.companyName || 'QUALITY GADGETS RD');
  const [slogan, setSlogan] = useState(footerConfig?.slogan || 'El futuro en tus manos: Tecnología premium al alcance de un clic en RD.');
  const [address, setAddress] = useState(footerConfig?.address || 'Piantini, Santo Domingo, D.N.');
  const [phone, setPhone] = useState(footerConfig?.phone || '+1 (809) 316-0799');
  const [email, setEmail] = useState(footerConfig?.email || 'contacto@qualitygadgetsrd.com');
  const [complianceText, setComplianceText] = useState(
    footerConfig?.complianceText || 'Cumplimiento PCI-DSS Nivel 1. Aceptamos tarjetas dominicanas e internacionales, Apple Pay, transferencias bancarias locales y pago contra entrega.'
  );

  // Link Builders State
  const [categoryLinks, setCategoryLinks] = useState<FooterLink[]>(
    footerConfig?.categoryLinks || [
      { id: 'fl-1', label: 'Smartphones & Pro 5G', url: '/productos?categoria=smartphones' },
      { id: 'fl-2', label: 'Audio Hi-Fi & Noise Cancelling', url: '/productos?categoria=audio-pro' },
      { id: 'fl-3', label: 'Wearables & Smartwatches', url: '/productos?categoria=wearables' },
      { id: 'fl-4', label: 'Drones & Cámaras 4K', url: '/productos?categoria=drones' },
      { id: 'fl-5', label: 'Smarthome & Domótica', url: '/productos?categoria=smarthome' },
    ]
  );

  const [customerServiceLinks, setCustomerServiceLinks] = useState<FooterLink[]>(
    footerConfig?.customerServiceLinks || [
      { id: 'fc-1', label: 'Seguimiento de Envíos', url: '/checkout' },
      { id: 'fc-2', label: 'Garantías y Políticas RMA (1 Año)', url: '/productos' },
      { id: 'fc-3', label: 'Facturación Fiscal con NCF', url: '/checkout' },
      { id: 'fc-4', label: 'Términos, Privacidad & Garantía', url: '/productos' },
    ]
  );

  // Badges State
  const [paymentMethods, setPaymentMethods] = useState<string[]>(
    footerConfig?.paymentMethods || ['Cardnet', 'Azul', 'Stripe', 'Apple Pay', 'BHD', 'BanReservas', 'Banco Popular']
  );
  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  const [logisticsCouriers, setLogisticsCouriers] = useState<string[]>(
    footerConfig?.logisticsCouriers || ['Metro Pac', 'BM Cargo', 'Caribe Pack', 'Vimenpaq', 'Delivery Express SD']
  );
  const [newCourier, setNewCourier] = useState('');

  // UI Toast State
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // LINK HANDLERS
  const handleAddCategoryLink = () => {
    setCategoryLinks([
      ...categoryLinks,
      { id: `cat-link-${Date.now()}`, label: 'Nueva Categoría', url: '/productos' },
    ]);
  };

  const handleUpdateCategoryLink = (id: string, field: 'label' | 'url', val: string) => {
    setCategoryLinks(categoryLinks.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const handleDeleteCategoryLink = (id: string) => {
    setCategoryLinks(categoryLinks.filter((l) => l.id !== id));
  };

  const handleAddCustomerLink = () => {
    setCustomerServiceLinks([
      ...customerServiceLinks,
      { id: `cs-link-${Date.now()}`, label: 'Nuevo Enlace Soporte', url: '/productos' },
    ]);
  };

  const handleUpdateCustomerLink = (id: string, field: 'label' | 'url', val: string) => {
    setCustomerServiceLinks(customerServiceLinks.map((l) => (l.id === id ? { ...l, [field]: val } : l)));
  };

  const handleDeleteCustomerLink = (id: string) => {
    setCustomerServiceLinks(customerServiceLinks.filter((l) => l.id !== id));
  };

  // BADGE HANDLERS
  const handleAddPayment = () => {
    if (newPaymentMethod.trim() && !paymentMethods.includes(newPaymentMethod.trim())) {
      setPaymentMethods([...paymentMethods, newPaymentMethod.trim()]);
      setNewPaymentMethod('');
    }
  };

  const handleDeletePayment = (method: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m !== method));
  };

  const handleAddCourier = () => {
    if (newCourier.trim() && !logisticsCouriers.includes(newCourier.trim())) {
      setLogisticsCouriers([...logisticsCouriers, newCourier.trim()]);
      setNewCourier('');
    }
  };

  const handleDeleteCourier = (courier: string) => {
    setLogisticsCouriers(logisticsCouriers.filter((c) => c !== courier));
  };

  // SAVE ALL CHANGES
  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateFooterConfig({
      companyName,
      slogan,
      address,
      phone,
      email,
      complianceText,
      categoryLinks,
      customerServiceLinks,
      paymentMethods,
      logisticsCouriers,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  return (
    <form onSubmit={handleSaveFooter} className="space-y-8 text-xs text-text-pure">
      {/* Toast de Éxito */}
      {showSuccessToast && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-400 flex items-center justify-between shadow-glow-cyan animate-pulse">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span>¡Configuración del Footer CMS guardada con éxito en el store global!</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">Persistencia activa</span>
        </div>
      )}

      {/* 1. INFORMACIÓN CORPORATIVA & CONTACTO */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-5">
        <div className="border-b border-dark-border/80 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-cyan" />
            <span>1. Información Corporativa & Datos de Contacto</span>
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Modifica la identidad que se muestra en el pie de página de toda la tienda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Nombre de la Empresa</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-black text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Teléfono / WhatsApp de Contacto</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Correo Electrónico Oficial</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Dirección Física (República Dominicana)</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-text-muted">Eslogan de Marca</label>
          <input
            type="text"
            required
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
          />
        </div>
      </div>

      {/* 2. CONSTRUCTORES DE ENLACES (CATEGORÍAS Y SERVICIO AL CLIENTE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Columna Enlaces de Categorías */}
        <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border/80 pb-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-brand-cyan" />
              <span>Enlaces de Categorías ({categoryLinks.length})</span>
            </h4>
            <button
              type="button"
              onClick={handleAddCategoryLink}
              className="flex items-center gap-1 rounded-xl bg-dark-obsidian border border-dark-border px-3 py-1.5 text-xs font-bold text-brand-cyan hover:border-brand-cyan cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir Enlace</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {categoryLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2 p-2.5 rounded-2xl bg-dark-obsidian border border-dark-border">
                <input
                  type="text"
                  placeholder="Etiqueta"
                  value={link.label}
                  onChange={(e) => handleUpdateCategoryLink(link.id, 'label', e.target.value)}
                  className="w-1/2 rounded-xl border border-dark-border bg-dark-surface p-2 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="/url"
                  value={link.url}
                  onChange={(e) => handleUpdateCategoryLink(link.id, 'url', e.target.value)}
                  className="w-1/2 rounded-xl border border-dark-border bg-dark-surface p-2 text-xs font-mono text-brand-cyan focus:border-brand-cyan focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCategoryLink(link.id)}
                  className="p-2 text-brand-magenta hover:bg-brand-magenta/20 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Columna Enlaces de Servicio al Cliente */}
        <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border/80 pb-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-ultraviolet" />
              <span>Enlaces de Servicio al Cliente ({customerServiceLinks.length})</span>
            </h4>
            <button
              type="button"
              onClick={handleAddCustomerLink}
              className="flex items-center gap-1 rounded-xl bg-dark-obsidian border border-dark-border px-3 py-1.5 text-xs font-bold text-brand-cyan hover:border-brand-cyan cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Añadir Enlace</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {customerServiceLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-2 p-2.5 rounded-2xl bg-dark-obsidian border border-dark-border">
                <input
                  type="text"
                  placeholder="Etiqueta"
                  value={link.label}
                  onChange={(e) => handleUpdateCustomerLink(link.id, 'label', e.target.value)}
                  className="w-1/2 rounded-xl border border-dark-border bg-dark-surface p-2 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="/url"
                  value={link.url}
                  onChange={(e) => handleUpdateCustomerLink(link.id, 'url', e.target.value)}
                  className="w-1/2 rounded-xl border border-dark-border bg-dark-surface p-2 text-xs font-mono text-brand-cyan focus:border-brand-cyan focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCustomerLink(link.id)}
                  className="p-2 text-brand-magenta hover:bg-brand-magenta/20 rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. CUMPLIMIENTO, PASARELAS Y COURIERS LOGÍSTICOS */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-6">
        <div className="border-b border-dark-border/80 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-magenta" />
            <span>3. Texto de Cumplimiento, Pasarelas & Couriers Dominicanos</span>
          </h3>
        </div>

        <div className="space-y-2">
          <label className="font-bold text-text-muted">Texto Informativo de Cumplimiento PCI-DSS</label>
          <textarea
            rows={2}
            value={complianceText}
            onChange={(e) => setComplianceText(e.target.value)}
            className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
          />
        </div>

        {/* Gestor de Badges: Métodos de Pago */}
        <div className="space-y-3">
          <label className="font-bold text-text-muted block">Cápsulas de Métodos de Pago (Badges)</label>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((m) => (
              <span
                key={m}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-obsidian px-3 py-1 text-xs font-black text-white"
              >
                <span>{m}</span>
                <button
                  type="button"
                  onClick={() => handleDeletePayment(m)}
                  className="text-text-muted hover:text-brand-magenta"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-1">
            <input
              type="text"
              placeholder="Ej. Cardnet, BHD..."
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPayment();
                }
              }}
              className="flex-1 rounded-xl border border-dark-border bg-dark-obsidian p-2 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddPayment}
              className="rounded-xl bg-dark-elevated border border-dark-border px-3.5 py-2 text-xs font-bold text-brand-cyan hover:border-brand-cyan cursor-pointer"
            >
              Añadir
            </button>
          </div>
        </div>

        {/* Gestor de Badges: Couriers Logísticos */}
        <div className="space-y-3 pt-2 border-t border-dark-border/80">
          <label className="font-bold text-text-muted block">Cápsulas de Couriers Logísticos (Badges RD)</label>
          <div className="flex flex-wrap items-center gap-2">
            {logisticsCouriers.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-obsidian px-3 py-1 text-xs font-black text-brand-cyan"
              >
                <span>{c}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCourier(c)}
                  className="text-text-muted hover:text-brand-magenta"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm pt-1">
            <input
              type="text"
              placeholder="Ej. Metro Pac, Caribe Pack..."
              value={newCourier}
              onChange={(e) => setNewCourier(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCourier();
                }
              }}
              className="flex-1 rounded-xl border border-dark-border bg-dark-obsidian p-2 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddCourier}
              className="rounded-xl bg-dark-elevated border border-dark-border px-3.5 py-2 text-xs font-bold text-brand-cyan hover:border-brand-cyan cursor-pointer"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>

      {/* BOTÓN GENERAL GUARDAR CAMBIOS */}
      <div className="flex justify-end pt-4">
        <PrimaryButton type="submit" variant="primary" className="py-3.5 px-10 text-xs font-black shadow-glow-purple cursor-pointer">
          <Save className="h-4 w-4 mr-2" />
          <span>Guardar Cambios del Footer CMS</span>
        </PrimaryButton>
      </div>
    </form>
  );
}
