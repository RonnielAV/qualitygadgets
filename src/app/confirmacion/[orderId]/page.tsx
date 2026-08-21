'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Building2, Banknote, CreditCard, ArrowRight, Copy, Check, MessageSquare, UserPlus, AlertCircle, MapPin, Package, Phone, User, FileText } from 'lucide-react';
import { OFFICIAL_DOMINICAN_BANKS, OFFICIAL_WHATSAPP_NUMBER } from '@/components/checkout/HighConversionCheckout';

interface ConfirmationProps {
  params: {
    orderId: string;
  };
}

export default function OrderConfirmationPage({ params }: ConfirmationProps) {
  const searchParams = useSearchParams();
  const metodo = searchParams.get('metodo') || 'contra_entrega_transferencia';
  const bancoKey = (searchParams.get('banco') as keyof typeof OFFICIAL_DOMINICAN_BANKS) || 'bhd';
  const orderNumberParam = searchParams.get('orden') || params.orderId;
  const bankInfo = OFFICIAL_DOMINICAN_BANKS[bancoKey] || OFFICIAL_DOMINICAN_BANKS.bhd;

  const [copied, setCopied] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [password, setPassword] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Intentar leer datos completos del pedido guardados al hacer checkout
    const savedOrder = localStorage.getItem(`order_${params.orderId}`) || localStorage.getItem('latest_order');
    if (savedOrder) {
      try {
        setOrderDetails(JSON.parse(savedOrder));
      } catch (e) {
        console.error('Error parsing order:', e);
      }
    }
  }, [params.orderId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length >= 6) {
      setAccountCreated(true);
    }
  };

  // Construir mensaje completo con TODOS los datos del pedido para WhatsApp
  const generateWhatsAppMessage = () => {
    const ordNum = orderDetails?.orderNumber || orderNumberParam;
    const clientName = orderDetails?.formData?.fullName || 'Cliente Quality Gadgets';
    const clientPhone = orderDetails?.formData?.phone || '';
    const clientAddress = orderDetails?.formData?.addressLine1 || '';
    const clientSector = orderDetails?.formData?.municipality || '';
    const clientProvince = orderDetails?.formData?.province || '';
    const clientNotes = orderDetails?.formData?.deliveryNotes || '';
    const paymentDesc =
      metodo === 'contra_entrega_transferencia'
        ? `Transferencia Bancaria al Recibir (${bankInfo.name})`
        : metodo === 'contra_entrega_billet'
        ? 'Link de Pago Billet (Tarjeta de Crédito/Débito al Recibir)'
        : 'Efectivo al Recibir';

    const itemsText = orderDetails?.items
      ? orderDetails.items
          .map((i: any) => `• ${i.quantity}x ${i.title} — RD$ ${(i.priceDop * i.quantity).toLocaleString('es-DO')}`)
          .join('\n')
      : '• Gadgets seleccionados';

    const totalText = orderDetails?.totalAmount
      ? `RD$ ${orderDetails.totalAmount.toLocaleString('es-DO')}`
      : 'Consultar total';

    const fiscalText = orderDetails?.formData?.needFiscalTaxInvoice
      ? `\n📄 *Comprobante Fiscal RNC:* ${orderDetails.formData.rncOrCedula || 'Solicitado'}`
      : '';

    const notesText = clientNotes ? `\n📍 *Referencia Entrega:* ${clientNotes}` : '';

    const rawMessage = `🛒 *CONFIRMACIÓN DE PEDIDO - QUALITY GADGETS RD*
━━━━━━━━━━━━━━━━━━━━
📌 *No. de Orden:* ${ordNum}
👤 *Cliente:* ${clientName}
📱 *Teléfono / WhatsApp:* ${clientPhone}
🏠 *Dirección de Entrega:* ${clientAddress}, ${clientSector}, ${clientProvince}${notesText}${fiscalText}

📦 *PRODUCTOS:*
${itemsText}

💰 *TOTAL A PAGAR AL RECIBIR:* ${totalText}
💳 *MODALIDAD:* ${paymentDesc}
━━━━━━━━━━━━━━━━━━━━
✅ *Política:* Siempre pago contra entrega, nunca transferencia sin recibir el producto.

¡Hola! Confirmo mi pedido para que entre en ruta de despacho. Quedo atento a la entrega.`;

    return encodeURIComponent(rawMessage);
  };

  return (
    <div className="min-h-screen bg-dark-obsidian py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dark-border bg-dark-surface/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl space-y-8">
          {/* Icono de Éxito */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-glow-cyan">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <div className="space-y-2">
            <span className="inline-block rounded-full bg-brand-indigo px-4 py-1.5 text-xs font-black text-brand-cyan border border-brand-cyan/30">
              ¡ORDEN REGISTRADA EXITOSAMENTE!
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white">
              ¡Gracias por tu pedido en Quality Gadgets RD!
            </h1>
            <p className="text-sm text-text-muted max-w-lg mx-auto">
              Para despachar tu orden de inmediato, presiona el botón a continuación para enviar la confirmación completa con todos los datos a nuestro WhatsApp oficial.
            </p>
          </div>

          {/* BOTÓN PROMINENTE DE WHATSAPP OFICIAL CON TODOS LOS DATOS */}
          <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/30 p-8 text-left space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-glow-cyan">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Paso Obligatorio: Confirmar Orden por WhatsApp
                </h3>
                <p className="text-xs text-text-muted">
                  Haz clic para enviar el desglose completo del pedido al +1 (809) 316-0799:
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-base font-black text-white shadow-xl transition-all hover:bg-emerald-500 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Enviar Confirmación Completa por WhatsApp (+1 809-316-0799)</span>
            </a>
          </div>

          {/* Resumen Inmutable y Detalle del Pedido */}
          <div className="rounded-3xl bg-dark-obsidian/90 p-6 sm:p-8 text-left space-y-4 border border-dark-border/80">
            <h3 className="text-sm font-black text-white border-b border-dark-border/60 pb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-cyan" />
              <span>Detalles del Pedido Registrado</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-text-muted block text-[11px]">Número de Orden:</span>
                <strong className="text-brand-cyan font-mono text-sm font-black">
                  {orderDetails?.orderNumber || orderNumberParam}
                </strong>
              </div>
              <div>
                <span className="text-text-muted block text-[11px]">Modalidad de Pago:</span>
                <strong className="text-white font-bold">
                  {metodo === 'contra_entrega_transferencia'
                    ? `Transferencia al Recibir (${bankInfo.name})`
                    : metodo === 'contra_entrega_billet'
                    ? 'Link Billet al Recibir'
                    : 'Efectivo al Recibir'}
                </strong>
              </div>
              {orderDetails?.formData?.fullName && (
                <div>
                  <span className="text-text-muted block text-[11px]">Cliente:</span>
                  <strong className="text-white font-bold">{orderDetails.formData.fullName}</strong>
                </div>
              )}
              {orderDetails?.formData?.phone && (
                <div>
                  <span className="text-text-muted block text-[11px]">Teléfono:</span>
                  <strong className="text-white font-bold">{orderDetails.formData.phone}</strong>
                </div>
              )}
              {orderDetails?.formData?.addressLine1 && (
                <div className="sm:col-span-2">
                  <span className="text-text-muted block text-[11px]">Dirección de Entrega:</span>
                  <strong className="text-white font-bold">
                    {orderDetails.formData.addressLine1}, {orderDetails.formData.municipality}, {orderDetails.formData.province}
                  </strong>
                </div>
              )}
            </div>

            {orderDetails?.items && (
              <div className="border-t border-dark-border/60 pt-4 space-y-2">
                <span className="text-[11px] font-black text-text-muted uppercase">Artículos:</span>
                <div className="space-y-1 text-xs">
                  {orderDetails.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-text-muted">
                      <span>{item.quantity}x {item.title}</span>
                      <strong className="text-white font-bold">
                        RD$ {(item.priceDop * item.quantity).toLocaleString('es-DO')}
                      </strong>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-dark-border/60 pt-3 text-sm font-black text-white">
                  <span>Total a Pagar al Recibir:</span>
                  <span className="text-logo-gradient">
                    RD$ {orderDetails.totalAmount?.toLocaleString('es-DO')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Regla de Oro */}
          <div className="rounded-2xl border border-brand-cyan/30 bg-dark-elevated/70 p-4 text-left flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-brand-cyan flex-shrink-0" />
            <p className="text-xs text-text-muted">
              <strong className="text-white font-bold">Política Oficial:</strong> Siempre pago contra entrega, nunca transferencia sin recibir el producto. Pagas cuando el mensajero entregue tu paquete.
            </p>
          </div>

          {/* Detalle Bancario si eligió Transferencia al recibir */}
          {metodo === 'contra_entrega_transferencia' && (
            <div className="rounded-3xl border border-brand-ultraviolet/40 bg-dark-elevated/90 p-8 text-left space-y-6 shadow-glow-purple">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-indigo text-brand-cyan">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Cuenta Bancaria para Transferir al Recibir
                  </h3>
                  <p className="text-xs text-text-muted">
                    Transfiere al mensajero cuando tengas el producto:
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-dark-border bg-dark-obsidian p-5 text-xs space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-muted">Banco:</span>
                  <strong className="text-white font-bold">{bankInfo.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Tipo de Cuenta:</span>
                  <strong className="text-white font-bold">{bankInfo.accountType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Titular:</span>
                  <strong className="text-brand-magenta font-black">{bankInfo.beneficiary}</strong>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dark-border/80">
                  <div>
                    <span className="text-text-muted text-[11px] block">No. de Cuenta:</span>
                    <strong className="text-brand-cyan font-mono text-base font-black">{bankInfo.accountNumber}</strong>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-surface px-4 py-2 text-xs font-extrabold text-white hover:border-brand-cyan transition-all"
                  >
                    {copied ? (
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
            </div>
          )}

          {/* Registro Opcional Post-Compra */}
          <div className="rounded-3xl border border-dark-border bg-dark-obsidian/70 p-8 text-left space-y-4">
            <div className="flex items-center gap-3">
              <UserPlus className="h-5 w-5 text-brand-cyan" />
              <h3 className="text-sm font-bold text-white">
                Guarda tus datos para compras futuras en 1 clic
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              Crea una contraseña opcional para ver tus certificados de garantía oficial en República Dominicana.
            </p>

            {!accountCreated ? (
              <form onSubmit={handleCreateAccount} className="flex flex-col sm:flex-row gap-3 pt-2">
                <input
                  type="password"
                  placeholder="Crea una contraseña (mín. 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 rounded-2xl border border-dark-border bg-dark-surface px-4 py-3 text-xs font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-6 py-3 text-xs font-black text-white shadow-glow-purple hover:scale-105 transition-all"
                >
                  Activar Cuenta
                </button>
              </form>
            ) : (
              <p className="text-xs font-bold text-emerald-400">
                ✓ ¡Cuenta activada con éxito! Ya puedes iniciar sesión con tu correo electrónico.
              </p>
            )}
          </div>

          <div className="flex justify-center pt-4">
            <Link
              href="/productos"
              className="flex items-center gap-2 rounded-2xl border border-dark-border bg-dark-surface px-8 py-3.5 text-xs font-black text-white transition-all hover:border-brand-cyan hover:text-brand-cyan"
            >
              Seguir Explorando Gadgets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
