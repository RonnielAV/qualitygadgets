// Client Management Utilities for Eliotte MUA
export const STORAGE_CLIENTS_KEY = 'eliotte_mua_clients_v3';

export const DEFAULT_CLIENTS = [
  {
    id: 'cli_persio_abreu',
    name: 'Eugenia Pérez',
    company: 'Persio Abreu SRL',
    rnc: '102-32053-5',
    email: 'persioabreu@gmail.com',
    phone: '(849) 220-9464',
    notes: 'Cliente corporativo frecuente para campañas editoriales y comerciales.',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'cli_camila_casual',
    name: 'Camila Rodriguez',
    company: 'Camila Casual',
    rnc: '131-45678-2',
    email: 'camilacasual@gmail.com',
    phone: '(809) 555-8921',
    notes: 'Sesiones de fotos de moda y catálogo.',
    createdAt: '2026-02-10T14:30:00.000Z',
  },
  {
    id: 'cli_novia_santiago',
    name: 'Laura Gómez',
    company: '',
    rnc: '',
    email: 'lauragomez.boda@gmail.com',
    phone: '(829) 440-1234',
    notes: 'Boda Santiago - Airbrush y retoque novia.',
    createdAt: '2026-03-01T16:00:00.000Z',
  }
];

export function getStoredClients() {
  try {
    const raw = localStorage.getItem(STORAGE_CLIENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading clients from localStorage', e);
  }
  return DEFAULT_CLIENTS;
}

export function saveStoredClients(clients) {
  try {
    localStorage.setItem(STORAGE_CLIENTS_KEY, JSON.stringify(clients));
  } catch (e) {
    console.error('Error saving clients to localStorage', e);
  }
}

