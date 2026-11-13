// User and Team Account Management for Eliotte MUA

export const STORAGE_USERS_KEY = 'eliotte_mua_users_v3';

export const DEFAULT_USERS = [
  {
    id: 'usr_eliotte',
    username: 'eliotte',
    name: 'Eliotte Casimiro',
    role: 'Directora & MUA Principal',
    password: 'mua2026',
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_asistente',
    username: 'asistente',
    name: 'Asistente de Cotizaciones',
    role: 'Asistente / Staff',
    password: '1234',
    isAdmin: false,
    createdAt: new Date().toISOString(),
  }
];

// Load stored users from localStorage, defaulting to standard accounts
export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading users from localStorage', e);
  }
  return DEFAULT_USERS;
}

// Save users list to localStorage
export function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving users to localStorage', e);
  }
}

// Authenticate a user against stored accounts
export function authenticateUser(username, password) {
  const users = getStoredUsers();
  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const found = users.find(
    (u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass
  );

  if (found) {
    return {
      success: true,
      user: {
        id: found.id,
        username: found.username,
        name: found.name,
        role: found.role,
        isAdmin: !!found.isAdmin,
      }
    };
  }

  return {
    success: false,
    message: 'Usuario o contraseña incorrectos. Verifica tus credenciales.'
  };
}

