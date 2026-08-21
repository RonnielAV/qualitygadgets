'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  DollarSign,
  Truck,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useStore, Order } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function LogisticsReportsView() {
  const { orders, couriers } = useStore();
  const safeOrders = orders || [];
  const safeCouriers = couriers || [];

  const [reportType, setReportType] = useState<'courier' | 'postsale' | 'sales'>('courier');
  const [selectedCourier, setSelectedCourier] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [baseRate, setBaseRate] = useState<number>(300);

  // Cálculo de tarifa por zona
  const calculateCourierFee = (order: Order): number => {
    if (order.courierCost && order.courierCost > 0) return order.courierCost;
    const loc = `${order.city || ''} ${order.province || ''} ${order.address || ''}`.toLowerCase();
    if (
      loc.includes('haina') ||
      loc.includes('san cristobal') ||
      loc.includes('boca chica') ||
      loc.includes('pedro brand') ||
      loc.includes('bávaro') ||
      loc.includes('punta cana') ||
      loc.includes('santiago')
    ) {
      return 450;
    }
    if (
      loc.includes('este') ||
      loc.includes('sde') ||
      loc.includes('san isidro') ||
      loc.includes('norte') ||
      loc.includes('sdn') ||
      loc.includes('villa mella') ||
      loc.includes('oeste') ||
      loc.includes('sdo') ||
      loc.includes('herrera') ||
      loc.includes('caobas') ||
      loc.includes('alcarrizos')
    ) {
      return 350;
    }
    return baseRate;
  };

  // Filtrado de pedidos según reporte
  const filteredOrders = safeOrders.filter((ord) => {
    const statusLower = (ord.status || '').toLowerCase();

    if (reportType === 'courier') {
      // Solo entregados o cobrados
      const isDelivered =
        statusLower === 'entregado' ||
        statusLower.includes('completado') ||
        statusLower.includes('completada');
      if (!isDelivered) return false;
    } else if (reportType === 'postsale') {
      if (!ord.postSale?.type && !statusLower.includes('cambio') && !statusLower.includes('devolu')) {
        return false;
      }
    }

    if (selectedCourier !== 'all' && ord.courierId !== selectedCourier) {
      return false;
    }

    const orderDate = ord.deliveryDate || ord.createdAt?.split('T')[0] || '';
    if (dateFrom && orderDate < dateFrom) return false;
    if (dateTo && orderDate > dateTo) return false;

    return true;
  });

  // Métricas
  const totalRecaudo = filteredOrders.reduce((sum, o) => sum + (o.totalDop || 0), 0);
  const totalPagoMensajeros = filteredOrders.reduce((sum, o) => sum + calculateCourierFee(o), 0);
  const gananciaNeta = Math.max(0, totalRecaudo - totalPagoMensajeros);

  const handleExportExcel = () => {
    if (filteredOrders.length === 0) {
      alert('No hay datos en el reporte para exportar.');
      return;
    }

    const rows = filteredOrders.map((o) => {
      const costoEnvio = calculateCourierFee(o);
      const neto = (o.totalDop || 0) - costoEnvio;
      return {
        'No. Pedido': o.orderNumber,
        'Fecha': o.deliveryDate || o.createdAt?.split('T')[0] || '',
        'Cliente': o.customerName || o.customer?.name || 'Cliente',
        'Teléfono': o.phone,
        'Ciudad/Sector': o.city || o.province,
        'Dirección': o.address,
        'Mensajero': o.courierName || 'Sin asignar',
        'Estado': o.status,
        'Recaudo Bruto (RD$)': o.totalDop || 0,
        'Pago Mensajero (RD$)': costoEnvio,
        'Neto Empresa (RD$)': neto,
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte_Logistica');
    XLSX.writeFile(wb, `Reporte_QualityGadgetsRD_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-8 text-xs text-text-pure">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <BarChart2 className="h-6 w-6 text-brand-cyan" />
            <span>Reportes Logísticos & Finanzas de Mensajería</span>
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Reconciliación de recaudos, costos por zona y liquidación neta para Quality Gadgets RD.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-obsidian px-5 py-2.5 text-xs font-black text-white hover:border-brand-cyan transition-all shadow-md cursor-pointer"
        >
          <Download className="h-4 w-4 text-brand-cyan" />
          <span>Exportar Reporte a Excel</span>
        </button>
      </div>

      {/* Toolbar de Filtros */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Tipo de Reporte</label>
            <select
              value={reportType}
              onChange={(e: any) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            >
              <option value="courier">Entregados vs Pago Mensajero</option>
              <option value="postsale">Cambios y Devoluciones (Postventa)</option>
              <option value="sales">Ventas Generales</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Filtrar por Mensajero</label>
            <select
              value={selectedCourier}
              onChange={(e) => setSelectedCourier(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los Mensajeros</option>
              {safeCouriers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Desde (Fecha)</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-muted">Hasta (Fecha)</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tarjetas KPI de Reconciliación */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-emerald-500/30 bg-dark-surface p-6 shadow-md space-y-2">
          <div className="flex items-center justify-between text-text-muted text-[11px] font-black uppercase">
            <span>Ingresos Brutos Recaudados</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">RD$ {totalRecaudo.toLocaleString('es-DO')}</p>
          <span className="text-[10px] text-emerald-400 font-bold block">{filteredOrders.length} paquetes auditados</span>
        </div>

        <div className="rounded-3xl border border-purple-500/30 bg-dark-surface p-6 shadow-md space-y-2">
          <div className="flex items-center justify-between text-text-muted text-[11px] font-black uppercase">
            <span>Pago Total Mensajería</span>
            <Truck className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400">RD$ {totalPagoMensajeros.toLocaleString('es-DO')}</p>
          <span className="text-[10px] text-text-muted font-bold block">Tarifas RD$ 300 / 350 / 450</span>
        </div>

        <div className="rounded-3xl border border-brand-cyan/40 bg-dark-surface p-6 shadow-md space-y-2">
          <div className="flex items-center justify-between text-text-muted text-[11px] font-black uppercase">
            <span>Ganancia Neta Empresa</span>
            <TrendingUp className="h-5 w-5 text-brand-cyan" />
          </div>
          <p className="text-2xl font-black text-brand-cyan">RD$ {gananciaNeta.toLocaleString('es-DO')}</p>
          <span className="text-[10px] text-brand-cyan font-bold block">Margen limpio post-entrega</span>
        </div>
      </div>

      {/* Tabla del Reporte */}
      <div className="overflow-x-auto rounded-3xl border border-dark-border bg-dark-surface shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-dark-border bg-dark-elevated/70 text-[11px] font-black uppercase text-text-muted">
            <tr>
              <th className="px-6 py-4">No. Pedido</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Cliente & Destino</th>
              <th className="px-6 py-4">Mensajero</th>
              <th className="px-6 py-4">Recaudo (Bruto)</th>
              <th className="px-6 py-4">Costo Envío</th>
              <th className="px-6 py-4">Neto Empresa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border/60 font-medium">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-text-muted">
                  No hay pedidos registrados con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => {
                const fee = calculateCourierFee(ord);
                const neto = (ord.totalDop || 0) - fee;

                return (
                  <tr key={ord.id} className="hover:bg-dark-elevated/40">
                    <td className="px-6 py-4 font-mono font-black text-brand-cyan">{ord.orderNumber}</td>
                    <td className="px-6 py-4 text-text-muted">{ord.deliveryDate || ord.createdAt?.split('T')[0] || ''}</td>
                    <td className="px-6 py-4">
                      <strong className="text-white block">{ord.customerName || ord.customer?.name}</strong>
                      <span className="text-[10px] text-text-muted block">{ord.city || ord.province}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{ord.courierName || 'Sin asignar'}</td>
                    <td className="px-6 py-4 font-black text-emerald-400">
                      RD$ {(ord.totalDop || 0).toLocaleString('es-DO')}
                    </td>
                    <td className="px-6 py-4 font-bold text-purple-400">
                      RD$ {fee.toLocaleString('es-DO')}
                    </td>
                    <td className="px-6 py-4 font-black text-brand-cyan">
                      RD$ {neto.toLocaleString('es-DO')}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
