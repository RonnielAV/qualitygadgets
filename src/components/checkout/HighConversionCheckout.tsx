'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Lock, Building2, Banknote, CreditCard, Truck, Copy, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/hooks/useCartStore';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/utils';
import { ShippingService } from '../../../services/core-api/src/shipping/shipping.service';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  province: string;
  municipality: string;
  deliveryNotes?: string;
  paymentMethod: 'contra_entrega_transferencia' | 'contra_entrega_efectivo' | 'contra_entrega_billet';
  selectedBank?: 'bhd' | 'banreservas' | 'popular';
  needFiscalTaxInvoice: boolean;
  rncOrCedula?: string;
}

const PROVINCIAS_RD = [
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
];

export const OFFICIAL_DOMINICAN_BANKS = {
  bhd: {
    name: 'Banco BHD',
    accountType: 'Cuenta de Ahorro',
    accountNumber: '20733250038',
    beneficiary: 'Ronniel Aybar Vessuup',
  },
  banreservas: {
    name: 'BanReservas',
    accountType: 'Cuenta de Ahorro',
    accountNumber: '9606273048',
    beneficiary: 'Ronniel Aybar Vessuup',
  },
  popular: {
    name: 'Banco Popular',
    accountType: 'Cuenta de Ahorro',
    accountNumber: '843022187',
    beneficiary: 'Ronniel Aybar Vessuup',
  },
};

export const OFFICIAL_WHATSAPP_NUMBER = '18093160799';

const shippingService = new ShippingService();

