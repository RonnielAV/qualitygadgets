'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Eye,
  MessageSquare,
  Search,
  Plus,
  Wand2,
  Users,
  RefreshCcw,
  Upload,
  Download,
  Calendar,
  Truck,
  Sparkles,
  CheckSquare,
  Square,
  Check,
  AlertCircle,
  Clock,
  ExternalLink,
  Edit2,
  Printer,
  X
} from 'lucide-react';
import QRCode from 'qrcode';
import * as XLSX from 'xlsx';
import { useStore, Order } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { CouriersModal } from '@/components/admin/CouriersModal';
import { PostSaleModal } from '@/components/admin/PostSaleModal';

const DEFAULT_SHIPPER_NAME = 'QUALITY GADGETS RD';
const DEFAULT_SHIPPER_ADDRESS = `Calle Plaza de la Cultura No. 304, El Millón.\nSANTO DOMINGO\nDISTRITO NACIONAL\nTEL: +1 (809) 316-0799\nSERVICIO NACIONAL PREMIUM`;
const DEFAULT_GUIDE_NOTE =
  'Antes de salir 🚚, debes llamar al cliente 📞 • Confirmar disponibilidad • Validar dirección • Confirmar método de pago 💰. MUCHAS GRACIAS!';

export function OrdersTable() {
  const {
    orders,
    couriers,
    products,
    footerConfig,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    bulkUpdateOrderStatus,
    deleteSelectedOrders,
    assignCourierToOrder,
    bulkAssignCourier,
    updateOrderDeliveryDate,
  } = useStore();

  const dynamicShipperName = footerConfig?.companyName || 'QUALITY GADGETS RD';
  const dynamicShipperAddress = [
    footerConfig?.address || 'Piantini, Santo Domingo, D.N.',
    `TEL: ${footerConfig?.phone || '+1 (809) 316-0799'}`,
    'SERVICIO NACIONAL'
  ].filter(Boolean).join('\n');

  const safeOrders = orders || [];
  const safeCouriers = couriers || [];
  const safeProducts = products || [];

  // Filter States
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCourierFilter, setSelectedCourierFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isCouriersModalOpen, setIsCouriersModalOpen] = useState(false);
  const [postSaleOrder, setPostSaleOrder] = useState<Order | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Single / Bulk Thermal Guide Printing States
  const [printModalOrder, setPrintModalOrder] = useState<Order | null>(null);
  const [printQRDataUrl, setPrintQRDataUrl] = useState<string>('');
  const [bulkPrintOrders, setBulkPrintOrders] = useState<{ order: Order; qr: string }[]>([]);

  // Magic Paste / Unstructured Text State
  const [magicPasteText, setMagicPasteText] = useState('');
  const [showMagicPaste, setShowMagicPaste] = useState(false);

  // Manual Form States
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Distrito Nacional');
  const [address, setAddress] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [assignedCourierId, setAssignedCourierId] = useState(safeCouriers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(safeProducts[0]?.id || '');
  const [quantity, setQuantity] = useState(1);

  // Helper: Generar QR de WhatsApp para el destinatario con alta resolución (500px)
  const generateQRForOrder = async (ord: Order): Promise<string> => {
    let cleanPhone = (ord.phone || '').replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '1' + cleanPhone;
    const clientName = ord.customerName || ord.customer?.name || 'Cliente';
    const content = (ord.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Gadget Tecnológico';
    const amount = `RD$ ${(ord.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}`;
    const courier = ord.courierName || 'Quality Gadgets RD';
    const message = `¡Hola ${clientName}! Soy de ${courier}.\n\nTe escribo para informarte que ya estoy en camino a entregarte tu pedido.\n\n*Detalles de su pedido:*\n- *Guía:* ${ord.orderNumber}\n- *Contenido:* ${content}\n- *Monto a Pagar:* ${amount}\n\nPor favor, confírmame si te encuentras disponible para recibirlo en la dirección indicada. ¡Muchas gracias!`;
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

  // Abrir modal de impresión individual para una sola orden
  const handleOpenPrintSingleOrder = async (ord: Order) => {
    const qr = await generateQRForOrder(ord);
    setPrintQRDataUrl(qr);
    setPrintModalOrder(ord);
    setBulkPrintOrders([]);
  };

  // Imprimir directamente la orden individual abierta
  const handlePrintSingleNow = () => {
    window.print();
  };

  // Imprimir guías seleccionadas en bloque
  const handleBulkPrintSelected = async () => {
    const selectedOrders = safeOrders.filter((o) => selectedOrderIds.includes(o.id));
    if (selectedOrders.length === 0) return;
    const items = await Promise.all(
      selectedOrders.map(async (ord) => ({
        order: ord,
        qr: await generateQRForOrder(ord),
      }))
    );
    setBulkPrintOrders(items);
    setPrintModalOrder(null);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Extracción inteligente de texto desestructurado (Magic Paste)
  const handleMagicExtraction = () => {
    if (!magicPasteText.trim()) return;

    let extractedName = '';
    let extractedPhone = '';
    let extractedCity = 'Distrito Nacional';
    let extractedAddress = '';
    let extractedAmount = '';

    const lines = magicPasteText.split('\n');
    lines.forEach((line) => {
      const lower = line.toLowerCase();
      if (lower.includes('nombre:') || lower.includes('cliente:')) {
        extractedName = line.split(':')[1]?.trim() || '';
      } else if (lower.includes('teléfono:') || lower.includes('telefono:') || lower.includes('celular:') || lower.includes('whatsapp:')) {
        extractedPhone = line.split(':')[1]?.trim() || '';
      } else if (lower.includes('dirección:') || lower.includes('direccion:')) {
        extractedAddress = line.split(':')[1]?.trim() || '';
      } else if (lower.includes('sector:') || lower.includes('ciudad:')) {
        extractedCity = line.split(':')[1]?.trim() || '';
      } else if (lower.includes('monto:') || lower.includes('total:') || lower.includes('precio:')) {
        const num = line.match(/\d+[\d,.]*/);
        if (num) extractedAmount = num[0].replace(/,/g, '');
      }
    });

    if (!extractedPhone) {
      const phoneMatch = magicPasteText.match(/(\+?1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
      if (phoneMatch) extractedPhone = phoneMatch[0];
    }
    if (!extractedAmount) {
      const amountMatch = magicPasteText.match(/RD\$?\s*(\d{1,3}(,\d{3})*(\.\d{2})?|\d+)/i);
      if (amountMatch) extractedAmount = amountMatch[1].replace(/,/g, '');
    }

    if (extractedName) setCustomerName(extractedName);
    if (extractedPhone) setPhone(extractedPhone);
    if (extractedAddress) setAddress(extractedAddress);
    if (extractedCity) setCity(extractedCity);
    if (extractedAmount) setTotalAmount(extractedAmount);

    setShowMagicPaste(false);
    setMagicPasteText('');
  };

  const handleOpenNewOrderModal = () => {
    setEditingOrder(null);
    setCustomerName('');
    setPhone('');
    setCity('Distrito Nacional');
    setAddress('');
    setTotalAmount('1495');
    setIsNewOrderModalOpen(true);
  };

  const handleEditOrder = (ord: Order) => {
    setEditingOrder(ord);
    setCustomerName(ord.customerName || ord.customer?.name || '');
    setPhone(ord.phone || '');
    setCity(ord.city || ord.province || 'Distrito Nacional');
    setAddress(ord.address || '');
    setTotalAmount(String(ord.totalDop || '0'));
    setAssignedCourierId(ord.courierId || safeCouriers[0]?.id || '');
    setIsNewOrderModalOpen(true);
  };

  const handleSaveManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(totalAmount) || 0;
    const courier = safeCouriers.find((c) => c.id === assignedCourierId);
    const prod = safeProducts.find((p) => p.id === selectedProductId) || safeProducts[0];

    if (editingOrder) {
      useStore.setState((state) => ({
        orders: (state.orders || []).map((o) =>
          o.id === editingOrder.id
            ? {
                ...o,
                customerName,
                phone,
                city,
                address,
                totalDop: amountNum,
                courierId: assignedCourierId,
                courierName: courier?.name || '',
                updatedAt: new Date().toISOString(),
              }
            : o
        ),
      }));
    } else {
      const nextNum = `QG-${Math.floor(1000 + Math.random() * 9000)}`;
      addOrder({
        orderNumber: nextNum,
        customerName,
        phone,
        email: `${phone.replace(/\D/g, '')}@qualitygadgetsrd.com`,
        province: city,
        city,
        address,
        items: [
          {
            productId: prod?.id || 'prod-custom',
            variantId: prod?.variants?.[0]?.id || 'var-custom',
            title: prod?.title || 'Gadget',
            variantTitle: prod?.variants?.[0]?.title || 'Estándar',
            priceDop: amountNum,
            quantity,
          },
        ],
        subtotalDop: amountNum,
        shippingDop: 0,
        discountDop: 0,
        totalDop: amountNum,
        paymentMethod: 'contra_entrega_efectivo',
        status: 'En Proceso',
        courierId: assignedCourierId,
        courierName: courier?.name || '',
        courierCost: 300,
        deliveryDate: new Date().toISOString().split('T')[0],
      });
    }

    setIsNewOrderModalOpen(false);
  };

  // Filtrado Avanzado
  const filteredOrders = safeOrders.filter((ord) => {
    const statusLower = (ord.status || '').toLowerCase();
    if (filterStatus === 'en_proceso' && statusLower !== 'en proceso') return false;
    if (filterStatus === 'pendiente' && statusLower !== 'pendiente') return false;
    if (filterStatus === 'entregado' && statusLower !== 'entregado') return false;
    if (filterStatus === 'cancelado' && !statusLower.includes('cancel')) return false;
    if (filterStatus === 'postventa' && !statusLower.includes('cambio') && !statusLower.includes('devolu') && !ord.postSale?.type) return false;

    if (selectedCourierFilter !== 'all') {
      if (selectedCourierFilter === 'unassigned' && ord.courierId) return false;
      if (selectedCourierFilter !== 'unassigned' && ord.courierId !== selectedCourierFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = (ord.orderNumber || '').toLowerCase().includes(q);
      const matchName = (ord.customerName || ord.customer?.name || '').toLowerCase().includes(q);
      const matchPhone = (ord.phone || '').toLowerCase().includes(q);
      const matchCity = (ord.city || ord.province || '').toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone && !matchCity) return false;
    }

    if (startDate) {
      const orderDate = ord.createdAt?.split('T')[0] || '';
      if (orderDate < startDate) return false;
    }
    if (endDate) {
      const orderDate = ord.createdAt?.split('T')[0] || '';
      if (orderDate > endDate) return false;
    }

    return true;
  });

  // Selección múltiple
  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    }
  };

  // Cambio de estado masivo
  const handleBulkStatusChange = (newStatus: string) => {
    if (!newStatus || selectedOrderIds.length === 0) return;
    bulkUpdateOrderStatus(selectedOrderIds, newStatus as any);
    setSelectedOrderIds([]);
  };

  // Asignación de mensajero masiva
  const handleBulkCourierAssign = (courierId: string) => {
    if (!courierId || selectedOrderIds.length === 0) return;
    bulkAssignCourier(selectedOrderIds, courierId);
    setSelectedOrderIds([]);
  };

  // Eliminación masiva
  const handleBulkDelete = () => {
    if (confirm(`¿Eliminar permanentemente los ${selectedOrderIds.length} pedidos seleccionados?`)) {
      deleteSelectedOrders(selectedOrderIds);
      setSelectedOrderIds([]);
    }
  };

  // Exportar a Excel
  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      alert('No hay pedidos para exportar.');
      return;
    }
    const rows = filteredOrders.map((o) => ({
      'No. Pedido': o.orderNumber,
      'Fecha Creación': o.createdAt?.split('T')[0] || '',
      'Fecha Entrega': o.deliveryDate || '',
      'Cliente': o.customerName || o.customer?.name || 'Cliente',
      'Teléfono': o.phone,
      'Dirección': o.address,
      'Ciudad/Sector': o.city || o.province,
      'Productos': (o.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', '),
      'Total DOP': o.totalDop,
      'Mensajero': o.courierName || 'Sin asignar',
      'Estado': o.status,
      'Notas': o.notes || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos_QualityGadgets');
    XLSX.writeFile(wb, `Pedidos_QualityGadgetsRD_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Mensaje Inteligente por WhatsApp (Smart WA)
  const sendSmartWhatsApp = (ord: Order) => {
    const cleanPhone = (ord.phone || '').replace(/\D/g, '');
    const clientName = ord.customerName || ord.customer?.name || 'Cliente';
    const content = (ord.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'su compra';
    const msg = `¡Hola ${clientName}! 👋 Te escribimos de *QUALITY GADGETS RD* para informarte que tu pedido (${content}) con la guía *#${ord.orderNumber}* está listo y en camino. 🚚\n\n💰 *Monto a Pagar al recibir:* RD$ ${(ord.totalDop || 0).toLocaleString('es-DO')}\n📍 *Dirección de Entrega:* ${ord.address}, ${ord.city || ord.province}\n\nPor favor, confírmanos si te encuentras disponible para recibir tu entrega hoy. ¡Muchas gracias! ✨`;
    window.open(`https://api.whatsapp.com/send?phone=1${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Mensaje Win-Back de Recuperación de Venta
  const sendWinBackWhatsApp = (ord: Order) => {
    const cleanPhone = (ord.phone || '').replace(/\D/g, '');
    const clientName = ord.customerName || ord.customer?.name || 'Cliente';
    const msg = `¡Hola ${clientName}! 👋 Te escribimos de *QUALITY GADGETS RD*. Lamentamos que no hayas podido recibir tu pedido *#${ord.orderNumber}*. Si deseas reprogramarlo para otra fecha o cambiar la dirección de entrega, con gusto te ayudamos. ¡Estamos siempre a tu orden! ✨`;
    window.open(`https://api.whatsapp.com/send?phone=1${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6 text-xs text-text-pure">
      {/* Barra de Acciones y Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border border-dark-border bg-dark-surface p-5 shadow-xl print:hidden">
        <div className="flex flex-wrap items-center gap-3">
          <PrimaryButton
            type="button"
            variant="primary"
            onClick={handleOpenNewOrderModal}
            className="py-2.5 px-4 text-xs font-black shadow-glow-purple cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Nuevo Pedido Manual</span>
          </PrimaryButton>

          <button
            type="button"
            onClick={() => setIsCouriersModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-black text-emerald-400 hover:bg-emerald-900/50 transition-all cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>Gestor Mensajeros ({safeCouriers.length})</span>
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-obsidian px-4 py-2.5 text-xs font-bold text-text-muted hover:text-white hover:border-brand-cyan transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Excel</span>
          </button>
        </div>

        {/* Acciones Masivas cuando hay seleccionados */}
        {selectedOrderIds.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 bg-brand-indigo/40 border border-brand-ultraviolet/40 rounded-2xl p-2 px-3 animate-pulse">
            <span className="font-bold text-white text-xs">{selectedOrderIds.length} seleccionados:</span>

            <button
              type="button"
              onClick={handleBulkPrintSelected}
              className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-ultraviolet px-3 py-1.5 text-xs font-black text-dark-obsidian shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
              title="Imprimir guías seleccionadas"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir Guías ({selectedOrderIds.length})</span>
            </button>

            <select
              onChange={(e) => handleBulkStatusChange(e.target.value)}
              defaultValue=""
              className="rounded-xl border border-dark-border bg-dark-obsidian px-2.5 py-1 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            >
              <option value="" disabled>Cambiar Estado...</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Entregado">Entregado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Entrega para otro día">Para otro día</option>
              <option value="Cancelado (Devolución)">Cancelado</option>
            </select>

            <select
              onChange={(e) => handleBulkCourierAssign(e.target.value)}
              defaultValue=""
              className="rounded-xl border border-dark-border bg-dark-obsidian px-2.5 py-1 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            >
              <option value="" disabled>Asignar Mensajero...</option>
              {safeCouriers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleBulkDelete}
              className="p-1.5 rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 text-brand-magenta hover:bg-brand-magenta/20 transition-all cursor-pointer"
              title="Eliminar seleccionados"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Toolbar con Pestañas de Estado, Búsqueda y Fechas */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-5 space-y-4 shadow-md print:hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por cliente, teléfono, ciudad o No. de guía (QG-####)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-dark-border bg-dark-obsidian py-2.5 pl-11 pr-4 text-xs font-semibold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: `Todos (${safeOrders.length})` },
              { id: 'en_proceso', label: 'En Proceso' },
              { id: 'pendiente', label: 'Pendientes' },
              { id: 'postventa', label: 'Postventa' },
              { id: 'entregado', label: 'Entregados' },
              { id: 'cancelado', label: 'Cancelados' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'bg-gradient-to-r from-brand-ultraviolet to-brand-magenta text-white font-black shadow-glow-purple'
                    : 'border border-dark-border bg-dark-obsidian text-text-muted hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros Secundarios: Mensajeros y Fechas */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-dark-border/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-muted flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-brand-cyan" />
              <span>Mensajero:</span>
            </span>
            <select
              value={selectedCourierFilter}
              onChange={(e) => setSelectedCourierFilter(e.target.value)}
              className="rounded-xl border border-dark-border bg-dark-obsidian px-3 py-1.5 font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los mensajeros</option>
              <option value="unassigned">Sin asignar</option>
              {safeCouriers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-text-muted flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-brand-magenta" />
              <span>Desde:</span>
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-dark-border bg-dark-obsidian px-2.5 py-1 font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            />
            <span className="font-bold text-text-muted">Hasta:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-dark-border bg-dark-obsidian px-2.5 py-1 font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE PEDIDOS */}
      <div className="overflow-hidden rounded-3xl border border-dark-border bg-dark-surface shadow-2xl print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border bg-dark-elevated/80 text-[11px] font-black uppercase tracking-wider text-text-muted">
                <th className="px-4 py-3.5 text-center w-10">
                  <input
                    type="checkbox"
                    checked={filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    onChange={toggleSelectAll}
                    className="rounded accent-brand-ultraviolet h-4 w-4 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5">Pedido / Guía</th>
                <th className="px-5 py-3.5">Fecha Entrega</th>
                <th className="px-5 py-3.5">Cliente & Destino</th>
                <th className="px-5 py-3.5">Total & Flete</th>
                <th className="px-5 py-3.5">Mensajero</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-text-muted">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const customerName = ord?.customerName || ord?.customer?.name || 'Cliente General';
                  const orderNum = ord?.orderNumber || 'QG-0000';
                  const phone = ord?.phone || '8090000000';
                  const totalDop = ord?.totalDop ?? 0;
                  const city = ord?.city || ord?.province || 'Distrito Nacional';
                  const isCanceled = (ord?.status || '').toLowerCase().includes('cancel') || (ord?.status || '').toLowerCase().includes('devolu');
                  const isSelected = selectedOrderIds.includes(ord.id);

                  return (
                    <tr key={ord.id} className={`hover:bg-dark-elevated/40 transition-colors ${isSelected ? 'bg-brand-indigo/20' : ''}`}>
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(ord.id)}
                          className="rounded accent-brand-ultraviolet h-4 w-4 cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <strong className="font-mono font-black text-brand-cyan text-sm block">{orderNum}</strong>
                        <span className="text-[10px] text-text-muted block">
                          {ord?.createdAt ? new Date(ord.createdAt).toLocaleDateString('es-DO') : 'Reciente'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <input
                          type="date"
                          value={ord?.deliveryDate || ''}
                          onChange={(e) => updateOrderDeliveryDate(ord.id, e.target.value)}
                          className="rounded-lg border border-dark-border bg-dark-obsidian p-1 text-[11px] font-bold text-white cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <strong className="text-white block font-bold">{customerName}</strong>
                        <span className="text-[11px] text-text-muted block">{phone}</span>
                        <span className="text-[10px] text-brand-cyan block truncate max-w-xs">{city} • {ord?.address}</span>

                        {/* Chip Postventa si aplica */}
                        {ord?.postSale?.type && (
                          <span className="inline-flex items-center gap-1 mt-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[9px] font-black text-amber-400">
                            <RefreshCcw className="h-3 w-3" />
                            <span>{ord.postSale.type === 'change' ? 'CAMBIO' : 'DEVOLUCIÓN'}</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-black text-white">
                        <div>RD$ {totalDop.toLocaleString('es-DO')}</div>
                        <div className="text-[10px] text-purple-400 font-bold">
                          Envío: RD$ {ord?.courierCost || 300}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={ord?.courierId || ''}
                          onChange={(e) => assignCourierToOrder(ord.id, e.target.value)}
                          className="rounded-xl border border-dark-border bg-dark-obsidian px-2.5 py-1 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer max-w-[150px]"
                        >
                          <option value="">Sin asignar</option>
                          {safeCouriers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={ord?.status || 'En Proceso'}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="rounded-xl border border-dark-border bg-dark-obsidian px-2.5 py-1 text-xs font-bold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
                        >
                          <option value="En Proceso">En Proceso</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Pendiente">Pendiente</option>
                          <option value="Entrega para otro día">Para otro día</option>
                          <option value="Solicitud de cambio recibida">Solicitud Cambio</option>
                          <option value="Solicitud de devolución recibida">Solicitud Devolución</option>
                          <option value="Pendiente de recoger">Pendiente Recoger</option>
                          <option value="Cambio en ruta">Cambio en Ruta</option>
                          <option value="Cancelado (Devolución)">Cancelado</option>
                        </select>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {/* Botón Imprimir Guía Térmica Individual */}
                          <button
                            type="button"
                            onClick={() => handleOpenPrintSingleOrder(ord)}
                            className="p-1.5 rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan hover:bg-brand-cyan/20 transition-all cursor-pointer shadow-sm"
                            title="Imprimir Guía Térmica 4x6 Individual"
                          >
                            <Printer className="h-3.5 w-3.5" />
                          </button>

                          {/* Botón Editar */}
                          <button
                            type="button"
                            onClick={() => handleEditOrder(ord)}
                            className="p-1.5 rounded-xl border border-dark-border bg-dark-elevated text-text-muted hover:text-white hover:border-brand-cyan transition-all cursor-pointer"
                            title="Editar Ficha"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>

                          {/* Botón Caso Postventa */}
                          <button
                            type="button"
                            onClick={() => setPostSaleOrder(ord)}
                            className="p-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                            title="Gestionar Cambio o Devolución"
                          >
                            <RefreshCcw className="h-3.5 w-3.5" />
                          </button>

                          {/* Botón Smart WA */}
                          {!isCanceled ? (
                            <button
                              type="button"
                              onClick={() => sendSmartWhatsApp(ord)}
                              className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-black text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-sm"
                              title="Confirmación Inteligente WhatsApp"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>WA</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => sendWinBackWhatsApp(ord)}
                              className="inline-flex items-center gap-1 rounded-xl border border-brand-magenta/40 bg-brand-magenta/10 px-2 py-1.5 text-xs font-bold text-brand-magenta hover:bg-brand-magenta/20 transition-all cursor-pointer"
                              title="Recuperar Venta WhatsApp"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                              <span>Win-Back</span>
                            </button>
                          )}

                          {/* Botón Eliminar */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar orden #${orderNum}?`)) deleteOrder(ord.id);
                            }}
                            className="p-1.5 rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 text-brand-magenta hover:bg-brand-magenta/20 transition-all cursor-pointer"
                            title="Eliminar Pedido"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE IMPRESIÓN INDIVIDUAL DE GUÍA TÉRMICA (4x6 PULGADAS) */}
      {printModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md print:hidden">
          <div className="w-full max-w-lg rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5 text-brand-cyan" />
                <h3 className="text-base font-black text-white">
                  Guía Térmica 4x6 — {printModalOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPrintModalOrder(null)}
                className="text-text-muted hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vista Previa de la Etiqueta Térmica Que Cubre Toda la Etiqueta */}
            <div className="flex justify-center overflow-y-auto max-h-[65vh] p-3 bg-dark-obsidian/60 rounded-2xl border border-dark-border">
              <div className="bg-white text-black p-3.5 font-sans border-2 border-black space-y-2 w-[390px] shadow-2xl flex flex-col justify-between">
                <div className="text-center pb-1 border-b-2 border-black">
                  <strong className="text-xl font-black tracking-widest text-[#3F35FE] block">
                    QUALITY GADGETS RD
                  </strong>
                </div>

                <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black text-[11px]">
                  <div className="p-2 space-y-0.5">
                    <span className="font-black text-[9px] text-gray-700 uppercase block">REMITENTE:</span>
                    <strong className="block font-bold text-xs">{DEFAULT_SHIPPER_NAME}</strong>
                    <p className="text-[10px] text-gray-800 whitespace-pre-line leading-tight">{DEFAULT_SHIPPER_ADDRESS}</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    <span className="font-black text-[9px] text-gray-700 uppercase block">DESTINATARIO:</span>
                    <strong className="block font-bold text-sm text-black">{printModalOrder.customerName || printModalOrder.customer?.name || 'Cliente'}</strong>
                    <p className="text-[11px] text-gray-800 leading-tight">
                      {printModalOrder.address}<br />
                      {printModalOrder.city || printModalOrder.province || 'Distrito Nacional'}<br />
                      <span className="font-black text-black">TEL: {printModalOrder.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="border-2 border-black p-2 text-[11px]">
                  <span className="font-black text-[9px] text-gray-700 uppercase block">CONTENIDO:</span>
                  <strong className="text-xs font-bold block">
                    {(printModalOrder.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Gadget Tecnológico'}
                  </strong>
                </div>

                <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black p-2 text-[11px]">
                  <div>
                    <span className="font-black text-[9px] text-gray-700 uppercase block">VALOR DECLARADO:</span>
                    <strong className="text-sm font-black">RD$ {(printModalOrder.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="pl-2">
                    <span className="font-black text-[9px] text-gray-700 uppercase block">RECAUDO:</span>
                    <strong className="text-sm font-black text-black">RD$ {(printModalOrder.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>

                {/* Sección de Número de Guía y Código QR Extra Grande */}
                <div className="border-2 border-black p-2.5 flex items-center justify-between gap-3 bg-gray-50/50">
                  <div className="space-y-1">
                    <span className="font-black text-[10px] text-gray-700 uppercase block">NÚMERO DE GUÍA #</span>
                    <strong className="text-3xl font-black font-mono tracking-tight block">{printModalOrder.orderNumber}</strong>
                    <div className="text-[11px] font-bold text-gray-800">
                      EMPRESA: {printModalOrder.courierName || 'Mensajero Quality Gadgets RD'}
                    </div>
                  </div>
                  {printQRDataUrl && (
                    <div className="border-2 border-black p-1 bg-white flex-shrink-0 shadow-sm">
                      <img src={printQRDataUrl} alt="QR WhatsApp" className="w-28 h-28 min-w-[112px] min-h-[112px]" />
                    </div>
                  )}
                </div>

                <div className="border-2 border-black p-2 text-[10px] leading-tight">
                  <strong className="block font-bold text-black">INSTRUCCIÓN DE ENTREGA:</strong>
                  <p className="italic text-gray-800 mt-0.5">{printModalOrder.notes || DEFAULT_GUIDE_NOTE}</p>
                </div>

                <div className="border-2 border-black py-2 text-center font-black text-sm tracking-[0.2em] bg-white">
                  * * * PERMITIR APERTURA * * *
                </div>
              </div>
            </div>

            {/* Botones del Modal */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-dark-border">
              <button
                type="button"
                onClick={() => setPrintModalOrder(null)}
                className="rounded-xl border border-dark-border bg-dark-obsidian px-4 py-2.5 font-bold text-text-muted hover:text-white"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handlePrintSingleNow}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-ultraviolet to-brand-magenta px-6 py-2.5 font-black text-white shadow-glow-purple hover:opacity-90 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Térmica 4x6</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ÁREA DE IMPRESIÓN AISLADA QUE CUBRE TODA LA ETIQUETA 4x6 (#printArea) */}
      <div id="printArea" className="hidden print:block">
        {printModalOrder ? (
          <div className="sheet">
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
                  <strong className="block font-bold text-[11px] leading-tight">{dynamicShipperName}</strong>
                  <p className="text-[9px] text-gray-800 whitespace-pre-line leading-tight">{dynamicShipperAddress}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  <span className="font-black text-[8px] text-gray-700 uppercase block">DESTINATARIO:</span>
                  <strong className="block font-bold text-xs text-black leading-tight">{printModalOrder.customerName || printModalOrder.customer?.name || 'Cliente'}</strong>
                  <p className="text-[10px] text-gray-800 leading-tight">
                    {printModalOrder.address}<br />
                    {printModalOrder.city || printModalOrder.province || 'Distrito Nacional'}<br />
                    <span className="font-black text-black">TEL: {printModalOrder.phone}</span>
                  </p>
                </div>
              </div>

              {/* Contenido */}
              <div className="border-2 border-black p-1.5 text-[10px]">
                <span className="font-black text-[8px] text-gray-700 uppercase block">CONTENIDO:</span>
                <strong className="text-[11px] leading-tight block">
                  {(printModalOrder.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Gadget Tecnológico'}
                </strong>
              </div>

              {/* Valores */}
              <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black p-1.5 text-[10px]">
                <div>
                  <span className="font-black text-[8px] text-gray-700 uppercase block">VALOR DECLARADO:</span>
                  <strong className="text-xs font-black">RD$ {(printModalOrder.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                </div>
                <div className="pl-1.5">
                  <span className="font-black text-[8px] text-gray-700 uppercase block">RECAUDO:</span>
                  <strong className="text-xs font-black text-black">RD$ {(printModalOrder.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                </div>
              </div>

              {/* Número de Guía y QR Extra Grande */}
              <div className="border-2 border-black p-2 flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-black text-[9px] text-gray-700 uppercase block">NÚMERO DE GUÍA #</span>
                  <strong className="text-2xl font-black font-mono tracking-tight block">{printModalOrder.orderNumber}</strong>
                  <div className="text-[10px] font-bold text-gray-700">
                    EMPRESA: {printModalOrder.courierName || 'Mensajero Quality Gadgets RD'}
                  </div>
                </div>
                {printQRDataUrl && (
                  <div className="border-2 border-black p-1 bg-white flex-shrink-0">
                    <img src={printQRDataUrl} alt="QR" className="w-24 h-24 min-w-[96px] min-h-[96px]" />
                  </div>
                )}
              </div>

              {/* Instrucción de Entrega */}
              <div className="border-2 border-black p-1.5 text-[9px] leading-tight">
                <strong className="block font-bold text-black">INSTRUCCIÓN DE ENTREGA:</strong>
                <p className="italic text-gray-800">{printModalOrder.notes || DEFAULT_GUIDE_NOTE}</p>
              </div>

              {/* Permitir Apertura Banner */}
              <div className="border-2 border-black py-1.5 text-center font-black text-xs tracking-[0.2em] bg-white">
                * * * PERMITIR APERTURA * * *
              </div>
            </div>
          </div>
        ) : bulkPrintOrders.length > 0 ? (
          bulkPrintOrders.map(({ order, qr }, idx) => (
            <div key={idx} className="sheet" style={{ pageBreakAfter: idx < bulkPrintOrders.length - 1 ? 'always' : 'avoid' }}>
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
                    <strong className="block font-bold text-[11px] leading-tight">{dynamicShipperName}</strong>
                    <p className="text-[9px] text-gray-800 whitespace-pre-line leading-tight">{dynamicShipperAddress}</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <span className="font-black text-[8px] text-gray-700 uppercase block">DESTINATARIO:</span>
                    <strong className="block font-bold text-xs text-black leading-tight">{order.customerName || order.customer?.name || 'Cliente'}</strong>
                    <p className="text-[10px] text-gray-800 leading-tight">
                      {order.address}<br />
                      {order.city || order.province || 'Distrito Nacional'}<br />
                      <span className="font-black text-black">TEL: {order.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="border-2 border-black p-1.5 text-[10px]">
                  <span className="font-black text-[8px] text-gray-700 uppercase block">CONTENIDO:</span>
                  <strong className="text-[11px] leading-tight block">
                    {(order.items || []).map((i) => `${i.quantity}x ${i.title}`).join(', ') || 'Gadget Tecnológico'}
                  </strong>
                </div>

                {/* Valores */}
                <div className="grid grid-cols-2 border-2 border-black divide-x-2 divide-black p-1.5 text-[10px]">
                  <div>
                    <span className="font-black text-[8px] text-gray-700 uppercase block">VALOR DECLARADO:</span>
                    <strong className="text-xs font-black">RD$ {(order.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div className="pl-1.5">
                    <span className="font-black text-[8px] text-gray-700 uppercase block">RECAUDO:</span>
                    <strong className="text-xs font-black text-black">RD$ {(order.totalDop || 0).toLocaleString('es-DO', { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>

                {/* Número de Guía y QR Extra Grande */}
                <div className="border-2 border-black p-2 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="font-black text-[9px] text-gray-700 uppercase block">NÚMERO DE GUÍA #</span>
                    <strong className="text-2xl font-black font-mono tracking-tight block">{order.orderNumber}</strong>
                    <div className="text-[10px] font-bold text-gray-700">
                      EMPRESA: {order.courierName || 'Mensajero Quality Gadgets RD'}
                    </div>
                  </div>
                  {qr && (
                    <div className="border-2 border-black p-1 bg-white flex-shrink-0">
                      <img src={qr} alt="QR" className="w-24 h-24 min-w-[96px] min-h-[96px]" />
                    </div>
                  )}
                </div>

                {/* Instrucción de Entrega */}
                <div className="border-2 border-black p-1.5 text-[9px] leading-tight">
                  <strong className="block font-bold text-black">INSTRUCCIÓN DE ENTREGA:</strong>
                  <p className="italic text-gray-800">{order.notes || DEFAULT_GUIDE_NOTE}</p>
                </div>

                {/* Permitir Apertura Banner */}
                <div className="border-2 border-black py-1.5 text-center font-black text-xs tracking-[0.2em] bg-white">
                  * * * PERMITIR APERTURA * * *
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>

      {/* MODAL CREAR / EDITAR PEDIDO */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm print:hidden">
          <div className="w-full max-w-lg rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dark-border pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="h-5 w-5 text-brand-cyan" />
                <span>{editingOrder ? 'Editar Ficha de Pedido' : 'Nuevo Pedido Manual'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMagicPaste(!showMagicPaste)}
                className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>{showMagicPaste ? 'Ocultar Magic Paste' : 'Pegar WhatsApp (Magic Paste)'}</span>
              </button>
            </div>

            {showMagicPaste && (
              <div className="rounded-2xl border border-brand-cyan/40 bg-brand-cyan/5 p-4 space-y-3">
                <label className="text-[11px] font-bold text-brand-cyan flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Pega aquí el mensaje desestructurado de WhatsApp:</span>
                </label>
                <textarea
                  rows={3}
                  value={magicPasteText}
                  onChange={(e) => setMagicPasteText(e.target.value)}
                  placeholder="Ej: Hola, quiero un altavoz. Soy Carlos Gómez, Cel: 809-555-1234, Calle Sol #45, Naco. Total RD$ 1,495..."
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-2.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleMagicExtraction}
                  className="rounded-xl bg-brand-cyan px-4 py-2 text-xs font-black text-dark-obsidian shadow-glow-cyan hover:bg-cyan-300 transition-all cursor-pointer"
                >
                  Extraer Datos Automáticamente
                </button>
              </div>
            )}

            <form onSubmit={handleSaveManualOrder} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Ronniel Aybar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="809-316-0799"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Ciudad / Sector</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="Distrito Nacional">Distrito Nacional</option>
                    <option value="Santo Domingo Este">Santo Domingo Este</option>
                    <option value="Santo Domingo Norte">Santo Domingo Norte</option>
                    <option value="Santo Domingo Oeste">Santo Domingo Oeste</option>
                    <option value="Los Alcarrizos">Los Alcarrizos</option>
                    <option value="Santiago">Santiago</option>
                    <option value="La Romana">La Romana</option>
                    <option value="Punta Cana / Bávaro">Punta Cana / Bávaro</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Mensajero Asignado</label>
                  <select
                    value={assignedCourierId}
                    onChange={(e) => setAssignedCourierId(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  >
                    {safeCouriers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Dirección de Entrega</label>
                <textarea
                  rows={2}
                  placeholder="Calle, número, edificio, referencia..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="font-bold text-text-muted">Producto</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  >
                    {safeProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Monto a Cobrar (RD$) *</label>
                <input
                  type="number"
                  required
                  placeholder="1495"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-mono font-bold text-emerald-400 focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="rounded-xl border border-dark-border bg-dark-obsidian px-5 py-2.5 font-bold text-text-muted hover:text-white"
                >
                  Cancelar
                </button>
                <PrimaryButton type="submit" variant="primary" className="py-2.5 px-6 font-black shadow-glow-purple cursor-pointer">
                  <span>{editingOrder ? 'Actualizar Pedido' : 'Guardar Pedido'}</span>
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GESTOR DE MENSAJEROS */}
      <CouriersModal
        isOpen={isCouriersModalOpen}
        onClose={() => setIsCouriersModalOpen(false)}
      />

      {/* MODAL GESTOR DE POSTVENTA */}
      <PostSaleModal
        order={postSaleOrder}
        isOpen={!!postSaleOrder}
        onClose={() => setPostSaleOrder(null)}
      />
    </div>
  );
}
