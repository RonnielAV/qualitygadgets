'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Save, X, Phone, UserCheck } from 'lucide-react';
import { useStore, Courier } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface CouriersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CouriersModal({ isOpen, onClose }: CouriersModalProps) {
  const { couriers, orders, addCourier, updateCourier, deleteCourier } = useStore();
  const safeCouriers = couriers || [];
  const safeOrders = orders || [];

  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');

  if (!isOpen) return null;

  const handleEdit = (courier: Courier) => {
    setEditingCourier(courier);
    setCourierName(courier.name);
    setCourierPhone(courier.phone || '');
  };

  const handleReset = () => {
    setEditingCourier(null);
    setCourierName('');
    setCourierPhone('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierName.trim()) return;

    if (editingCourier) {
      updateCourier(editingCourier.id, {
        name: courierName.trim(),
        phone: courierPhone.trim(),
      });
    } else {
      addCourier({
        name: courierName.trim(),
        phone: courierPhone.trim(),
        active: true,
      });
    }
    handleReset();
  };

  const handleDelete = (courier: Courier) => {
    const assignedCount = safeOrders.filter((o) => o.courierId === courier.id).length;
    if (
      confirm(
        `¿Eliminar al mensajero "${courier.name}"? ${
          assignedCount > 0 ? `Tiene ${assignedCount} pedidos asignados que quedarán sin mensajero.` : ''
        }`
      )
    ) {
      deleteCourier(courier.id);
      if (editingCourier?.id === courier.id) handleReset();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-dark-border bg-dark-surface p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-dark-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Gestor de Mensajeros & Repartidores</h3>
              <p className="text-xs text-text-muted">Asigna pedidos a tus mensajeros de Quality Gadgets RD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-text-muted hover:bg-dark-obsidian hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulario de Alta / Edición */}
        <form onSubmit={handleSave} className="rounded-2xl border border-dark-border bg-dark-obsidian p-5 space-y-4">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            {editingCourier ? `Editar: ${editingCourier.name}` : 'Añadir Nuevo Mensajero'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Nombre del Mensajero *</label>
              <input
                type="text"
                required
                placeholder="Ej. Rofanci Encarnación"
                value={courierName}
                onChange={(e) => setCourierName(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-surface p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Teléfono / WhatsApp *</label>
              <input
                type="text"
                placeholder="809-316-0799"
                value={courierPhone}
                onChange={(e) => setCourierPhone(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-surface p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            {editingCourier && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-dark-border bg-dark-surface px-4 py-2 text-xs font-bold text-text-muted hover:text-white cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
            <PrimaryButton type="submit" variant="primary" className="py-2 px-5 text-xs font-black shadow-glow-purple cursor-pointer">
              <Save className="h-4 w-4 mr-1.5" />
              <span>{editingCourier ? 'Actualizar Mensajero' : 'Guardar Mensajero'}</span>
            </PrimaryButton>
          </div>
        </form>

        {/* Listado de Mensajeros */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-text-muted uppercase">Mensajeros Registrados ({safeCouriers.length})</h4>
          <div className="space-y-2.5">
            {safeCouriers.map((courier) => {
              const assignedCount = safeOrders.filter((o) => o.courierId === courier.id).length;

              return (
                <div
                  key={courier.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-dark-border bg-dark-obsidian gap-4 hover:border-brand-cyan/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center flex-shrink-0">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <strong className="text-xs font-bold text-white block truncate">{courier.name}</strong>
                      <div className="flex items-center gap-2 text-[11px] text-text-muted">
                        <span>{courier.phone || 'Sin teléfono'}</span>
                        <span>•</span>
                        <span className="text-brand-cyan font-bold">{assignedCount} pedidos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(courier)}
                      className="p-2 rounded-xl border border-dark-border bg-dark-surface text-text-muted hover:text-brand-cyan hover:border-brand-cyan transition-all cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(courier)}
                      className="p-2 rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 text-brand-magenta hover:bg-brand-magenta/20 transition-all cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
