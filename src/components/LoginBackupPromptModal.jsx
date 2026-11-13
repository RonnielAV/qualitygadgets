import React, { useRef } from 'react';
import { HardDriveUpload, CheckCircle, ArrowRight, FileJson, Sparkles } from 'lucide-react';

export default function LoginBackupPromptModal({ isOpen, onClose, onImportBackup, userName }) {
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200 text-stone-900 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-6 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            ¡Bienvenida, {userName || 'Eliotte'}!
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            ¿Deseas sincronizar una copia de seguridad o continuar con tus datos guardados?
          </p>
        </div>

        {/* Options Body */}
        <div className="p-6 space-y-3.5">
          {/* Option 1: Load Backup */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded-2xl border-2 border-stone-300 hover:border-rose-500 bg-rose-50/30 hover:bg-rose-50 transition-all text-left flex items-start space-x-3.5 group shadow-2xs"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HardDriveUpload className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900 group-hover:text-rose-700 transition-colors">
                  Cargar Copia de Seguridad (.json)
                </span>
                <span className="text-[10px] bg-rose-200/60 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                  Recomendado
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Restaura todas tus cotizaciones, facturas e historial desde tu archivo de respaldo.
              </p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Option 2: Continue with local data */}
          <button
            type="button"
            onClick={onClose}
            className="w-full p-3.5 rounded-2xl border border-stone-200 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 transition-all text-left flex items-center space-x-3.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-700 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-xs sm:text-sm text-stone-800 block">
                Continuar con Datos Locales
              </span>
              <span className="text-[11px] text-stone-500 block">
                Usar las cotizaciones y facturas guardadas en este dispositivo.
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Dismiss Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 text-center">
          <p className="text-[11px] text-stone-400">
            Puedes cargar o descargar copias en cualquier momento desde el menú superior.
          </p>
        </div>
      </div>
    </div>
  );
}

