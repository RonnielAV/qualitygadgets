'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCcw, ExternalLink, Copy, Check, X, Save, FileText, Truck } from 'lucide-react';
import { useStore, Order, PostSaleCase } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface PostSaleModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OFFICIAL_RETURN_FORM_URL = 'https://ronnielav.github.io/Formulatio-De-Devolucion-y-Cambio/';

export function PostSaleModal({ order, isOpen, onClose }: PostSaleModalProps) {
  const { updatePostSale, updateOrderStatus } = useStore();
  const [copied, setCopied] = useState(false);

  const [type, setType] = useState<'change' | 'return' | ''>('');
  const [status, setStatus] = useState('');
  const [resolution, setResolution] = useState('');
  const [routeAction, setRouteAction] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (order) {
      const ps = order.postSale || {};
      setType(ps.type || '');
      setStatus(ps.status || order.status || '');
      setResolution(ps.resolution || '');
      setRouteAction(ps.routeAction || '');
      
      const queryParams = new URLSearchParams({
        pedido: order.orderNumber || order.id || '',
        cliente: order.customerName || order.customer?.name || '',
        telefono: order.phone || '',
        producto: order.items?.[0]?.title || '',
      });
      const generatedUrl = `${OFFICIAL_RETURN_FORM_URL}?${queryParams.toString()}`;
      setFormUrl(ps.formUrl || generatedUrl);
      setPdfUrl(ps.pdfUrl || '');
      setNotes(ps.notes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPostSale: PostSaleCase = {
      type,
      status: status || (type === 'change' ? 'Solicitud de cambio recibida' : type === 'return' ? 'Solicitud de devolución recibida' : ''),
      resolution: resolution.trim(),
      routeAction,
      formUrl: formUrl.trim(),
      pdfUrl: pdfUrl.trim(),
      notes: notes.trim(),
      updatedAt: new Date().toISOString().split('T')[0],
    };

    updatePostSale(order.id, updatedPostSale);
    if (status) {
      updateOrderStatus(order.id, status as any);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-dark-border bg-dark-surface p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-dark-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <RefreshCcw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Gestionar Postventa: {order.orderNumber}
              </h3>
              <p className="text-xs text-text-muted">
                Cliente: {order.customerName || order.customer?.name} ({order.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-text-muted hover:bg-dark-obsidian hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Banner con enlace directo al formulario externo */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Formulario Oficial de Cambios y Devoluciones</span>
            </h4>
          </div>
          <p className="text-[11px] text-text-muted">
            Envía este enlace personalizado al cliente por WhatsApp para que cargue la foto de su producto o comprobante.
          </p>
          <div className="flex items-center gap-2">
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all truncate"
            >
              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">Abrir Formulario Oficial</span>
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-obsidian px-4 py-2 text-xs font-bold text-white hover:border-brand-cyan transition-all cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>

        {/* Formulario de Postventa */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Tipo de Caso</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="">Sin postventa activa</option>
                <option value="change">Cambio de Producto</option>
                <option value="return">Devolución / Reembolso</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Estado del Caso</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="">Mantener estado actual</option>
                <option value="Solicitud de cambio recibida">Solicitud de cambio recibida</option>
                <option value="Solicitud de devolución recibida">Solicitud de devolución recibida</option>
                <option value="Pendiente de recoger">Pendiente de recoger</option>
                <option value="Producto recogido">Producto recogido</option>
                <option value="Cambio en ruta">Cambio en ruta</option>
                <option value="Devolución en revisión">Devolución en revisión</option>
                <option value="Cambio completado">Cambio completado</option>
                <option value="Devolución completada">Devolución completada</option>
                <option value="Reembolso pendiente">Reembolso pendiente</option>
                <option value="Caso cerrado">Caso cerrado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Cómo se resolverá</label>
              <input
                type="text"
                placeholder="Ej. Cambio por color Negro / Reembolso por BHD"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-muted flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5 text-brand-cyan" />
                <span>Acción de Ruta para Mensajero</span>
              </label>
              <select
                value={routeAction}
                onChange={(e) => setRouteAction(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="">Sin ruta pendiente</option>
                <option value="Recoger cambio">Recoger cambio</option>
                <option value="Recoger devolución">Recoger devolución</option>
                <option value="Entregar cambio">Entregar cambio</option>
                <option value="Cambio y recogida en la misma visita">Cambio y recogida en la misma visita</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Enlace de Documento / PDF (Opcional)</label>
            <input
              type="text"
              placeholder="https://... o ruta del archivo de reclamo"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Notas Internas & Motivo</label>
            <textarea
              rows={3}
              placeholder="Motivo del cambio, observaciones del cliente, instrucciones al mensajero..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-dark-border bg-dark-obsidian px-5 py-2.5 font-bold text-text-muted hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <PrimaryButton type="submit" variant="primary" className="py-2.5 px-6 font-black shadow-glow-purple cursor-pointer">
              <Save className="h-4 w-4 mr-1.5" />
              <span>Guardar Caso Postventa</span>
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}
