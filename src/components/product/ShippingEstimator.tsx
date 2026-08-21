'use client';

import React, { useState } from 'react';
import { Truck, MapPin, Clock } from 'lucide-react';
import { ShippingService } from '../../../services/core-api/src/shipping/shipping.service';

const shippingService = new ShippingService();

const PROVINCIAS_OPTIONS = [
  'Distrito Nacional',
  'Santo Domingo Este',
  'Santo Domingo Oeste',
  'Santo Domingo Norte',
  'Santiago',
  'La Altagracia (Punta Cana / Bávaro / Higüey)',
  'La Romana',
  'Puerto Plata',
  'La Vega',
  'San Cristóbal',
  'San Pedro de Macorís',
  'Duarte (San Francisco de Macorís)',
];

export function ShippingEstimator() {
  const [selectedProvince, setSelectedProvince] = useState('Distrito Nacional');
  
  const estimate = shippingService.calculateShipping({
    province: selectedProvince,
    subtotalDop: 4500,
    totalWeightGrams: 500,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-cyan">
          <Truck className="h-4 w-4" />
          <span>Calculador de Envíos en RD</span>
        </div>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
          Despacho Inmediato
        </span>
      </div>

      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <select
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className="w-full appearance-none rounded-2xl border border-dark-border bg-dark-obsidian py-3 pl-10 pr-8 text-xs font-bold text-white shadow-sm focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none transition-all cursor-pointer"
        >
          {PROVINCIAS_OPTIONS.map((prov) => (
            <option key={prov} value={prov} className="bg-dark-obsidian text-white">
              {prov}
            </option>
          ))}
        </select>
      </div>

      {/* Resultado dinámico del cálculo logístico con espaciado amplio */}
      <div className="rounded-2xl border border-brand-ultraviolet/30 bg-dark-elevated/70 p-4 text-xs space-y-1.5">
        <div className="flex items-center justify-between font-black text-white">
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-cyan" />
            {estimate.serviceTitle}
          </span>
          <span className="text-brand-cyan uppercase font-black">
            {estimate.isFree ? 'Envío GRATIS' : `RD$ ${estimate.costDop}`}
          </span>
        </div>
        <p className="text-[11px] text-text-muted">
          {estimate.estimatedDeliveryText} ({estimate.carrier})
        </p>
      </div>
    </div>
  );
}
