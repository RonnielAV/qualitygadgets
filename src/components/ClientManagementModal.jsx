import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Search, 
  Trash2, 
  Edit3, 
  Building2, 
  Mail, 
  Phone, 
  Check, 
  CheckCircle,
  FileText,
  User,
  AlertCircle,
  Users,
  SendHorizontal
} from 'lucide-react';

export default function ClientManagementModal({ 
  isOpen, 
  onClose, 
  clients = [], 
  onSaveClients, 
  onSelectClientForDoc,
  showToast 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingClientId, setEditingClientId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formRnc, setFormRnc] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingClientId(null);
    setFormName('');
    setFormCompany('');
    setFormRnc('');
    setFormEmail('');
    setFormPhone('');
    setFormNotes('');
    setFormError('');
    setShowAddForm(true);
  };

  const handleStartEdit = (client) => {
    setEditingClientId(client.id);
    setFormName(client.name || '');
    setFormCompany(client.company || '');
    setFormRnc(client.rnc || '');
    setFormEmail(client.email || '');
    setFormPhone(client.phone || '');
    setFormNotes(client.notes || '');
    setFormError('');
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setEditingClientId(null);
    setShowAddForm(false);
    setFormError('');
  };

  const handleSaveClient = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanName = formName.trim();
    if (!cleanName) {
      setFormError('El nombre del cliente o empresa es obligatorio.');
      return;
    }

    let updatedClients;
    if (editingClientId) {
      // Edit existing client
      updatedClients = clients.map((c) => {
        if (c.id === editingClientId) {
          return {
            ...c,
            name: cleanName,
            company: formCompany.trim(),
            rnc: formRnc.trim(),
            email: formEmail.trim(),
            phone: formPhone.trim(),
            notes: formNotes.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });
      showToast?.(`Cliente "${cleanName}" actualizado.`);
    } else {
      // Create new client
      const newClient = {
        id: 'cli_' + Date.now(),
        name: cleanName,
        company: formCompany.trim(),
        rnc: formRnc.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        notes: formNotes.trim(),
        createdAt: new Date().toISOString(),
      };
      updatedClients = [newClient, ...clients];
      showToast?.(`Nuevo cliente "${cleanName}" registrado con éxito.`);
    }

    onSaveClients(updatedClients);
    handleCancelForm();
  };

  const handleDeleteClient = (clientId, clientName) => {
    if (window.confirm(`¿Estás segura de eliminar a "${clientName}" del directorio de clientes?`)) {
      const updated = clients.filter((c) => c.id !== clientId);
      onSaveClients(updated);
      showToast?.(`Cliente "${clientName}" eliminado.`);
    }
  };

  const handleSelectClient = (client) => {
    if (onSelectClientForDoc) {
      onSelectClientForDoc(client);
      showToast?.(`Datos de "${client.name}" cargados en el documento.`);
      onClose();
    }
  };

  // Filter clients by search query
  const filteredClients = clients.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.company || '').toLowerCase().includes(q) ||
      (c.rnc || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.notes || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-stone-200 text-stone-900 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                <span>Directorio de Clientes</span>
                <span className="text-xs bg-stone-800 text-stone-300 font-mono px-2 py-0.5 rounded-full font-normal">
                  {clients.length}
                </span>
              </h3>
              <p className="text-xs text-stone-400 font-light">
                Selecciona o administra los clientes para tus cotizaciones y facturas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, empresa, RNC, correo o teléfono..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
            />
          </div>

          <button
            type="button"
            onClick={handleStartAdd}
            className="w-full sm:w-auto px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-sm transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Nuevo Cliente</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Add / Edit Form Modal Layer if active */}
          {showAddForm && (
            <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border-2 border-rose-200 shadow-sm mb-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserPlus className="w-4 h-4 text-rose-600" />
                  <span>{editingClientId ? 'Editar Datos del Cliente:' : 'Registrar Nuevo Cliente en Directorio:'}</span>
                </h4>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium"
                >
                  Cancelar
                </button>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveClient} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ej: Eugenia Pérez"
                      required
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Empresa (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="Ej: Persio Abreu SRL"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      RNC o Cédula (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formRnc}
                      onChange={(e) => setFormRnc(e.target.value)}
                      placeholder="Ej: 102-32053-5"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="cliente@ejemplo.com"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="Ej: (849) 220-9464"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Notas del Cliente (Opcional)
                    </label>
                    <input
                      type="text"
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Ej: Maquillaje Novia, Retoque sesión"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{editingClientId ? 'Guardar Cambios' : 'Registrar Cliente'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Client List */}
          {filteredClients.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Users className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="text-sm font-medium text-stone-600">No se encontraron clientes</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {searchQuery ? 'Prueba con otro término de búsqueda.' : 'Haz clic en "+ Nuevo Cliente" para registrar al primero.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-stone-50 hover:bg-stone-100/80 p-3.5 sm:p-4 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                            {client.name}
                          </h5>
                          {client.company && (
                            <p className="text-xs text-stone-500 font-medium flex items-center space-x-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-stone-400 shrink-0" />
                              <span className="truncate">{client.company}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {client.rnc && (
                        <span className="text-[10px] bg-stone-200 text-stone-800 font-mono font-bold px-1.5 py-0.5 rounded shrink-0">
                          RNC: {client.rnc}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 space-y-0.5 pt-1 border-t border-stone-200/60">
                      {client.email && (
                        <p className="flex items-center space-x-1.5 truncate">
                          <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </p>
                      )}
                      {client.phone && (
                        <p className="flex items-center space-x-1.5">
                          <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{client.phone}</span>
                        </p>
                      )}
                      {client.notes && (
                        <p className="text-[11px] text-stone-400 italic pt-0.5 line-clamp-1">
                          Nota: {client.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200 gap-2">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(client)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-300"
                        title="Editar datos de este cliente"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClient(client.id, client.name)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar del directorio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectClient(client)}
                      className="px-2.5 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl flex items-center space-x-1 shadow-2xs transition-all active:scale-[0.98]"
                      title="Rellenar cotización o factura con este cliente"
                    >
                      <SendHorizontal className="w-3 h-3 text-rose-400" />
                      <span>Usar en Doc</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500">
          <span>ℹ️ Los clientes quedan respaldados automáticamente en tu archivo <strong>.json</strong> de backup.</span>
        </div>
      </div>
    </div>
  );
}

