import React, { useState } from 'react';
import { Sparkles, Lock, User, ArrowRight, HardDriveUpload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authenticateUser } from '../utils/userUtils';

export default function LoginScreen({ onLogin, onDirectRestoreBackup }) {
  const [username, setUsername] = useState('eliotte');
  const [password, setPassword] = useState('mua2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const authResult = authenticateUser(username, password);
      if (authResult.success) {
        onLogin({
          ...authResult.user,
          rememberMe
        });
      } else {
        setError(authResult.message || 'Usuario o contraseña incorrectos. (Prueba: eliotte / mua2026)');
        setIsSubmitting(false);
      }
    }, 300);
  };

  const handleBackupFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onDirectRestoreBackup(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col justify-between items-center p-4 sm:p-6 text-stone-100 select-none">
      {/* Top Brand Watermark */}
      <div className="w-full max-w-md pt-4 sm:pt-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-center justify-center p-3 shadow-2xl shadow-rose-950/20 backdrop-blur-md mb-3">
          <img
            src="./assets/logo-white-trimmed.png"
            alt="Eliotte MUA"
            className="w-full h-auto object-contain drop-shadow"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Eliotte MUA
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 font-light tracking-widest uppercase mt-0.5">
          Cotizaciones • Facturas • Master Class
        </p>
      </div>

      {/* Main Login Card - 100% Mobile Responsive */}
      <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl my-auto">
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Ingresa para gestionar y emitir tus cotizaciones
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-center font-medium animate-in fade-in duration-150">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Usuario */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 uppercase tracking-wider">
              Usuario
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="eliotte"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800/80 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider">
                Contraseña
              </label>
              <span className="text-[11px] text-stone-500 font-mono">
                Default: mua2026
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800/80 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs text-stone-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-stone-800 border-stone-700 text-rose-600 focus:ring-rose-500"
              />
              <span>Recordar sesión en este dispositivo</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-semibold rounded-xl text-sm shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{isSubmitting ? 'Accediendo...' : 'Acceder al Sistema'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Direct Backup Upload Option */}
        <div className="mt-6 pt-5 border-t border-stone-800 text-center">
          <p className="text-xs text-stone-400 mb-2.5">
            ¿Tienes una copia de seguridad guardada?
          </p>
          <label className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-stone-700 bg-stone-800/60 hover:bg-stone-800 text-xs text-stone-300 hover:text-white cursor-pointer transition-all shadow-2xs">
            <HardDriveUpload className="w-3.5 h-3.5 text-rose-400" />
            <span>Subir Backup (.json) e Ingresar</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleBackupFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Footer info */}
      <div className="w-full max-w-md pb-4 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} Eliotte MUA • Todos los derechos reservados</p>
      </div>
    </div>
  );
}

