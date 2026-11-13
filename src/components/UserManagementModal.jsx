import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  Key, 
  Users, 
  User, 
  Check, 
  AlertCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function UserManagementModal({ 
  isOpen, 
  onClose, 
  users = [], 
  onSaveUsers, 
  currentUser,
  showToast 
}) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [formRole, setFormRole] = useState('Asistente de Maquillaje');
  const [formIsAdmin, setFormIsAdmin] = useState(false);
  const [formError, setFormError] = useState('');

  const toggleVisiblePassword = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (!isOpen) return null;

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setFormName(user.name || '');
    setFormUsername(user.username || '');
    setFormPassword(user.password || '');
    setFormRole(user.role || '');
    setFormIsAdmin(!!user.isAdmin);
    setFormError('');
  };

  const handleCancelForm = () => {
    setEditingUserId(null);
    setFormName('');
    setFormUsername('');
    setFormPassword('');
    setFormRole('Asistente de Maquillaje');
    setFormIsAdmin(false);
    setFormError('');
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setFormError('');

    const cleanUser = formUsername.trim().toLowerCase();
    const cleanName = formName.trim();
    const cleanPass = formPassword.trim();

    if (!cleanUser || !cleanName || !cleanPass) {
      setFormError('Por favor completa todos los campos requeridos.');
      return;
    }

    // Check username duplication
    const duplicate = users.find(u => u.username.toLowerCase() === cleanUser && u.id !== editingUserId);
    if (duplicate) {
      setFormError(`El nombre de usuario "@${cleanUser}" ya está en uso.`);
      return;
    }

    let updatedUsers;
    if (editingUserId) {
      // Edit existing
      updatedUsers = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name: cleanName,
            username: cleanUser,
            password: cleanPass,
            role: formRole.trim(),
            isAdmin: formIsAdmin,
            updatedAt: new Date().toISOString()
          };
        }
        return u;
      });
      showToast?.(`Usuario @${cleanUser} actualizado.`);
    } else {
      // Create new
      const newUser = {
        id: 'usr_' + Date.now(),
        name: cleanName,
        username: cleanUser,
        password: cleanPass,
        role: formRole.trim() || 'Personal de Maquillaje',
        isAdmin: formIsAdmin,
        createdAt: new Date().toISOString()
      };
      updatedUsers = [...users, newUser];
      showToast?.(`Nuevo usuario @${cleanUser} creado.`);
    }

    onSaveUsers(updatedUsers);
    handleCancelForm();
  };

  const handleDeleteUser = (userId, userName) => {
    if (userId === 'usr_eliotte') {
      alert('La cuenta principal de Eliotte Casimiro no puede ser eliminada.');
      return;
    }

    if (window.confirm(`¿Estás segura de eliminar el acceso para "${userName}"?`)) {
      const updated = users.filter(u => u.id !== userId);
      onSaveUsers(updated);
      showToast?.(`Usuario "${userName}" eliminado.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-stone-200 text-stone-900 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-stone-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Gestión de Usuarios y Accesos
              </h3>
              <p className="text-xs text-stone-400 font-light">
                Administra quién puede entrar al portal de cotizaciones
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

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Active Users List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                <span>Usuarios con Acceso ({users.length}):</span>
              </h4>
            </div>

            <div className="space-y-2.5">
              {users.map((u) => {
                const isPrimaryAdmin = u.id === 'usr_eliotte';
                return (
                  <div
                    key={u.id}
                    className="p-3 sm:p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-stone-300 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                        u.isAdmin ? 'bg-stone-900 text-white shadow-sm' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs sm:text-sm text-stone-900">
                            {u.name}
                          </span>
                          {u.isAdmin && (
                            <span className="text-[10px] bg-stone-200 text-stone-800 font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <ShieldCheck className="w-3 h-3 text-stone-700" />
                              <span>Admin</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-500 mt-0.5">
                          Usuario: <strong className="text-stone-800 font-mono">@{u.username}</strong>
                          <span className="mx-1.5">•</span>
                          Cargo: <span className="text-stone-700">{u.role || 'Personal'}</span>
                        </p>

                        <div className="flex items-center space-x-1.5 text-[11px] text-stone-400 mt-0.5">
                          <span>Clave:</span>
                          <strong className="font-mono text-stone-600">
                            {visiblePasswords[u.id] ? u.password : '••••••••'}
                          </strong>
                          <button
                            type="button"
                            onClick={() => toggleVisiblePassword(u.id)}
                            className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
                            title={visiblePasswords[u.id] ? 'Ocultar contraseña' : 'Ver contraseña'}
                          >
                            {visiblePasswords[u.id] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(u)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-stone-300 hover:border-stone-400 text-stone-700 transition-all flex items-center space-x-1 shadow-2xs"
                        title="Cambiar clave o datos de este usuario"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>

                      {!isPrimaryAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* User Form (Create or Edit) */}
          <div className="pt-4 border-t border-stone-200">
            <div className="bg-stone-50/80 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserPlus className="w-4 h-4 text-rose-600" />
                  <span>{editingUserId ? 'Editar Usuario / Cambiar Clave' : 'Registrar Nuevo Miembro del Equipo:'}</span>
                </h4>
                {editingUserId && (
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="text-xs text-stone-500 hover:text-stone-800 font-medium"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSaveUser} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Nombre Completo */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ej: Sofia Martinez"
                      required
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  {/* Nombre de usuario */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Nombre de Usuario (Login)
                    </label>
                    <input
                      type="text"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value)}
                      placeholder="ej: sofia"
                      required
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono lowercase focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Contraseña / PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showFormPassword ? 'text' : 'password'}
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        placeholder="ej: clave123"
                        required
                        className="w-full px-3 pr-8 py-2 bg-white border border-stone-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormPassword(!showFormPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                        title={showFormPassword ? 'Ocultar' : 'Mostrar'}
                      >
                        {showFormPassword ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Rol o Cargo */}
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Cargo / Especialidad
                    </label>
                    <input
                      type="text"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      placeholder="ej: Asistente / Maquilladora Social"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-400 outline-none text-stone-900"
                    />
                  </div>
                </div>

                {/* Checkbox Admin */}
                <div className="flex items-center space-x-2 pt-1">
                  <label className="flex items-center space-x-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsAdmin}
                      onChange={(e) => setFormIsAdmin(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-400"
                    />
                    <span>Conceder permisos de Administradora (gestionar otros usuarios)</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-2">
                  {editingUserId && (
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{editingUserId ? 'Guardar Cambios' : 'Registrar Usuario'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500">
          <span>ℹ️ Los usuarios se guardan en el navegador y quedan respaldados automáticamente en las copias de seguridad en <strong>.json</strong>.</span>
        </div>
      </div>
    </div>
  );
}

