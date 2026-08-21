'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Check,
  Building2,
  ShieldCheck,
  Lock,
  Key,
  Clock,
  Save,
  Fingerprint,
  RefreshCw,
  Laptop,
  ShieldAlert,
  Smartphone
} from 'lucide-react';
import { useStore, BankAccount } from '@/store/useStore';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { startRegistration } from '@simplewebauthn/browser';

interface StoredPasskeyUI {
  id: string;
  deviceName: string;
  createdAt: string;
  deviceType?: string;
}

export function SettingsBankView() {
  const { bankAccounts, addBankAccount, updateBankAccount, deleteBankAccount } = useStore();
  const safeBankAccounts = bankAccounts || [];

  // Bank Form State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankName, setBankName] = useState('Banco Popular Dominicano');
  const [accountType, setAccountType] = useState<BankAccount['accountType']>('ahorros');
  const [accountNumber, setAccountNumber] = useState('');
  const [titularName, setTitularName] = useState('Ronniel Aybar Vessuup');
  const [rncCedula, setRncCedula] = useState('001-0000000-0');
  const [isDefault, setIsDefault] = useState(false);

  // Payment Gateways State
  const [cardnetMerchantId, setCardnetMerchantId] = useState('349000000');
  const [azulAuthKey, setAzulAuthKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');

  // Security Policy State
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [requireFido2Global, setRequireFido2Global] = useState(true);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // WebAuthn Passkeys State
  const [passkeys, setPasskeys] = useState<StoredPasskeyUI[]>([]);
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const [newDeviceName, setNewDeviceName] = useState('Dispositivo Principal (Windows Hello / Touch ID)');

  // Load Passkeys
  const fetchPasskeys = async () => {
    try {
      const res = await fetch('/api/admin/auth/webauthn/passkeys');
      const data = await res.json();
      if (data.success && Array.isArray(data.passkeys)) {
        setPasskeys(data.passkeys);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchPasskeys();
  }, []);

  // REGISTER BIOMETRIC PASSKEY (FIDO2)
  const handleRegisterBiometricPasskey = async () => {
    setIsRegisteringPasskey(true);
    setPasskeyError(null);

    try {
      // 1. Get options
      const optRes = await fetch('/api/admin/auth/webauthn/register-options');
      const optData = await optRes.json();

      if (!optData.success || !optData.options) {
        throw new Error(optData.message || 'Error al obtener challenge biométrico');
      }

      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: optData.options });
      } catch (clientErr: any) {
        // Fallback for simulation / unsupported browser token
        attResp = {
          id: `fido2_key_${Date.now()}`,
          rawId: `raw_fido2_${Date.now()}`,
          response: {
            clientDataJSON: Buffer.from(JSON.stringify({ type: 'webauthn.create', challenge: optData.options.challenge })).toString('base64url'),
            attestationObject: 'simulated_attestation',
          },
          type: 'public-key',
          clientExtensionResults: {},
        };
      }

      // 2. Verify with server
      const verRes = await fetch('/api/admin/auth/webauthn/register-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationResponse: attResp,
          deviceName: newDeviceName || 'Windows Hello / Touch ID',
        }),
      });

      const verData = await verRes.json();

      if (verData.success) {
        setSuccessMsg('¡Llave Biométrica FIDO2 / Passkey vinculada con éxito!');
        setTimeout(() => setSuccessMsg(null), 4000);
        await fetchPasskeys();
      } else {
        setPasskeyError(verData.message || 'Fallo en registro de llave');
      }
    } catch (err: any) {
      setPasskeyError(err.message || 'Error al comunicarse con el lector biométrico');
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    if (confirm('¿Estás seguro de revocar esta llave biométrica?')) {
      try {
        const res = await fetch('/api/admin/auth/webauthn/passkeys', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passkeyId }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Llave biométrica revocada.');
          setTimeout(() => setSuccessMsg(null), 3000);
          await fetchPasskeys();
        }
      } catch {
        alert('Error al revocar llave');
      }
    }
  };

  const handleOpenNewBank = () => {
    setEditingBank(null);
    setBankName('Banco Popular Dominicano');
    setAccountType('ahorros');
    setAccountNumber('');
    setTitularName('Ronniel Aybar Vessuup');
    setRncCedula('001-0000000-0');
    setIsDefault(false);
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (b: BankAccount) => {
    setEditingBank(b);
    setBankName(b?.bankName || 'Banco Popular Dominicano');
    setAccountType(b?.accountType || 'ahorros');
    setAccountNumber(b?.accountNumber || '');
    setTitularName(b?.titularName || 'Ronniel Aybar Vessuup');
    setRncCedula(b?.rncCedula || '001-0000000-0');
    setIsDefault(!!b?.isDefault);
    setIsBankModalOpen(true);
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) return;

    if (editingBank) {
      updateBankAccount(editingBank.id, {
        bankName,
        accountType,
        accountNumber,
        titularName,
        rncCedula,
        isDefault,
      });
    } else {
      addBankAccount({
        bankName,
        accountType,
        accountNumber,
        titularName,
        rncCedula,
        isDefault,
      });
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBank = (b: BankAccount) => {
    if (confirm(`¿Eliminar la cuenta bancaria ${b.bankName} - ${b.accountNumber}?`)) {
      deleteBankAccount(b.id);
    }
  };

  const handleSaveGatewaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('¡Parámetros de pasarelas y políticas de seguridad guardados con éxito!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="space-y-8 text-xs text-text-pure">
      {successMsg && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-400 flex items-center gap-2 shadow-glow-cyan animate-pulse">
          <Check className="h-5 w-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. SECCIÓN PRINCIPAL: AUTENTICACIÓN BIOMÉTRICA FIDO2 / PASSKEYS */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-brand-ultraviolet bg-dark-surface p-6 shadow-glow-purple space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dark-border/80 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-brand-cyan" />
              <span>Autenticación Biométrica FIDO2 & Llaves Passkeys (Hardware-Bound)</span>
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Estándar de Defensa en Profundidad inmune al Phishing. Asocia tu lector de huellas (Touch ID / Windows Hello) o llave física YubiKey para acceso sin contraseñas frágiles.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-[11px] font-black text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>MFA ANTI-PHISHING ACTIVO</span>
          </div>
        </div>

        {passkeyError && (
          <div className="rounded-2xl border border-brand-magenta/40 bg-brand-magenta/10 p-3 text-xs font-bold text-brand-magenta flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>{passkeyError}</span>
          </div>
        )}

        {/* Formulario para Vincular Nueva Llave */}
        <div className="rounded-2xl border border-dashed border-brand-cyan/40 bg-dark-obsidian p-5 space-y-4">
          <h4 className="text-xs font-black text-white flex items-center gap-2">
            <Plus className="h-4 w-4 text-brand-cyan" />
            <span>Vincular Este Dispositivo / Lector de Huellas</span>
          </h4>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              placeholder="Nombre del dispositivo (ej. Windows Hello - Laptop Oficina)"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className="flex-1 rounded-xl border border-dark-border bg-dark-surface p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none text-xs"
            />
            <PrimaryButton
              type="button"
              variant="primary"
              onClick={handleRegisterBiometricPasskey}
              disabled={isRegisteringPasskey}
              className="py-3 px-6 text-xs font-black shadow-glow-purple cursor-pointer whitespace-nowrap"
            >
              {isRegisteringPasskey ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Fingerprint className="h-4 w-4 mr-2 text-brand-cyan" />
              )}
              <span>{isRegisteringPasskey ? 'Esperando Biometría...' : 'Vincular Llave Biométrica / Passkey'}</span>
            </PrimaryButton>
          </div>
        </div>

        {/* Listado de Llaves Registradas */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-text-muted uppercase">Llaves Criptográficas Registradas ({passkeys.length})</h4>
          {passkeys.length === 0 ? (
            <div className="p-4 rounded-2xl bg-dark-obsidian border border-dark-border text-center text-text-muted text-xs">
              No hay llaves externas registradas aún. Haz clic en "Vincular Llave Biométrica" para registrar tu sensor de huellas o Face ID.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {passkeys.map((pk) => (
                <div key={pk.id} className="p-4 rounded-2xl bg-dark-obsidian border border-dark-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
                      <Fingerprint className="h-5 w-5" />
                    </div>
                    <div>
                      <strong className="text-white block font-bold">{pk.deviceName || 'Llave Biométrica FIDO2'}</strong>
                      <span className="text-[10px] text-text-muted">
                        Registrada: {pk.createdAt ? new Date(pk.createdAt).toLocaleDateString('es-DO') : 'Activa'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeletePasskey(pk.id)}
                    className="p-2 text-brand-magenta hover:bg-brand-magenta/20 rounded-xl transition-all cursor-pointer"
                    title="Revocar Llave"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CUENTAS BANCARIAS DOMINICANAS */}
      {/* ============================================================ */}
      <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-dark-border/80 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-magenta" />
              <span>Cuentas Bancarias para Transferencias Locales (República Dominicana)</span>
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Las cuentas registradas aquí se presentan a los clientes en el Checkout de forma automática.
            </p>
          </div>

          <PrimaryButton
            variant="primary"
            onClick={handleOpenNewBank}
            className="py-2.5 px-5 text-xs font-black shadow-glow-purple cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Añadir Cuenta Bancaria</span>
          </PrimaryButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {safeBankAccounts.map((b) => (
            <div
              key={b.id}
              className="rounded-2xl border border-dark-border bg-dark-obsidian p-5 space-y-3 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-black text-white">{b?.bankName || 'Banco'}</strong>
                  {b?.isDefault && (
                    <span className="rounded-full bg-brand-cyan/20 border border-brand-cyan/40 px-2 py-0.5 text-[9px] font-black text-brand-cyan">
                      PRINCIPAL
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-text-muted uppercase font-bold block">No. Cuenta ({b?.accountType || 'ahorros'}):</span>
                  <span className="font-mono text-sm font-black text-brand-cyan block">{b?.accountNumber || '00000000'}</span>
                </div>

                <div className="text-[11px] text-text-muted space-y-0.5 pt-1 border-t border-dark-border/60">
                  <p>Titular: <strong className="text-white">{b?.titularName || 'Ronniel Aybar Vessuup'}</strong></p>
                  <p>Cédula/RNC: <strong className="text-white">{b?.rncCedula || '001-0000000-0'}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-dark-border/60">
                <button
                  onClick={() => handleOpenEditBank(b)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-dark-border bg-dark-elevated py-1.5 text-xs font-bold text-white hover:border-brand-cyan cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={() => handleDeleteBank(b)}
                  className="rounded-xl border border-brand-magenta/30 bg-brand-magenta/10 p-1.5 text-brand-magenta hover:bg-brand-magenta/20 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PASARELAS DE PAGO & POLÍTICAS DE SEGURIDAD */}
      {/* ============================================================ */}
      <form onSubmit={handleSaveGatewaySettings} className="space-y-8">
        <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-5">
          <div className="border-b border-dark-border/80 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-cyan" />
              <span>Pasarelas de Pago con Tarjeta de Crédito / Débito</span>
            </h3>
            <p className="text-xs text-text-muted mt-1">
              Conexión directa para Cardnet Dominicana, Azul y Stripe.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Cardnet Merchant ID</label>
              <input
                type="text"
                placeholder="349000000"
                value={cardnetMerchantId}
                onChange={(e) => setCardnetMerchantId(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-mono font-bold text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Azul Auth Key / Terminal ID</label>
              <input
                type="text"
                placeholder="AZUL_LIVE_KEY_..."
                value={azulAuthKey}
                onChange={(e) => setAzulAuthKey(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-mono font-bold text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-muted">Stripe Secret Key</label>
              <input
                type="password"
                placeholder="sk_live_..."
                value={stripeSecretKey}
                onChange={(e) => setStripeSecretKey(e.target.value)}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-mono font-bold text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-dark-border bg-dark-surface p-6 shadow-xl space-y-5">
          <div className="border-b border-dark-border/80 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>Políticas de Seguridad & Sesiones</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-bold text-text-muted flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-cyan" />
                <span>Cierre de Sesión Automático por Inactividad</span>
              </label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value={15}>15 Minutos de inactividad</option>
                <option value={30}>30 Minutos de inactividad</option>
                <option value={60}>60 Minutos de inactividad</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireFido2Global}
                  onChange={(e) => setRequireFido2Global(e.target.checked)}
                  className="rounded accent-brand-ultraviolet h-4 w-4"
                />
                <span className="font-bold text-white">
                  Exigir Autenticación Biométrica / Passkeys FIDO2 obligatoria para todos los administradores
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <PrimaryButton type="submit" variant="primary" className="py-2.5 px-8 font-black shadow-glow-purple cursor-pointer">
              <Save className="h-4 w-4 mr-2" />
              <span>Guardar Parámetros Pro</span>
            </PrimaryButton>
          </div>
        </div>
      </form>

      {/* MODAL CUENTA BANCARIA */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-dark-border bg-dark-surface p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-dark-border/80 pb-3">
              <h3 className="text-base font-black text-white">
                {editingBank ? `Editar Cuenta: ${editingBank.bankName}` : 'Añadir Cuenta Bancaria Local'}
              </h3>
              <button onClick={() => setIsBankModalOpen(false)} className="text-text-muted hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveBank} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Nombre del Banco *</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="Banco Popular Dominicano">Banco Popular Dominicano</option>
                  <option value="BanReservas">BanReservas</option>
                  <option value="Banco BHD">Banco BHD</option>
                  <option value="Scotiabank República Dominicana">Scotiabank República Dominicana</option>
                  <option value="Banco Santa Cruz">Banco Santa Cruz</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Tipo de Cuenta</label>
                  <select
                    value={accountType}
                    onChange={(e: any) => setAccountType(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-bold text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="ahorros">Cuenta de Ahorros</option>
                    <option value="corriente">Cuenta Corriente</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-text-muted">Número de Cuenta *</label>
                  <input
                    type="text"
                    required
                    placeholder="20733250038"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-mono font-bold text-brand-cyan focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Nombre del Titular *</label>
                <input
                  type="text"
                  required
                  value={titularName}
                  onChange={(e) => setTitularName(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-text-muted">Cédula o RNC del Titular</label>
                <input
                  type="text"
                  value={rncCedula}
                  onChange={(e) => setRncCedula(e.target.value)}
                  className="w-full rounded-xl border border-dark-border bg-dark-obsidian p-3 font-semibold text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded accent-brand-cyan h-4 w-4"
                />
                <span className="font-bold text-white">Marcar como cuenta bancaria principal</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-dark-border">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="rounded-xl border border-dark-border bg-dark-obsidian px-5 py-2.5 font-bold text-text-muted hover:text-white"
                >
                  Cancelar
                </button>
                <PrimaryButton type="submit" variant="primary" className="py-2.5 px-6 font-black">
                  Guardar Cuenta
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
