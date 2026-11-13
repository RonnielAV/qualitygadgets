import React, { useRef } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Save, 
  History, 
  RotateCcw, 
  Sparkles, 
  Check, 
  MessageCircle,
  FileImage,
  FileDown,
  GraduationCap,
  HardDriveDownload,
  HardDriveUpload,
  PlusCircle,
  FileJson,
  LogOut,
  User,
  Users,
  Smartphone
} from 'lucide-react';

export default function Navbar({ 
  docType, 
  onDownloadPdf, 
  onDownloadImage, 
  onCopyWhatsApp, 
  onPrint, 
  onSave, 
  onOpenHistory, 
  onReset,
  onNewDocument,
  onExportBackup,
  onImportBackup,
  onOpenLogoutModal,
  onOpenUsersModal,
  onOpenClientsModal,
  clientsCount = 0,
  onInstallApp,
  isInstallable,
  currentUser,
  historyCount, 
  isExporting, 
  copiedFeedback 
}) {
  const fileInputRef = useRef(null);

  const getBadge = () => {
    if (docType === 'masterclass') {
      return { text: 'Master Class PRO', color: 'bg-stone-800 text-white' };
    }
    if (docType === 'invoice') {
      return { text: 'Factura', color: 'bg-stone-800 text-white' };
    }
    return { text: 'Cotización', color: 'bg-stone-800 text-white' };
  };

  const badge = getBadge();

  const handleBackupFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40 px-2 sm:px-6 py-2 sm:py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
        {/* Brand / Title & New Document Quick Action */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-stone-900 flex items-center justify-center p-1.5 shadow-sm shrink-0">
              <img
                src="./assets/logo-white-trimmed.png"
                alt="Eliotte MUA"
                className="w-full h-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-stone-900 text-xs sm:text-sm tracking-tight">
                  Eliotte MUA
                </span>
                <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>
                  {badge.text}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium hidden sm:block">
                Cotizaciones • Facturas • Master Class
              </p>
            </div>
          </div>

          {/* New Document Button */}
          {onNewDocument && (
            <button
              type="button"
              onClick={onNewDocument}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all flex items-center space-x-1 shadow-2xs shrink-0"
              title={`Iniciar nueva ${docType === 'invoice' ? 'Factura' : 'Cotización'} con correlativo consecutivo`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-stone-700" />
              <span>+ Nuevo</span>
            </button>
          )}
        </div>

        {/* Action Buttons - Fully Mobile Optimized */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 w-full md:w-auto justify-between sm:justify-end">
          {/* Backup JSON Button */}
          <div className="inline-flex rounded-lg border border-stone-300 bg-stone-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={onExportBackup}
              className="px-2 py-1 rounded-md text-stone-700 hover:text-stone-900 hover:bg-white transition-all flex items-center space-x-1"
              title="Descargar copia de seguridad en archivo .json"
            >
              <HardDriveDownload className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden lg:inline">Backup</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-md text-stone-700 hover:text-stone-900 hover:bg-white transition-all flex items-center space-x-1"
              title="Cargar copia de seguridad desde archivo .json"
            >
              <HardDriveUpload className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden lg:inline">Restaurar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleBackupFile}
              className="hidden"
            />
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all flex items-center space-x-1 sm:space-x-1.5"
            title="Ver documentos guardados"
          >
            <History className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 bg-stone-800 text-white rounded-full text-[10px] font-mono font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Client Directory Button */}
          {onOpenClientsModal && (
            <button
              type="button"
              onClick={onOpenClientsModal}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all flex items-center space-x-1"
              title="Ver y gestionar directorio de clientes frecuentes"
            >
              <Users className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Clientes</span>
              {clientsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-stone-800 text-white rounded-full text-[10px] font-mono font-bold">
                  {clientsCount}
                </span>
              )}
            </button>
          )}

          {/* Save Button */}
          <button
            type="button"
            onClick={onSave}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition-all flex items-center space-x-1"
            title="Guardar en historial del navegador"
          >
            <Save className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">Guardar</span>
          </button>

          {/* WhatsApp Text Copy */}
          <button
            type="button"
            onClick={onCopyWhatsApp}
            className={`px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1 border shadow-xs ${
              copiedFeedback
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-100 text-stone-800 border-stone-300 hover:bg-stone-200'
            }`}
            title="Copiar texto resumen formateado para enviar por WhatsApp"
          >
            {copiedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 text-stone-300" />
                <span className="hidden sm:inline">¡Copiado!</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5 text-stone-700" />
                <span className="hidden md:inline">WhatsApp</span>
              </>
            )}
          </button>

          {/* Download Image (JPG) */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => onDownloadImage('jpg')}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all flex items-center space-x-1 shadow-2xs disabled:opacity-50"
            title="Descargar como imagen (JPG/PNG) para enviar directamente por WhatsApp"
          >
            <FileImage className="w-3.5 h-3.5 text-stone-700" />
            <span className="hidden sm:inline">Foto / JPG</span>
            <span className="sm:hidden">JPG</span>
          </button>

          {/* Download PDF - Solid High-Fashion Black */}
          <button
            type="button"
            disabled={isExporting}
            onClick={onDownloadPdf}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 border border-stone-900 transition-all flex items-center space-x-1 shadow-xs disabled:opacity-50"
            title="Descargar documento en formato PDF listo para imprimir o enviar"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          {/* PWA Install Button */}
          {onInstallApp && (
            <button
              type="button"
              onClick={onInstallApp}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all flex items-center space-x-1 shadow-2xs"
              title="Instalar como app en tu celular o computadora"
            >
              <Smartphone className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden sm:inline">Instalar App</span>
              <span className="sm:hidden">App</span>
            </button>
          )}

          {/* User Profile, Equipo & Logout */}
          <div className="flex items-center space-x-1 pl-1 border-l border-stone-300">
            {onOpenUsersModal && (
              <button
                type="button"
                onClick={onOpenUsersModal}
                className="px-2 py-1 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-all flex items-center space-x-1 border border-stone-200 shadow-2xs"
                title="Gestionar usuarios, contraseñas y permisos del equipo"
              >
                <Users className="w-3.5 h-3.5 text-stone-700" />
                <span className="text-xs font-medium hidden sm:inline">Equipo</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenLogoutModal}
              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors flex items-center space-x-1"
              title="Cerrar sesión (te preguntará si deseas descargar backup)"
            >
              <LogOut className="w-4 h-4 text-stone-600 hover:text-stone-950" />
              <span className="text-xs font-semibold hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