export function HighConversionCheckout() {
  const { items, subtotalDop, subtotalUsd, currency, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    mode: 'onBlur',
    defaultValues: {
      province: 'Distrito Nacional',
      paymentMethod: 'contra_entrega_transferencia',
      selectedBank: 'bhd',
      needFiscalTaxInvoice: false,
    },
  });

  const selectedProvince = watch('province') || 'Distrito Nacional';
  const paymentMethod = watch('paymentMethod');
  const selectedBank = watch('selectedBank') || 'bhd';
  const needFiscal = watch('needFiscalTaxInvoice');

  const subtotal = currency === 'DOP' ? subtotalDop() : subtotalUsd();
  const shippingInfo = shippingService.calculateShipping({
    province: selectedProvince,
    subtotalDop: subtotalDop(),
    totalWeightGrams: 500,
  });

  const shippingCost = currency === 'DOP' ? shippingInfo.costDop : (shippingInfo.costDop > 0 ? 5 : 0);
  const taxAmount = Number(((subtotal * 0.18) / 1.18).toFixed(2));
  const totalAmount = subtotal + shippingCost;

  const handleCopyAccount = (bankKey: string, accNum: string) => {
    navigator.clipboard.writeText(accNum);
    setCopiedBank(bankKey);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    try {
      const orderPayload = {
        formData: data,
        items,
        currency,
        subtotal,
        taxAmount,
        shippingCost,
        totalAmount,
        shippingInfo,
      };

      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const resData = await response.json();
      if (resData.success) {
        const finalOrderId = resData.orderId || `order-${Date.now()}`;
        const finalOrderNumber = resData.orderNumber && /^QG-\d{4}$/.test(resData.orderNumber)
          ? resData.orderNumber
          : `QG-${Math.floor(1000 + Math.random() * 9000)}`;

        useStore.getState().addOrder({
          id: finalOrderId,
          orderNumber: finalOrderNumber,
          customerName: data.fullName,
          email: data.email,
          phone: data.phone,
          province: data.province,
          city: data.municipality || data.province,
          address: data.addressLine1,
          items: items.map((i: any) => ({
            productId: i.productId,
            variantId: i.variantId,
            title: i.title,
            variantTitle: i.variantTitle || '',
            sku: i.sku || i.variantId || 'SKU-DEFAULT',
            priceDop: i.priceDop,
            quantity: i.quantity,
            thumbnailUrl: i.imageUrl || i.thumbnailUrl || '',
          })),
          subtotalDop: subtotal,
          shippingDop: shippingCost,
          discountDop: 0,
          totalDop: totalAmount,
          paymentMethod: data.paymentMethod,
          selectedBank: data.selectedBank,
          status: 'En Proceso',
          notes: data.deliveryNotes || '',
        });

        // Guardar detalles del pedido completo en localStorage para la confirmación de WhatsApp
        const fullOrderDetails = {
          orderId: finalOrderId,
          orderNumber: finalOrderNumber,
          ...orderPayload,
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(`order_${finalOrderId}`, JSON.stringify(fullOrderDetails));
        localStorage.setItem('latest_order', JSON.stringify(fullOrderDetails));

        clearCart();
        window.location.href = `/confirmacion/${finalOrderId}?metodo=${data.paymentMethod}&banco=${data.selectedBank || 'bhd'}&orden=${finalOrderNumber}`;
      } else {
        alert(resData.message || 'Error al procesar pedido');
      }
    } catch (err) {
      console.error('Error al procesar checkout:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-obsidian py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header de Seguridad */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-dark-border/80 pb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-white uppercase block">
                Checkout Seguro | Quality Gadgets RD
              </span>
              <span className="text-xs text-text-muted">
                Garantía oficial • Confirmación directa vía WhatsApp al +1 (809) 316-0799
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-5 w-5" />
            <span>Siempre Pago Contra Entrega (Pagas al Recibir)</span>
          </div>
        </div>

        {/* Banner Informativo de Confianza de Pago */}
        <div className="mt-8 rounded-3xl border border-brand-cyan/40 bg-gradient-to-r from-dark-surface via-brand-indigo/30 to-dark-surface p-6 shadow-glow-cyan flex items-start sm:items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/20 text-brand-cyan">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">
              Política de Seguridad y Transparencia Quality Gadgets RD
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              <strong>Siempre pago contra entrega, nunca transferencia sin recibir el producto.</strong> Elige pagar por transferencia bancaria, efectivo o Link Billet al tener tu gadget en mano.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Columna Izquierda: Datos de Entrega y Métodos de Pago */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Datos de Contacto y Entrega */}
            <div className="rounded-3xl border border-dark-border bg-dark-surface/80 p-8 sm:p-10 shadow-xl backdrop-blur-xl space-y-6">
              <div className="flex items-center justify-between border-b border-dark-border/60 pb-4">
                <h3 className="text-base font-black text-white">
                  1. Datos de Contacto y Entrega
                </h3>
                <span className="rounded-full bg-brand-indigo px-3 py-1 text-xs font-bold text-brand-cyan border border-brand-cyan/30">
                  Modo Rápido
                </span>
              </div>

              <div className="space-y-5">
                {/* Nombre Completo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted">
                    Nombre y Apellidos *
                  </label>
                  <input
                    {...register('fullName', { required: 'Ingresa tu nombre y apellido' })}
                    placeholder="Ej. Carlos Mendoza Santana"
                    className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                  />
                  {errors.fullName && (
                    <span className="text-xs font-semibold text-brand-magenta">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Correo y Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted">
                      Correo Electrónico (para tu factura) *
                    </label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Correo requerido',
                        pattern: { value: /^\S+@\S+$/i, message: 'Formato de correo no válido' },
                      })}
                      placeholder="carlos@ejemplo.com"
                      className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                    />
                    {errors.email && (
                      <span className="text-xs font-semibold text-brand-magenta">{errors.email.message}</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      {...register('phone', { required: 'Teléfono requerido para coordinar la entrega' })}
                      placeholder="809-555-1234"
                      className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                    />
                    {errors.phone && (
                      <span className="text-xs font-semibold text-brand-magenta">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted">
                    Dirección de Entrega (Calle, No. Edificio / Casa / Apto) *
                  </label>
                  <input
                    {...register('addressLine1', { required: 'Ingresa la dirección exacta de entrega' })}
                    placeholder="Av. Winston Churchill #1099, Piantini, Apto 5B"
                    className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                  />
                  {errors.addressLine1 && (
                    <span className="text-xs font-semibold text-brand-magenta">{errors.addressLine1.message}</span>
                  )}
                </div>

                {/* Provincia y Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted">
                      Provincia *
                    </label>
                    <select
                      {...register('province')}
                      className="w-full appearance-none rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none cursor-pointer"
                    >
                      {PROVINCIAS_RD.map((p) => (
                        <option key={p} value={p} className="bg-dark-obsidian text-white">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-muted">
                      Sector / Municipio *
                    </label>
                    <input
                      {...register('municipality', { required: 'Indica el sector' })}
                      placeholder="Ej. Piantini / Bella Vista / Naco"
                      className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                    />
                    {errors.municipality && (
                      <span className="text-xs font-semibold text-brand-magenta">{errors.municipality.message}</span>
                    )}
                  </div>
                </div>

                {/* Punto de Referencia */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted">
                    Punto de Referencia (Opcional)
                  </label>
                  <input
                    {...register('deliveryNotes')}
                    placeholder="Ej. Frente a la plaza o portón blanco"
                    className="w-full rounded-2xl border border-dark-border bg-dark-obsidian p-4 text-sm font-semibold text-white placeholder-text-muted transition-all focus:border-brand-cyan focus:shadow-glow-cyan focus:outline-none"
                  />
                </div>

                {/* Comprobante Fiscal */}
                <div className="pt-3">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-white">
                    <input type="checkbox" {...register('needFiscalTaxInvoice')} className="rounded accent-brand-ultraviolet h-4 w-4" />
                    <span>Deseo Factura con Comprobante Fiscal (NCF Crédito Fiscal DGII)</span>
                  </label>
                  {needFiscal && (
                    <input
                      {...register('rncOrCedula')}
                      placeholder="Ingresa RNC o Cédula de la empresa"
                      className="mt-3 w-full rounded-2xl border border-dark-border bg-dark-obsidian p-3.5 text-xs font-semibold text-white focus:border-brand-cyan focus:outline-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 2. Método de Pago Contra Entrega */}
            <div className="rounded-3xl border border-dark-border bg-dark-surface/80 p-8 sm:p-10 shadow-xl backdrop-blur-xl space-y-6">
              <div>
                <h3 className="text-base font-black text-white">
                  2. ¿Cómo deseas pagar al recibir tu producto?
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Pagas al mensajero cuando tengas el producto en tus manos.
                </p>
              </div>

              <div className="space-y-4">
                {/* Opción 1: Transferencia al Recibir */}
                <label className={`flex flex-col cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                  paymentMethod === 'contra_entrega_transferencia'
                    ? 'border-brand-ultraviolet bg-brand-indigo/40 shadow-glow-purple'
                    : 'border-dark-border bg-dark-obsidian/60 hover:border-brand-cyan'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        value="contra_entrega_transferencia"
                        {...register('paymentMethod')}
                        className="accent-brand-ultraviolet h-4 w-4"
                      />
                      <div>
                        <span className="block text-sm font-black text-white">
                          Transferencia Bancaria al Recibir (Popular, BanReservas, BHD)
                        </span>
                        <span className="text-xs text-brand-cyan font-bold">
                          Titular: Ronniel Aybar Vessuup
                        </span>
                      </div>
                    </div>
                    <Building2 className="h-6 w-6 text-brand-cyan" />
                  </div>

                  {paymentMethod === 'contra_entrega_transferencia' && (
                    <div className="mt-5 pt-5 border-t border-dark-border/80 space-y-4">
                      <p className="text-xs text-text-muted">
                        Selecciona tu banco preferido para ver el número de cuenta:
                      </p>

                      {/* Selector de Banco */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(['bhd', 'banreservas', 'popular'] as const).map((bKey) => {
                          const bInfo = OFFICIAL_DOMINICAN_BANKS[bKey];
                          const isSelected = selectedBank === bKey;
                          return (
                            <label
                              key={bKey}
                              className={`flex flex-col p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-brand-cyan bg-dark-elevated shadow-glow-cyan text-white font-black'
                                  : 'border-dark-border bg-dark-obsidian text-text-muted hover:text-white'
                              }`}
                            >
                              <input
                                type="radio"
                                value={bKey}
                                {...register('selectedBank')}
                                className="hidden"
                              />
                              <span className="font-extrabold">{bInfo.name}</span>
                              <span className="text-[10px] text-text-muted mt-0.5">{bInfo.accountType}</span>
                            </label>
                          );
                        })}
                      </div>

                      {/* Tarjeta de Cuenta Oficial */}
                      {selectedBank && OFFICIAL_DOMINICAN_BANKS[selectedBank as keyof typeof OFFICIAL_DOMINICAN_BANKS] && (
                        <div className="rounded-2xl border border-brand-cyan/30 bg-dark-elevated p-5 text-xs space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted">Banco:</span>
                            <strong className="text-white font-bold">{OFFICIAL_DOMINICAN_BANKS[selectedBank as keyof typeof OFFICIAL_DOMINICAN_BANKS].name}</strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted">Tipo de Cuenta:</span>
                            <strong className="text-white font-bold">{OFFICIAL_DOMINICAN_BANKS[selectedBank as keyof typeof OFFICIAL_DOMINICAN_BANKS].accountType}</strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-text-muted">Titular Oficial:</span>
                            <strong className="text-brand-magenta font-black">{OFFICIAL_DOMINICAN_BANKS[selectedBank as keyof typeof OFFICIAL_DOMINICAN_BANKS].beneficiary}</strong>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-dark-border/60">
                            <div>
                              <span className="text-text-muted text-[11px] block">No. de Cuenta:</span>
                              <strong className="text-brand-cyan font-mono text-base font-black">
                                {OFFICIAL_DOMINICAN_BANKS[selectedBank as keyof typeof OFFICIAL_DOMINICAN_BANKS].accountNumber}
                              </strong>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyAccount(selectedBank, OFFICIAL_DOMINICAN_BANKS[selectedBank as keyof typeof OFFICIAL_DOMINICAN_BANKS].accountNumber)}
                              className="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-surface px-4 py-2 text-xs font-bold text-white hover:border-brand-cyan transition-all"
                            >
                              {copiedBank === selectedBank ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-400" /> Copiado
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 text-brand-cyan" /> Copiar No. de Cuenta
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* Opción 2: Efectivo al Recibir */}
                <label className={`flex flex-col cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                  paymentMethod === 'contra_entrega_efectivo'
                    ? 'border-brand-cyan bg-brand-indigo/30 shadow-glow-cyan'
                    : 'border-dark-border bg-dark-obsidian/60 hover:border-brand-cyan'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        value="contra_entrega_efectivo"
                        {...register('paymentMethod')}
                        className="accent-brand-cyan h-4 w-4"
                      />
                      <div>
                        <span className="block text-sm font-black text-white">
                          Pago en Efectivo al Recibir
                        </span>
                        <span className="text-xs text-text-muted">
                          Pagas en efectivo al mensajero en la entrega
                        </span>
                      </div>
                    </div>
                    <Banknote className="h-6 w-6 text-brand-cyan" />
                  </div>
                </label>

                {/* Opción 3: Link de Pago Billet */}
                <label className={`flex flex-col cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                  paymentMethod === 'contra_entrega_billet'
                    ? 'border-brand-magenta bg-brand-magenta/15 shadow-glow-magenta'
                    : 'border-dark-border bg-dark-obsidian/60 hover:border-brand-magenta'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        value="contra_entrega_billet"
                        {...register('paymentMethod')}
                        className="accent-brand-magenta h-4 w-4"
                      />
                      <div>
                        <span className="block text-sm font-black text-white">
                          Link de Pago Billet (Tarjeta de Crédito / Débito)
                        </span>
                        <span className="text-xs text-brand-magenta font-bold">
                          Te enviaremos el Link Billet por WhatsApp para pagar con tarjeta al recibir
                        </span>
                      </div>
                    </div>
                    <CreditCard className="h-6 w-6 text-brand-magenta" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen y Confirmación */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-dark-border bg-dark-surface/90 p-8 shadow-2xl backdrop-blur-2xl space-y-6">
              <h3 className="text-base font-black text-white">Resumen del Pedido</h3>
              
              <div className="divide-y divide-dark-border/60 max-h-64 overflow-y-auto pr-2 space-y-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex justify-between py-3.5 text-xs">
                    <div>
                      <span className="font-bold text-white line-clamp-1">{item.title}</span>
                      <p className="text-[11px] text-brand-cyan font-medium">
                        {item.quantity}x {formatCurrency(currency === 'DOP' ? item.priceDop : item.priceUsd, currency)}
                      </p>
                    </div>
                    <span className="font-black text-white">
                      {formatCurrency(
                        (currency === 'DOP' ? item.priceDop : item.priceUsd) * item.quantity,
                        currency
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tiempos de Entrega */}
              <div className="rounded-2xl border border-brand-cyan/30 bg-dark-elevated/70 p-4 text-xs text-text-muted space-y-1">
                <div className="flex items-center gap-2 font-black text-brand-cyan">
                  <Truck className="h-4 w-4" />
                  <span>Entrega Estimada ({shippingInfo.carrier}):</span>
                </div>
                <p className="text-[11px] text-white">
                  {shippingInfo.estimatedDeliveryText}
                </p>
              </div>

              <div className="space-y-2.5 border-t border-dark-border/80 pt-5 text-xs">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>ITBIS (18% Incluido)</span>
                  <span className="font-medium text-white">{formatCurrency(taxAmount, currency)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Costo de Envío ({selectedProvince})</span>
                  <span className={`font-black ${shippingCost === 0 ? 'text-brand-cyan' : 'text-white'}`}>
                    {shippingCost === 0 ? 'GRATIS' : formatCurrency(shippingCost, currency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-dark-border/80 pt-4 text-xl font-black text-white">
                  <span>Total a Pagar al Recibir</span>
                  <span className="text-logo-gradient">{formatCurrency(totalAmount, currency)}</span>
                </div>
              </div>

              <PrimaryButton
                type="submit"
                variant="primary"
                disabled={isProcessing || items.length === 0}
                className="w-full py-4 text-base font-black shadow-glow-purple"
              >
                {isProcessing ? 'Confirmando Pedido...' : 'Completar Pedido y Confirmar'}
              </PrimaryButton>

              <div className="flex items-center justify-center gap-2 text-center text-[11px] text-text-muted pt-2">
                <MessageSquare className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Confirmación oficial directa vía WhatsApp al +1 809-316-0799</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
