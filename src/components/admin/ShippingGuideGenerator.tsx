'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Send,
  Download,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Layers,
  Check,
  Building2,
  Users,
  Eye
} from 'lucide-react';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
import { useStore, Order } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export interface ShippingGuideItem {
  id?: string;
  guideNumber: string;
  shipperName: string;
  shipperAddress: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  company: string;
  declaredValue: string;
  amount: string;
  contentText: string;
  dateText: string;
  guideNote: string;
  courierId?: string;
  courierName?: string;
  qrDataUrl?: string;
}

const DEFAULT_SHIPPER_NAME = 'QUALITY GADGETS RD';
const DEFAULT_SHIPPER_ADDRESS = `Calle Plaza de la Cultura No. 304, El Millón.\nSANTO DOMINGO\nDISTRITO NACIONAL\nTEL: +1 (809) 316-0799\nSERVICIO NACIONAL PREMIUM`;
const DEFAULT_COMPANY = 'Mensajero Quality Gadgets RD (Rofanci Encarnación)';
const DEFAULT_GUIDE_NOTE =
  'Antes de salir 🚚, debes llamar al cliente 📞 • Confirmar disponibilidad • Validar dirección • Confirmar método de pago 💰. MUCHAS GRACIAS!';

const generate4DigitQG = () => `QG-${Math.floor(1000 + Math.random() * 9000)}`;

