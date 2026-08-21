'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function StorefrontFooter() {
  const footerConfig = useStore((state) => state.footerConfig);

  const companyName = footerConfig?.companyName || 'QUALITY GADGETS RD';
  const slogan = footerConfig?.slogan || 'El futuro en tus manos: Tecnología premium al alcance de un clic en RD.';
  const address = footerConfig?.address || 'Piantini, Santo Domingo, D.N.';
  const phone = footerConfig?.phone || '+1 (809) 316-0799';
  const email = footerConfig?.email || 'contacto@qualitygadgetsrd.com';
  const complianceText =
    footerConfig?.complianceText ||
    'Cumplimiento PCI-DSS Nivel 1. Aceptamos tarjetas dominicanas e internacionales, Apple Pay, transferencias bancarias locales y pago contra entrega.';

  const categoryLinks = Array.isArray(footerConfig?.categoryLinks) && footerConfig.categoryLinks.length > 0
    ? footerConfig.categoryLinks
    : [
        { id: 'fl-1', label: 'Smartphones & Pro 5G', url: '/productos?categoria=smartphones' },
        { id: 'fl-2', label: 'Audio Hi-Fi & Noise Cancelling', url: '/productos?categoria=audio-pro' },
        { id: 'fl-3', label: 'Wearables & Smartwatches', url: '/productos?categoria=wearables' },
        { id: 'fl-4', label: 'Drones & Cámaras 4K', url: '/productos?categoria=drones' },
        { id: 'fl-5', label: 'Smarthome & Domótica', url: '/productos?categoria=smarthome' },
      ];

  const customerServiceLinks = Array.isArray(footerConfig?.customerServiceLinks) && footerConfig.customerServiceLinks.length > 0
    ? footerConfig.customerServiceLinks
    : [
        { id: 'fc-1', label: 'Seguimiento de Envíos', url: '/checkout' },
        { id: 'fc-2', label: 'Garantías y Políticas RMA (1 Año)', url: '/productos' },
        { id: 'fc-3', label: 'Facturación Fiscal con NCF', url: '/checkout' },
        { id: 'fc-4', label: 'Términos, Privacidad & Garantía', url: '/productos' },
      ];

  const paymentMethods = Array.isArray(footerConfig?.paymentMethods) && footerConfig.paymentMethods.length > 0
    ? footerConfig.paymentMethods
    : ['Cardnet', 'Azul', 'Stripe', 'Apple Pay', 'BHD', 'BanReservas', 'Banco Popular'];

  const logisticsCouriers = Array.isArray(footerConfig?.logisticsCouriers) && footerConfig.logisticsCouriers.length > 0
    ? footerConfig.logisticsCouriers
    : ['Metro Pac', 'BM Cargo', 'Caribe Pack', 'Vimenpaq', 'Delivery Express SD'];

  return (
    <footer className="border-t border-dark-border bg-dark-obsidian text-text-muted">
      {/* 4 Pilares de Confianza con Glassmorphic Styling */}
      <div className="border-b border-dark-border/80 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-3xl border border-dark-border bg-dark-surface/60 p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/10 text-brand-cyan shadow-glow-cyan">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Envíos a Toda RD</h4>
                <p className="text-xs text-text-muted">Entrega 24h Santo Domingo y 48h provincias.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-dark-border bg-dark-surface/60 p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-magenta/10 text-brand-magenta shadow-glow-magenta">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Garantía Real 1 Año</h4>
                <p className="text-xs text-text-muted">Equipos 100% originales con soporte local.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-dark-border bg-dark-surface/60 p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-ultraviolet/10 text-brand-ultraviolet shadow-glow-purple">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Pago Seguro en RD</h4>
                <p className="text-xs text-text-muted">Transferencia bancaria o pago contra entrega.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-3xl border border-dark-border bg-dark-surface/60 p-5 backdrop-blur-xl">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 shadow-sm">
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Devoluciones Fáciles</h4>
                <p className="text-xs text-text-muted">Proceso RMA rápido y transparente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enlaces y Contacto Dinámicos desde useStore */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Columna 1: Datos de Contacto */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" />
            <p className="text-xs text-text-muted leading-relaxed pt-1">
              {slogan}
            </p>
            <div className="text-xs space-y-2 pt-2">
              <div className="flex items-center gap-2 text-white">
                <MapPin className="h-4 w-4 text-brand-cyan flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Phone className="h-4 w-4 text-brand-cyan flex-shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Mail className="h-4 w-4 text-brand-cyan flex-shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces de Categorías Dinámicos */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-cyan">Categorías</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {categoryLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Enlaces de Servicio al Cliente Dinámicos */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-ultraviolet">Servicio al Cliente</h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              {customerServiceLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Cumplimiento, Pasarelas y Couriers Dinámicos */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-magenta">Pasarelas y Logística RD</h4>
            <p className="mt-4 text-xs text-text-muted leading-relaxed">
              {complianceText}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black text-white">
              {paymentMethods.map((m, idx) => (
                <span key={idx} className="rounded-xl border border-dark-border bg-dark-surface px-3 py-1.5 shadow-sm">
                  {m}
                </span>
              ))}
              {logisticsCouriers.map((c, idx) => (
                <span key={idx} className="rounded-xl border border-brand-cyan/30 bg-dark-surface text-brand-cyan px-3 py-1.5 shadow-sm">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-dark-border/80 pt-8 text-center text-xs text-text-muted">
          <p>© {new Date().getFullYear()} {companyName}. Todos los derechos reservados. Diseñado con tecnología OLED Dark de ultra alto rendimiento.</p>
        </div>
      </div>
    </footer>
  );
}

export default StorefrontFooter;
