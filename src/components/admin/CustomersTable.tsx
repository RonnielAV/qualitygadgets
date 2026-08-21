'use client';

import React, { useState } from 'react';
import { Users, Edit2, Trash2, Plus, Search, X } from 'lucide-react';
import { useStore, Customer } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

export function CustomersTable() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const safeCustomers = customers || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Santo Domingo');
  const [province, setProvince] = useState('Distrito Nacional');
  const [address, setAddress] = useState('');
  const [segment, setSegment] = useState<Customer['segment']>('new');
  const [notes, setNotes] = useState('');

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer?.name || '');
    setEmail(customer?.email || '');
    setPhone(customer?.phone || '');
    setCity(customer?.city || 'Santo Domingo');
    setProvince(customer?.province || 'Distrito Nacional');
    setAddress(customer?.address || '');
    setSegment(customer?.segment || 'new');
    setNotes(customer?.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    updateCustomer(editingCustomer.id, {
      name: name || 'Cliente',
      email,
      phone,
      city,
      province,
      address,
      segment,
      notes,
    });
    setEditingCustomer(null);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      name: name || 'Nuevo Cliente',
      email,
      phone,
      city,
      province,
      address,
      segment,
      notes,
    });
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
  };

  const handleDelete = (customer: Customer) => {
    const custName = customer?.name || 'este cliente';
    if (confirm(`¿Estás seguro de eliminar el registro de ${custName}?`)) {
      deleteCustomer(customer.id);
    }
  };

  const filteredCustomers = safeCustomers.filter((c) => {
    if (!c) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const cName = (c?.name || '').toLowerCase();
    const cEmail = (c?.email || '').toLowerCase();
    const cPhone = c?.phone || '';
    const cProv = (c?.province || '').toLowerCase();

    return (
      cName.includes(q) ||
      cEmail.includes(q) ||
      cPhone.includes(q) ||
      cProv.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border border-dark-border bg-dark-surface p-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo, teléfono o provincia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-dark-border bg-dark-obsidian py-2.5 pl-11 pr-4 text-xs font-semibold text-white focus:border-brand-cyan focus:outline-none"
          />
        </div>

        <PrimaryButton
          variant="primary"
          onClick={() => {
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
            setNotes('');
            setIsAddModalOpen(true);
          }}
          className="py-2.5 px-5 text-xs font-black cursor-pointer shadow-glow-purple"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          <span>Agregar Cliente CRM</span>
        </PrimaryButton>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-dark-border bg-dark-surface shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-dark-border bg-dark-elevated/70 text-[11px] font-black uppercase text-text-muted">
            <tr>
              <th className="px-6 py-4">Nombre / Contacto</th>
              <th className="px-6 py-4">Ubicación</th>
              <th className="px-6 py-4">Segmento</th>
              <th className="px-6 py-4">Pedidos Realizados</th>
              <th className="px-6 py-4">Gasto Acumulado (LTV)</th>
              <th className="px-6 py-4">Notas Internas</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border/60 font-medium">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-text-muted">
                  No hay clientes registrados con este criterio.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-dark-elevated/40 transition-colors">
                  <td className="px-6 py-4">
                    <strong className="text-white block font-bold">{c?.name || 'Cliente General'}</strong>
                    <span className="text-[11px] text-text-muted block">{c?.phone || 'Sin teléfono'}</span>
                    <span className="text-[10px] text-text-muted block">{c?.email || 'Sin correo'}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-white block">{c?.city || 'Santo Domingo'}</span>
                    <span className="text-[10px] text-brand-cyan block">{c?.province || 'Distrito Nacional'}</span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        c?.segment === 'vip'
                          ? 'bg-brand-magenta/20 text-brand-magenta border border-brand-magenta/40'
                          : c?.segment === 'recurrent'
                          ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                          : 'bg-dark-border text-text-muted'
                      }`}
                    >
                      {c?.segment || 'new'}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-bold text-white">
                    {c?.totalOrders || 0} compras
                  </td>

                  <td className="px-6 py-4 font-black text-emerald-400">
                    RD$ {(c?.totalSpentDop || 0).toLocaleString('es-DO')}
                  </td>

                  <td className="px-6 py-4 text-text-muted text-[11px] max-w-xs truncate">
                    {c?.notes || '—'}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        title="Editar Cliente"
                        className="rounded-xl border border-dark-border bg-dark-obsidian p-2 text-brand-cyan hover:text-white cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        title="Eliminar Cliente"
                        className="rounded-xl border border-brand-magenta/40 bg-brand-magenta/10 p-2 text-brand-magenta hover:bg-brand-magenta/25 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL EDITAR / CREAR CLIENTE */}
      {(editingCustomer || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-dark-border bg-dark-surface p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-dark-border/80 pb-4">
              <h3 className="text-base font-black text-white">
                {editingCustomer ? `Editar Cliente: ${editingCustomer?.name || 'Cliente'}` : 'Crear Nuevo Contacto CRM'}
              </h3>
              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setIsAddModalOpen(false);
                }}
                className="text-text-muted hover:text-white cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={editingCustomer ? handleSaveEdit : handleCreateCustomer} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Teléfono / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Provincia *</label>
                  <input
                    type="text"
                    required
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Segmento</label>
                  <select
                    value={segment}
                    onChange={(e: any) => setSegment(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="new">Nuevo Contacto</option>
                    <option value="recurrent">Recurrente</option>
                    <option value="vip">VIP Preferencial</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Dirección de Entrega</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, Número, Sector..."
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Notas Internas de Soporte</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Solicita entrega por la tarde, factura con RNC..."
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCustomer(null);
                    setIsAddModalOpen(false);
                  }}
                  className="rounded-xl border border-dark-border bg-dark-obsidian px-5 py-2.5 font-bold text-text-muted hover:text-white"
                >
                  Cancelar
                </button>
                <PrimaryButton type="submit" variant="primary" className="py-2.5 px-6 font-black">
                  Guardar en CRM
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