export function ShippingGuideGenerator() {
  const { orders, couriers, footerConfig } = useStore();
  const safeOrders = orders || [];
  const safeCouriers = couriers || [];

  const dynamicShipperName = footerConfig?.companyName || 'QUALITY GADGETS RD';
  const dynamicShipperAddress = [
    footerConfig?.address || 'Piantini, Santo Domingo, D.N.',
    `TEL: ${footerConfig?.phone || '+1 (809) 316-0799'}`,
    'SERVICIO NACIONAL'
  ].filter(Boolean).join('\n');

  const [guideBatch, setGuideBatch] = useState<ShippingGuideItem[]>([]);
  const [selectedCourierFilter, setSelectedCourierFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Manual Form State
  const [guideNumber, setGuideNumber] = useState<string>(generate4DigitQG);
  const [dateText, setDateText] = useState(new Date().toISOString().split('T')[0]);
  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [shipperName, setShipperName] = useState(dynamicShipperName);
  const [shipperAddress, setShipperAddress] = useState(dynamicShipperAddress);

  useEffect(() => {
    if (footerConfig) {
      setShipperName(dynamicShipperName);
      setShipperAddress(dynamicShipperAddress);
    }
  }, [footerConfig?.companyName, footerConfig?.address, footerConfig?.phone, dynamicShipperName, dynamicShipperAddress]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientCity, setRecipientCity] = useState('Naco');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [contentText, setContentText] = useState('');
  const [declaredValue, setDeclaredValue] = useState('RD$ 0.00');
  const [amount, setAmount] = useState('RD$ 0.00');
  const [guideNote, setGuideNote] = useState(DEFAULT_GUIDE_NOTE);
  const [manualDraftQR, setManualDraftQR] = useState<string>('');

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Helper: Generar QR de WhatsApp para el destinatario con alta resolución (500px)
  const generateQRForGuide = async (item: ShippingGuideItem): Promise<string> => {
    let cleanPhone = (item.recipientPhone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '1' + cleanPhone;
    const message = `¡Hola ${item.recipientName || 'Cliente'}! Soy de ${item.company || 'Quality Gadgets RD'}.\n\nTe escribo para informarte que ya estoy en camino a entregarte tu pedido.\n\n*Detalles de su pedido:*\n- *Guía:* ${item.guideNumber}\n- *Contenido:* ${item.contentText}\n- *Monto a Pagar:* ${item.amount}\n\nPor favor, confírmame si te encuentras disponible para recibirlo en la dirección indicada. ¡Muchas gracias!`;
    const targetUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`
      : 'https://qualitygadgetsrd.com';

    try {
      return await QRCode.toDataURL(targetUrl, {
        width: 500,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
      });
    } catch {
      return '';
    }
  };

  // Actualizar QRs del lote
  useEffect(() => {
    const buildQRs = async () => {
      const updated = await Promise.all(
        guideBatch.map(async (g) => {
          if (!g.qrDataUrl) {
            const qr = await generateQRForGuide(g);
            return { ...g, qrDataUrl: qr };
          }
          return g;
        })
      );
      if (updated.some((u, idx) => u.qrDataUrl !== guideBatch[idx]?.qrDataUrl)) {
        setGuideBatch(updated);
      }
    };
    if (guideBatch.length > 0) {
      buildQRs();
    }
  }, [guideBatch]);

  // Actualizar QR del borrador manual en vivo
  useEffect(() => {
    const updateDraftQR = async () => {
      const draftItem: ShippingGuideItem = {
        guideNumber,
        shipperName,
        shipperAddress,
        recipientName,
        recipientPhone,
        recipientAddress,
        recipientCity,
        company,
        declaredValue,
        amount,
        contentText,
        dateText,
        guideNote,
      };
      if (recipientName || recipientPhone) {
        const qr = await generateQRForGuide(draftItem);
        setManualDraftQR(qr);
      } else {
        setManualDraftQR('');
      }
    };
    updateDraftQR();
  }, [guideNumber, recipientName, recipientPhone, recipientAddress, recipientCity, company, amount, contentText, dateText, guideNote]);

  // Cargar órdenes del dashboard al lote de guías con formato QG-####
  const handleLoadFromOrders = async () => {
    if (safeOrders.length === 0) {
      showToast('No hay pedidos en el dashboard para generar guías.', 'warning');
      return;
    }

    const items: ShippingGuideItem[] = await Promise.all(
      safeOrders.map(async (ord) => {
        const content = (ord.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Gadget Tecnológico';
        const formattedAmount = `RD$ ${Number(ord.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
        
        // Garantizar formato estricto QG-####
        const gNumber = ord.orderNumber && /^QG-\d{4}$/.test(ord.orderNumber)
          ? ord.orderNumber
          : generate4DigitQG();

        const guideItem: ShippingGuideItem = {
          id: ord.id,
          guideNumber: gNumber,
          shipperName: dynamicShipperName,
          shipperAddress: dynamicShipperAddress,
          recipientName: ord.customerName || ord.customer?.name || 'Cliente',
          recipientPhone: ord.phone || '',
          recipientAddress: ord.address || '',
          recipientCity: ord.city || ord.province || 'Distrito Nacional',
          company: ord.courierName || DEFAULT_COMPANY,
          declaredValue: formattedAmount,
          amount: formattedAmount,
          contentText: content,
          dateText: ord.deliveryDate || ord.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
          guideNote: ord.notes || DEFAULT_GUIDE_NOTE,
          courierId: ord.courierId,
          courierName: ord.courierName,
        };
        guideItem.qrDataUrl = await generateQRForGuide(guideItem);
        return guideItem;
      })
    );

    setGuideBatch(items);
    showToast(`Se cargaron ${items.length} pedidos con formato QG-####.`, 'success');
  };

  // Añadir guía manual al lote
  const handleAddManualGuide = async () => {
    if (!recipientName.trim()) {
      showToast('Ingresa el nombre del cliente.', 'warning');
      return;
    }

    const newItem: ShippingGuideItem = {
      guideNumber: guideNumber && /^QG-\d{4}$/.test(guideNumber) ? guideNumber : generate4DigitQG(),
      shipperName,
      shipperAddress,
      recipientName,
      recipientPhone,
      recipientAddress,
      recipientCity,
      company,
      declaredValue,
      amount,
      contentText,
      dateText,
      guideNote,
    };
    newItem.qrDataUrl = await generateQRForGuide(newItem);

    setGuideBatch((prev) => [...prev, newItem]);
    
    // Generar nuevo código QG-#### para el próximo
    setGuideNumber(generate4DigitQG());
    setRecipientName('');
    setRecipientPhone('');
    setRecipientAddress('');
    setContentText('');
    showToast('Guía agregada al lote.', 'success');
  };

  const handleDeleteGuide = (index: number) => {
    setGuideBatch((prev) => prev.filter((_, i) => i !== index));
    showToast('Guía eliminada del lote.', 'info');
  };

  const handleClearBatch = () => {
    if (confirm('¿Vaciar todo el lote de guías?')) {
      setGuideBatch([]);
      showToast('Lote de guías vaciado.', 'info');
    }
  };

  // Exportar Lleno a Excel
  const handleExportFilledExcel = () => {
    if (guideBatch.length === 0) {
      showToast('No hay guías para exportar.', 'warning');
      return;
    }
    const rows = guideBatch.map((g) => ({
      'No. Guía': g.guideNumber,
      'Cliente': g.recipientName,
      'Teléfono': g.recipientPhone,
      'Dirección': g.recipientAddress,
      'Ciudad/Sector': g.recipientCity,
      'Contenido': g.contentText,
      'Monto Recaudo': g.amount,
      'Mensajero / Empresa': g.company,
      'Fecha': g.dateText,
      'Nota': g.guideNote,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guias_QualityGadgets');
    XLSX.writeFile(wb, `Guias_QualityGadgetsRD_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Archivo Excel descargado.', 'success');
  };

  // Descargar Plantilla Excel
  const handleDownloadTemplate = () => {
    const template = [
      {
        'No. Guía': generate4DigitQG(),
        'Cliente': 'Juan Pérez',
        'Teléfono': '809-555-0101',
        'Dirección': 'Calle Principal #12, Piantini',
        'Ciudad/Sector': 'Distrito Nacional',
        'Contenido': '1x iPhone 16 Pro Max Titanium',
        'Monto Recaudo': 'RD$ 78,500.00',
        'Mensajero / Empresa': DEFAULT_COMPANY,
        'Fecha': new Date().toISOString().split('T')[0],
        'Nota': DEFAULT_GUIDE_NOTE,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla_Guias');
    XLSX.writeFile(wb, 'Plantilla_Guias_QualityGadgetsRD.xlsx');
    showToast('Plantilla descargada.', 'success');
  };

  // Importar Excel al lote
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
      if (!rows.length) {
        showToast('El archivo está vacío.', 'warning');
        return;
      }

      const importedItems: ShippingGuideItem[] = await Promise.all(
        rows.map(async (r) => {
          const rawNum = r['No. Guía'] || r['Guia'] || r['Pedido'] || '';
          const gNum = /^QG-\d{4}$/.test(rawNum) ? rawNum : generate4DigitQG();

          const item: ShippingGuideItem = {
            guideNumber: gNum,
            shipperName: DEFAULT_SHIPPER_NAME,
            shipperAddress: DEFAULT_SHIPPER_ADDRESS,
            recipientName: r['Cliente'] || r['Destinatario'] || r['Nombre'] || 'Cliente',
            recipientPhone: String(r['Teléfono'] || r['Telefono'] || r['Celular'] || ''),
            recipientAddress: r['Dirección'] || r['Direccion'] || '',
            recipientCity: r['Ciudad/Sector'] || r['Ciudad'] || 'Distrito Nacional',
            company: r['Mensajero / Empresa'] || r['Mensajero'] || r['Empresa'] || DEFAULT_COMPANY,
            declaredValue: String(r['Monto Recaudo'] || r['Recaudo'] || r['Monto'] || 'RD$ 0.00'),
            amount: String(r['Monto Recaudo'] || r['Recaudo'] || r['Monto'] || 'RD$ 0.00'),
            contentText: r['Contenido'] || r['Productos'] || 'Gadget Tecnológico',
            dateText: r['Fecha'] || new Date().toISOString().split('T')[0],
            guideNote: r['Nota'] || DEFAULT_GUIDE_NOTE,
          };
          item.qrDataUrl = await generateQRForGuide(item);
          return item;
        })
      );

      setGuideBatch((prev) => [...prev, ...importedItems]);
      showToast(`Se importaron ${importedItems.length} guías del Excel.`, 'success');
    } catch {
      showToast('Error al procesar el archivo Excel.', 'warning');
    }
    e.target.value = '';
  };

  // Enviar listado formateado al WhatsApp del Mensajero
  const handleSendWhatsAppToCourier = () => {
    if (guideBatch.length === 0) {
      showToast('No hay guías en el lote.', 'warning');
      return;
    }

    const filtered =
      selectedCourierFilter === 'all'
        ? guideBatch
        : guideBatch.filter((g) => g.courierId === selectedCourierFilter || g.company.includes(selectedCourierFilter));

    const courier = safeCouriers.find((c) => c.id === selectedCourierFilter) || safeCouriers[0];
    const courierPhone = courier?.phone?.replace(/\D/g, '') || '8093160799';
    const courierName = courier?.name || 'Mensajero Quality Gadgets RD';

    const lines = [
      `🚚 *QUALITY GADGETS RD - LISTADO DE DESPACHO* 📦`,
      `*Mensajero:* ${courierName}`,
      `*Total paquetes:* ${filtered.length}`,
      `*Fecha:* ${new Date().toLocaleDateString('es-DO')}`,
      `---------------------------------------`,
      '',
    ];

    filtered.forEach((g, idx) => {
      lines.push(`*${idx + 1}) GUÍA:* ${g.guideNumber}`);
      lines.push(`👤 *Cliente:* ${g.recipientName}`);
      lines.push(`📞 *Teléfono:* ${g.recipientPhone || 'N/D'}`);
      lines.push(`📍 *Dirección:* ${g.recipientAddress}, ${g.recipientCity}`);
      lines.push(`📦 *Contenido:* ${g.contentText}`);
      lines.push(`💰 *Monto a Cobrar:* ${g.amount}`);
      lines.push(`📝 *Nota:* ${g.guideNote}`);
      lines.push(
        `💬 *WhatsApp Cliente:* https://wa.me/1${(g.recipientPhone || '').replace(/\D/g, '')}`
      );
      lines.push('');
    });

    lines.push(`⚠️ *IMPORTANTE:* Validar dirección y método de pago antes de la entrega.`);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://api.whatsapp.com/send?phone=1${courierPhone}&text=${text}`, '_blank');
  };

  // Función de impresión aislada
  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-xs text-text-pure">
      {toastMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-2xl p-4 text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce ${
            toastMsg.type === 'success'
              ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
              : toastMsg.type === 'warning'
              ? 'bg-amber-950 border border-amber-500 text-amber-300'
              : 'bg-dark-surface border border-brand-cyan text-brand-cyan'
          }`}
        >
          <Check className="h-4 w-4" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Barra de Acciones Superior (Oculta en Impresión) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl print:hidden">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Printer className="h-6 w-6 text-brand-cyan" />
            <span>Generador de Guías Térmicas (Formato Completo 4x6 & QG-####)</span>
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Etiquetas con cobertura completa de la hoja 4x6, código QR dinámico de alta resolución y número de guía oficial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton
            type="button"
            variant="primary"
            onClick={handleLoadFromOrders}
            className="py-2.5 px-4 text-xs font-black shadow-glow-purple cursor-pointer"
          >
            <Layers className="h-4 w-4 mr-1.5" />
            <span>Cargar ({safeOrders.length}) Pedidos OMS</span>
          </PrimaryButton>

          <button
            type="button"
            onClick={handleSendWhatsAppToCourier}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-black text-emerald-400 hover:bg-emerald-900/50 transition-all cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Enviar al Mensajero (WA)</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerPrint}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-5 py-2.5 text-xs font-black text-white shadow-glow-purple hover:opacity-90 transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir Térmica 4x6 ({guideBatch.length})</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Formulario a la Izquierda y Vista Previa a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:hidden">
        {/* PANEL LATERAL DE CONTROL (4 COLUMNAS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Carga Masiva */}
          <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-md space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-dark-border pb-3 flex items-center justify-between">
              <span>Carga Masiva (Excel / CSV)</span>
              <Upload className="h-4 w-4 text-brand-cyan" />
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-dashed border-dark-border hover:border-brand-cyan bg-dark-obsidian cursor-pointer transition-all">
                <Upload className="h-5 w-5 text-brand-cyan" />
                <span className="text-[11px] font-bold text-white">Importar Archivo</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-dark-border hover:border-white bg-dark-obsidian text-text-muted hover:text-white transition-all cursor-pointer"
              >
                <Download className="h-5 w-5" />
                <span className="text-[11px] font-bold">Descargar Plantilla</span>
              </button>
            </div>
          </div>

          {/* Creación Manual */}
          <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-md space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-b border-dark-border pb-3 flex items-center justify-between">
              <span>Creación Manual de Guía</span>
              <Plus className="h-4 w-4 text-emerald-400" />
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-muted">No. Guía (QG-####)</label>
                  <input
                    type="text"
                    value={guideNumber}
                    onChange={(e) => setGuideNumber(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-mono font-black text-brand-cyan focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-muted">Fecha</label>
                  <input
                    type="date"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted">Empresa / Mensajero</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value={DEFAULT_COMPANY}>{DEFAULT_COMPANY}</option>
                  {safeCouriers.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted">Nombre Cliente *</label>
                <input
                  type="text"
                  placeholder="Ej. Ronniel Aybar"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-muted">Teléfono</label>
                  <input
                    type="text"
                    placeholder="8093160799"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-muted">Ciudad / Sector</label>
                  <input
                    type="text"
                    placeholder="Naco"
                    value={recipientCity}
                    onChange={(e) => setRecipientCity(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted">Dirección de Entrega</label>
                <textarea
                  rows={2}
                  placeholder="Calle Principal #123, Naco..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-muted">Contenido del Paquete</label>
                <input
                  type="text"
                  placeholder="Ej. 1x Altavoz Bluetooth compacto BOC250 (20 W)"
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-text-muted">Monto Recaudo</label>
                  <input
                    type="text"
                    placeholder="RD$ 2,700.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-bold text-emerald-400 focus:border-brand-cyan focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-text-muted">Valor Declarado</label>
                  <input
                    type="text"
                    placeholder="RD$ 2,700.00"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="button"
                  variant="primary"
                  onClick={handleAddManualGuide}
                  className="w-full py-3 text-xs font-black shadow-glow-purple cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  <span>Añadir al Lote de Impresión</span>
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DE VISTA PREVIA EN PANTALLA (8 COLUMNAS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between rounded-3xl border border-dark-border bg-dark-surface p-5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-white">Vista Previa de Etiquetas Térmicas (4x6)</span>
              <span className="rounded-full bg-brand-cyan/20 border border-brand-cyan/40 px-3 py-0.5 text-xs font-black text-brand-cyan">
                {guideBatch.length} {guideBatch.length === 1 ? 'Guía' : 'Guías'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportFilledExcel}
                className="inline-flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-obsidian px-3.5 py-2 text-xs font-bold text-text-muted hover:text-white hover:border-brand-cyan transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Exportar Excel</span>
              </button>
              <button
                type="button"
                onClick={handleClearBatch}
                className="inline-flex items-center gap-1.5 rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 px-3.5 py-2 text-xs font-bold text-brand-magenta hover:bg-brand-magenta/20 transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Vaciar Lote</span>
              </button>
            </div>
          </div>

          {/* Renderizado de Guías Térmicas */}
          {guideBatch.length === 0 && !recipientName ? (
            <div className="rounded-3xl border border-dashed border-dark-border p-16 text-center text-text-muted space-y-3">
              <Printer className="h-12 w-12 mx-auto text-text-muted/40" />
              <strong className="text-base font-bold text-white block">Aún no hay guías en el lote</strong>
              <p className="text-xs max-w-sm mx-auto">
                Haz clic en "Cargar Pedidos OMS", importa un archivo Excel o escribe los datos en el formulario de la izquierda.
              </p>
            </div>
          ) : (
            <div className="space-y-8 flex flex-col items-center">
              {/* Borrador Manual Preview si se está escribiendo */}
              {recipientName && (
                <div className="w-full max-w-[420px] space-y-2 opacity-95">
                  <span className="text-[10px] font-black uppercase text-brand-cyan block">Borrador en Edición:</span>
                  <div className="bg-white text-black p-3.5 rounded-none border-2 border-black font-sans shadow-2xl space-y-2 flex flex-col justify-between">
                    <div className="text-center pb-1 border-b-2 border-black">
                      <strong className="text-xl font-black tracking-widest text-[#3F35FE] block">
                        QUALITY GADGETS RD
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black text-[11px]">
                      <div className="p-2 space-y-0.5">
                        <span className="font-black text-[9px] text-gray-700 uppercase block">REMITENTE:</span>
                        <strong className="block font-bold text-xs">{shipperName}</strong>
                        <p className="text-[10px] text-gray-800 whitespace-pre-line leading-tight">{shipperAddress}</p>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <span className="font-black text-[9px] text-gray-700 uppercase block">DESTINATARIO:</span>
                        <strong className="block font-bold text-sm text-black">{recipientName}</strong>
                        <p className="text-[11px] text-gray-800 leading-tight">
                          {recipientAddress}<br />
                          {recipientCity}<br />
                          <span className="font-black text-black">TEL: {recipientPhone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-black p-2 text-[11px]">
                      <span className="font-black text-[9px] text-gray-700 uppercase block">CONTENIDO:</span>
                      <strong className="text-xs font-bold block">{contentText || 'Gadget Tecnológico'}</strong>
                    </div>

                    <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black p-2 text-[11px]">
                      <div>
                        <span className="font-black text-[9px] text-gray-700 uppercase block">VALOR DECLARADO:</span>
                        <strong className="text-sm font-black">{declaredValue}</strong>
                      </div>
                      <div className="pl-2">
                        <span className="font-black text-[9px] text-gray-700 uppercase block">RECAUDO:</span>
                        <strong className="text-sm font-black text-black">{amount}</strong>
                      </div>
                    </div>

                    <div className="border-2 border-black p-2.5 flex items-center justify-between gap-3 bg-gray-50/50">
                      <div className="space-y-1">
                        <span className="font-black text-[10px] text-gray-700 uppercase block">NÚMERO DE GUÍA #</span>
                        <strong className="text-3xl font-black font-mono tracking-tight block">{guideNumber}</strong>
                        <div className="text-[11px] font-bold text-gray-800">EMPRESA: {company}</div>
                      </div>
                      {manualDraftQR && (
                        <div className="border-2 border-black p-1 bg-white flex-shrink-0 shadow-sm">
                          <img src={manualDraftQR} alt="QR WhatsApp" className="w-28 h-28 min-w-[112px] min-h-[112px]" />
                        </div>
                      )}
                    </div>

                    <div className="border-2 border-black p-2 text-[10px] leading-tight">
                      <strong className="block font-bold text-black">INSTRUCCIÓN DE ENTREGA:</strong>
                      <p className="italic text-gray-800 mt-0.5">{guideNote}</p>
                    </div>

                    <div className="border-2 border-black py-2 text-center font-black text-sm tracking-[0.2em] bg-white">
                      * * * PERMITIR APERTURA * * *
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de Guías Guardadas */}
              {guideBatch.map((guide, idx) => (
                <div key={idx} className="w-full max-w-[420px] space-y-2">
                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-text-muted">
                      Guía {idx + 1} de {guideBatch.length} ({guide.guideNumber})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteGuide(idx)}
                      className="text-brand-magenta hover:underline text-[11px] font-bold cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>

                  <div className="bg-white text-black p-3.5 rounded-none border-2 border-black font-sans shadow-2xl space-y-2 flex flex-col justify-between">
                    <div className="text-center pb-1 border-b-2 border-black">
                      <strong className="text-xl font-black tracking-widest text-[#3F35FE] block">
                        QUALITY GADGETS RD
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black text-[11px]">
                      <div className="p-2 space-y-0.5">
                        <span className="font-black text-[9px] text-gray-700 uppercase block">REMITENTE:</span>
                        <strong className="block font-bold text-xs">{guide.shipperName}</strong>
                        <p className="text-[10px] text-gray-800 whitespace-pre-line leading-tight">{guide.shipperAddress}</p>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <span className="font-black text-[9px] text-gray-700 uppercase block">DESTINATARIO:</span>
                        <strong className="block font-bold text-sm text-black">{guide.recipientName}</strong>
                        <p className="text-[11px] text-gray-800 leading-tight">
                          {guide.recipientAddress}<br />
                          {guide.recipientCity}<br />
                          <span className="font-black text-black">TEL: {guide.recipientPhone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="border-2 border-black p-2 text-[11px]">
                      <span className="font-black text-[9px] text-gray-700 uppercase block">CONTENIDO:</span>
                      <strong className="text-xs font-bold block">{guide.contentText}</strong>
                    </div>

                    <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black p-2 text-[11px]">
                      <div>
                        <span className="font-black text-[9px] text-gray-700 uppercase block">VALOR DECLARADO:</span>
                        <strong className="text-sm font-black">{guide.declaredValue}</strong>
                      </div>
                      <div className="pl-2">
                        <span className="font-black text-[9px] text-gray-700 uppercase block">RECAUDO:</span>
                        <strong className="text-sm font-black text-black">{guide.amount}</strong>
                      </div>
                    </div>

                    <div className="border-2 border-black p-2.5 flex items-center justify-between gap-3 bg-gray-50/50">
                      <div className="space-y-1">
                        <span className="font-black text-[10px] text-gray-700 uppercase block">NÚMERO DE GUÍA #</span>
                        <strong className="text-3xl font-black font-mono tracking-tight block">{guide.guideNumber}</strong>
                        <div className="text-[11px] font-bold text-gray-800">EMPRESA: {guide.company}</div>
                      </div>
                      {guide.qrDataUrl && (
                        <div className="border-2 border-black p-1 bg-white flex-shrink-0 shadow-sm">
                          <img src={guide.qrDataUrl} alt="QR WhatsApp" className="w-28 h-28 min-w-[112px] min-h-[112px]" />
                        </div>
                      )}
                    </div>

                    <div className="border-2 border-black p-2 text-[10px] leading-tight">
                      <strong className="block font-bold text-black">INSTRUCCIÓN DE ENTREGA:</strong>
                      <p className="italic text-gray-800 mt-0.5">{guide.guideNote}</p>
                    </div>

                    <div className="border-2 border-black py-2 text-center font-black text-sm tracking-[0.2em] bg-white">
                      * * * PERMITIR APERTURA * * *
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CONTENEDOR EXCLUSIVO PARA IMPRESIÓN (#printArea) QUE CUBRE TODA LA ETIQUETA */}
      <div id="printArea" className="hidden print:block">
        {(guideBatch.length > 0 ? guideBatch : recipientName ? [{
          guideNumber,
          shipperName,
          shipperAddress,
          recipientName,
          recipientPhone,
          recipientAddress,
          recipientCity,
          company,
          declaredValue,
          amount,
          contentText,
          dateText,
          guideNote,
          qrDataUrl: manualDraftQR,
        }] : []).map((guide, idx, arr) => (
          <div
            key={idx}
            className="sheet"
            style={{ pageBreakAfter: idx < arr.length - 1 ? 'always' : 'avoid' }}
          >
            <div className="thermal-label bg-white text-black p-2.5 font-sans border-2 border-black flex flex-col justify-between h-[5.84in]">
              {/* Header Oficial */}
              <div className="text-center pb-1 border-b-2 border-black">
                <strong className="text-lg font-black tracking-widest text-[#3F35FE] block">
                  QUALITY GADGETS RD
                </strong>
              </div>

              {/* Remitente & Destinatario */}
              <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black text-[10px]">
                <div className="p-1.5 space-y-0.5">
                  <span className="font-black text-[8px] text-gray-700 uppercase block">REMITENTE:</span>
                  <strong className="block font-bold text-[11px] leading-tight">{guide.shipperName}</strong>
                  <p className="text-[9px] text-gray-800 whitespace-pre-line leading-tight">{guide.shipperAddress}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <span className="font-black text-[8px] text-gray-700 uppercase block">DESTINATARIO:</span>
                  <strong className="block font-bold text-xs text-black leading-tight">{guide.recipientName}</strong>
                  <p className="text-[10px] text-gray-800 leading-tight">
                    {guide.recipientAddress}<br />
                    {guide.recipientCity}<br />
                    <span className="font-black text-black">TEL: {guide.recipientPhone}</span>
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <div className="border-2 border-black p-1.5 text-[10px]">
                <span className="font-black text-[8px] text-gray-700 uppercase block">CONTENIDO:</span>
                <strong className="text-[11px] leading-tight block">{guide.contentText}</strong>
              </div>

              {/* Valores */}
              <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black p-1.5 text-[10px]">
                <div>
                  <span className="font-black text-[8px] text-gray-700 uppercase block">VALOR DECLARADO:</span>
                  <strong className="text-xs font-black">{guide.declaredValue}</strong>
                </div>
                <div className="pl-1.5">
                  <span className="font-black text-[8px] text-gray-700 uppercase block">RECAUDO:</span>
                  <strong className="text-xs font-black text-black">{guide.amount}</strong>
                </div>
              </div>

              {/* Número de Guía y Código QR Extra Grande */}
              <div className="border-2 border-black p-2 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-black text-[9px] text-gray-700 uppercase block">NÚMERO DE GUÍA #</span>
                  <strong className="text-2xl font-black font-mono tracking-tight block">{guide.guideNumber}</strong>
                  <div className="text-[10px] font-bold text-gray-700 mt-0.5">EMPRESA: {guide.company}</div>
                </div>
                {guide.qrDataUrl && (
                  <div className="border-2 border-black p-1 bg-white flex-shrink-0">
                    <img src={guide.qrDataUrl} alt="QR" className="w-24 h-24 min-w-[96px] min-h-[96px]" />
                  </div>
                )}
              </div>

              {/* Instrucción de Entrega */}
              <div className="border-2 border-black p-1.5 text-[9px] leading-tight">
                <strong className="block font-bold text-black">INSTRUCCIÓN DE ENTREGA:</strong>
                <p className="italic text-gray-800">{guide.guideNote}</p>
              </div>

              {/* Permitir Apertura Banner */}
              <div className="border-2 border-black py-1.5 text-center font-black text-xs tracking-[0.2em] bg-white">
                * * * PERMITIR APERTURA * * *
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
