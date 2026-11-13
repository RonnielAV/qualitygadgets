import React from 'react';
import { HardDriveDownload, LogOut, X, AlertTriangle } from 'lucide-react';

export default function LogoutConfirmModal({ 
  isOpen, 
  onClose, 
  onDownloadAndLogout, 
  onDirectLogout 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 text-stone-900 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
              <LogOut className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Cerrar Sesión
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">
                ¿Deseas descargar tu copia de seguridad (.json)?
              </p>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                Te recomendamos guardar el archivo de respaldo para no perder ninguna cotización o factura creada en esta sesión.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* Action 1: Download & Logout */}
            <button
              type="button"
              onClick={onDownloadAndLogout}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-rose-950/20 transition-all flex items-center justify-center space-x-2"
            >
              <HardDriveDownload className="w-4 h-4" />
              <span>Descargar Backup (.json) y Salir</span>
            </button>

            {/* Action 2: Direct Logout */}
            <button
              type="button"
              onClick={onDirectLogout}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-medium transition-all"
            >
              Cerrar Sesión sin Descargar
            </button>

            {/* Action 3: Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-stone-400 hover:text-stone-600 text-xs text-center font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

