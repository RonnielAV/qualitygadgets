'use client';

import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Check, Radio, Activity, Eye, Zap, ShieldCheck } from 'lucide-react';
import { useStore, Discount, PixelConfig } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function MarketingView() {
  const { discounts, addDiscount, updateDiscount, deleteDiscount, pixels, updatePixel } = useStore();

  // Discount Form State
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [code, setCode] = useState('');
  const [type, setType] = useState<Discount['type']>('percentage');
  const [value, setValue] = useState(10);
  const [minSpendDop, setMinSpendDop] = useState(15000);
  const [maxUses, setMaxUses] = useState(100);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');

  // Pixel Temp Input State
  const [pixelInputs, setPixelInputs] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    pixels.forEach((p) => {
      map[p.id] = p.pixelId;
    });
    return map;
  });

  const handleOpenNewDiscount = () => {
    setEditingDiscount(null);
    setCode('');
    setType('percentage');
    setValue(10);
    setMinSpendDop(15000);
    setMaxUses(100);
    setExpiresAt('2026-12-31');
    setIsDiscountModalOpen(true);
  };

  const handleOpenEditDiscount = (d: Discount) => {
    setEditingDiscount(d);
    setCode(d.code);
    setType(d.type);
    setValue(d.value);
    setMinSpendDop(d.minSpendDop);
    setMaxUses(d.maxUses || 100);
    setExpiresAt(d.expiresAt);
    setIsDiscountModalOpen(true);
  };

  const handleSaveDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    if (editingDiscount) {
      updateDiscount(editingDiscount.id, {
        code,
        type,
        value: Number(value),
        minSpendDop: Number(minSpendDop),
        maxUses: Number(maxUses),
        expiresAt,
      });
    } else {
      addDiscount({
        code,
        type,
        value: Number(value),
        minSpendDop: Number(minSpendDop),
        maxUses: Number(maxUses),
        expiresAt,
        status: 'active',
      });
    }
    setIsDiscountModalOpen(false);
  };

  const handleDeleteDiscount = (d: Discount) => {
    if (confirm(`¿Eliminar cupón ${d.code}?`)) {
      deleteDiscount(d.id);
    }
  };

  const handleSavePixel = (id: string, currentEnabled: boolean) => {
    const pId = pixelInputs[id] || '';
    updatePixel(id, pId, currentEnabled);
    alert('¡Configuración del píxel guardada en el store!');
  };

  const handleTogglePixel = (p: PixelConfig) => {
    const pId = pixelInputs[p.id] || p.pixelId;
    updatePixel(p.id, pId, !p.enabled);
  };

  return (
    <div className="space-y-8 text-xs text-text-pure">
      {/* 1. GESTOR DE CUPONES DE DESCUENTO */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dark-border/80 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Tag className="h-5 w-5 text-brand-cyan" />
              <span>Gestor de Cupones & Descuentos Activos ({discounts.length})</span>
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Crea códigos promocionales aplicables en el carrito y checkout para campañas CRO.
            </p>
          </div>

          <PrimaryButton
            variant="primary"
            onClick={handleOpenNewDiscount}
            className="py-2.5 px-5 text-xs font-black shadow-glow-purple cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Crear Nuevo Cupón</span>
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {discounts.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-dark-border bg-dark-obsidian p-5 space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-brand-cyan text-sm tracking-wider">{d.code}</span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                    {d.type === 'percentage' ? `${d.value}% OFF` : d.type === 'fixed_amount' ? `RD$ ${d.value} OFF` : 'Envío Gratis'}
                  </span>
                </div>

                <p className="text-[11px] text-text-muted">
                  Compra mínima: <strong className="text-white">RD$ {d.minSpendDop.toLocaleString('es-DO')}</strong>
                </p>
                <p className="text-[10px] text-text-muted">
                  Usos: <strong className="text-brand-magenta">{d.usedCount}</strong> / {d.maxUses || 'Ilimitado'} • Vence: {d.expiresAt}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-dark-border/60">
                <button
                  onClick={() => handleOpenEditDiscount(d)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-dark-border bg-dark-elevated py-1.5 text-xs font-bold text-white hover:border-brand-cyan"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteDiscount(d)}
                  className="rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 p-1.5 text-brand-magenta hover:bg-brand-magenta/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. GESTOR DE PÍXELES DE TRACKING & CONVERSIÓN */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-5">
        <div className="border-b border-dark-border/80 pb-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-magenta" />
            <span>Píxeles de Rastreo & Analítica Publicitaria</span>
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Conecta tus IDs de seguimiento para optimizar campañas en Meta Ads, Google Ads y TikTok Ads.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pixels.map((pix) => (
            <div key={pix.id} className="rounded-2xl border border-dark-border bg-dark-obsidian p-5 space-y-4">
              <div className="flex items-center justify-between">
                <strong className="text-xs font-black text-white">{pix.label}</strong>
                <button
                  type="button"
                  onClick={() => handleTogglePixel(pix)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black cursor-pointer ${
                    pix.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-dark-border text-text-muted'
                  }`}
                >
                  {pix.enabled ? 'ACTIVO' : 'INACTIVO'}
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-text-muted block">Measurement / Pixel ID</label>
                <input
                  type="text"
                  placeholder={pix.name === 'ga4' ? 'G-XXXXXXXXXX' : '123456789012345'}
                  value={pixelInputs[pix.id] ?? pix.pixelId}
                  onChange={(e) => setPixelInputs({ ...pixelInputs, [pix.id]: e.target.value })}
                  className="w-full rounded-xl border border-dark-border bg-dark-surface p-2.5 font-mono text-xs font-bold text-brand-cyan focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => handleSavePixel(pix.id, pix.enabled)}
                className="w-full rounded-xl bg-dark-elevated border border-dark-border py-2 text-xs font-bold text-white hover:border-brand-cyan hover:text-brand-cyan cursor-pointer"
              >
                Guardar ID de Píxel
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CUPÓN */}
      {isDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-dark-border bg-dark-surface p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border/80 pb-3">
              <h3 className="text-base font-black text-white">
                {editingDiscount ? `Editar Cupón: ${editingDiscount.code}` : 'Crear Nuevo Cupón Promocional'}
              </h3>
              <button onClick={() => setIsDiscountModalOpen(false)} className="text-text-muted hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveDiscount} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Código del Cupón *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. VERANO2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-mono font-black text-brand-cyan uppercase focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Tipo de Descuento</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="percentage">Porcentaje (%)</option>
                    <option value="fixed_amount">Monto Fijo (RD$)</option>
                    <option value="free_shipping">Envío Gratuito</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Valor del Descuento</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Compra Mínima (DOP)</label>
                  <input
                    type="number"
                    value={minSpendDop}
                    onChange={(e) => setMinSpendDop(Number(e.target.value))}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Fecha de Expiración</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsDiscountModalOpen(false)}
                  className="rounded-xl border border-dark-border bg-dark-obsidian px-5 py-2.5 font-bold text-text-muted hover:text-white"
                >
                  Cancelar
                </button>
                <PrimaryButton type="submit" variant="primary" className="py-2.5 px-6 font-black">
                  Guardar Cupón
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
