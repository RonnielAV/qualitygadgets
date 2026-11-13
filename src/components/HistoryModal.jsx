import React, { useState, useRef } from 'react';
import { 
  X, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  Clock, 
  DollarSign, 
  Receipt, 
  Sparkles, 
  GraduationCap, 
  Search, 
  Download, 
  Upload, 
  HardDriveDownload, 
  HardDriveUpload,
  FileJson,
  Hash
} from 'lucide-react';

export default function HistoryModal({ 
  isOpen, 
  onClose, 
  history = [], 
  onLoadItem, 
  onDeleteItem, 
  onClearAll,
  onExportBackup,
  onImportBackup
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'quote' | 'invoice' | 'masterclass'
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    // Type filter
    if (filterType !== 'all' && item.type !== filterType) return false;
    
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const client = (item.data?.clientName || '').toLowerCase();
      const company = (item.data?.company || '').toLowerCase();
      const docNum = (item.data?.quoteNumber || item.data?.invoiceNumber || '').toLowerCase();
      const title = (item.data?.title || '').toLowerCase();
      return client.includes(q) || company.includes(q) || docNum.includes(q) || title.includes(q);
    }
    return true;
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold">
              Historial y Copias de Seguridad
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
            {/* Type tabs */}
            <div className="inline-flex rounded-lg border border-stone-300 p-0.5 bg-stone-200/60 text-xs w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 rounded font-medium transition-all ${
                  filterType === 'all' ? 'bg-white shadow text-stone-900 font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Todos ({history.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('quote')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 rounded font-medium transition-all ${
                  filterType === 'quote' ? 'bg-white shadow text-rose-700 font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Cotizaciones
              </button>
              <button
                type="button"
                onClick={() => setFilterType('invoice')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 rounded font-medium transition-all ${
                  filterType === 'invoice' ? 'bg-white shadow text-stone-900 font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Facturas
              </button>
              <button
                type="button"
                onClick={() => setFilterType('masterclass')}
                className={`flex-1 sm:flex-initial px-2.5 py-1 rounded font-medium transition-all ${
                  filterType === 'masterclass' ? 'bg-white shadow text-amber-700 font-bold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Master Class
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por cliente o N°..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:ring-1 focus:ring-rose-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-stone-400">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No se encontraron documentos en el historial.</p>
              <p className="text-xs text-stone-500 mt-1">
                {searchQuery ? 'Prueba con otro término de búsqueda.' : 'Haz clic en "Guardar" en la barra superior para almacenar tus cotizaciones y facturas.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isQuote = item.type === 'quote';
              const isInvoice = item.type === 'invoice';
              const isMasterClass = item.type === 'masterclass';

              let title = '';
              let badgeColor = '';
              let badgeText = '';
              let totalText = '';
              let docNum = '';

              if (isMasterClass) {
                title = `Master Class • ${item.data.clientName || 'Propuesta'}`;
                badgeColor = 'bg-amber-100 text-amber-800';
                badgeText = 'Master Class';
                totalText = `${item.data.locations?.length || 0} sedes / paquetes`;
              } else if (isInvoice) {
                docNum = item.data.invoiceNumber || 'Sin N°';
                title = `Factura ${docNum}`;
                badgeColor = 'bg-stone-200 text-stone-800';
                badgeText = 'Factura';
                const total = item.data.items?.reduce((s, i) => s + ((Number(i.qty) || 1) * (Number(i.price) || 0)), 0) || 0;
                totalText = `${item.data.currency || 'RD$'} ${total.toLocaleString()}`;
              } else {
                docNum = item.data.quoteNumber || '';
                title = docNum ? `Cotización ${docNum}` : (item.data.title || 'Cotización');
                badgeColor = 'bg-rose-100 text-rose-700';
                badgeText = 'Cotización';
                const total = item.data.items?.reduce((s, i) => s + ((Number(i.qty) || 1) * (Number(i.price) || 0)), 0) || 0;
                totalText = `${item.data.currency || 'US$'} ${total.toLocaleString()}`;
              }

              return (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-100/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isMasterClass ? 'bg-amber-100 text-amber-700' : (isQuote ? 'bg-rose-100 text-rose-600' : 'bg-stone-200 text-stone-700')
                    }`}>
                      {isMasterClass ? <GraduationCap className="w-4 h-4" /> : (isQuote ? <Sparkles className="w-4 h-4" /> : <Receipt className="w-4 h-4" />)}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-stone-900">
                          {title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${badgeColor}`}>
                          {badgeText}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 mt-0.5">
                        Cliente: <strong>{item.data.clientName || 'Sin especificar'}</strong>
                        {item.data.company && ` • ${item.data.company}`}
                        {item.data.rnc && ` • RNC: ${item.data.rnc}`}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-stone-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(item.savedAt).toLocaleDateString()} {new Date(item.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </span>
                        <span className="font-semibold text-stone-800">
                          Total: {totalText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadItem(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-white border border-stone-300 hover:border-rose-400 hover:text-rose-600 shadow-2xs transition-all flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Cargar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar del historial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Backup (.json) & Clear All */}
        <div className="p-3 sm:p-4 border-t border-stone-200 bg-stone-100 flex flex-wrap items-center justify-between gap-2.5">
          {/* Backup Buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onExportBackup}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 shadow-2xs transition-all flex items-center space-x-1.5"
              title="Descargar toda la base de datos (cotizaciones, facturas y contadores) en archivo JSON"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-stone-600" />
              <span>Descargar Backup (.json)</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 shadow-2xs transition-all flex items-center space-x-1.5"
              title="Subir archivo .json para restaurar la información"
            >
              <HardDriveUpload className="w-3.5 h-3.5 text-stone-600" />
              <span>Cargar Backup (.json)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Clear all */}
          {history.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center space-x-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Historial</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
