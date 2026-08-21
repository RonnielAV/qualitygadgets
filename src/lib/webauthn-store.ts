import fs from 'fs/promises';
import path from 'path';

export interface StoredPasskey {
  id: string; // Base64URL credential ID
  publicKey: string; // Base64URL public key bytes
  counter: number;
  deviceType: string;
  backedUp: boolean;
  transports?: string[];
  deviceName: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const PASSKEYS_FILE = path.join(DATA_DIR, 'admin_passkeys.json');

// Challenge store temporal en memoria
interface WebAuthnChallenge {
  challenge: string;
  email: string;
  expiresAt: number;
  type: 'registration' | 'authentication' | 'sudo';
}

declare global {
  var __qg_webauthn_challenges__: Map<string, WebAuthnChallenge> | undefined;
}

export const challengeStore: Map<string, WebAuthnChallenge> =
  global.__qg_webauthn_challenges__ || (global.__qg_webauthn_challenges__ = new Map());

async function ensurePasskeysFile(): Promise<StoredPasskey[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(PASSKEYS_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      await fs.writeFile(PASSKEYS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
  } catch {
    return [];
  }
}

export async function getAllPasskeys(): Promise<StoredPasskey[]> {
  return await ensurePasskeysFile();
}

export async function savePasskey(passkey: StoredPasskey): Promise<void> {
  const current = await getAllPasskeys();
  const updated = [passkey, ...current.filter((p) => p.id !== passkey.id)];
  await fs.writeFile(PASSKEYS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}

export async function deletePasskey(passkeyId: string): Promise<boolean> {
  const current = await getAllPasskeys();
  const filtered = current.filter((p) => p.id !== passkeyId);
  if (filtered.length === current.length) return false;
  await fs.writeFile(PASSKEYS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function updatePasskeyCounter(passkeyId: string, newCounter: number): Promise<void> {
  const current = await getAllPasskeys();
  const idx = current.findIndex((p) => p.id === passkeyId);
  if (idx !== -1) {
    current[idx].counter = newCounter;
    await fs.writeFile(PASSKEYS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  }
}
