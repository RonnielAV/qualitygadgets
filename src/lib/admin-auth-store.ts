import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface BankAccountConfig {
  bhdNumber: string;
  banreservasNumber: string;
  popularNumber: string;
  titularName: string;
  billetEnabled: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneWhatsApp: string;
  businessName: string;
  rnc: string;
  passwordHash: string;
  salt: string;
  twoFactorEnabled: boolean;
  lowStockThreshold: number;
  banks: BankAccountConfig;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ADMIN_FILE = path.join(DATA_DIR, 'admin_config.json');

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

const defaultSalt = crypto.randomBytes(16).toString('hex');
const DEFAULT_ADMIN: AdminUser = {
  id: 'admin_default',
  name: 'Ronniel Aybar Vessuup',
  email: 'contacto@qualitygadgetsrd.com',
  phoneWhatsApp: '18093160799',
  businessName: 'Quality Gadgets RD SRL',
  rnc: '1-32-48921-9',
  salt: defaultSalt,
  passwordHash: hashPassword('quality2026', defaultSalt),
  twoFactorEnabled: true,
  lowStockThreshold: 5,
  banks: {
    bhdNumber: '20733250038',
    banreservasNumber: '9606273048',
    popularNumber: '843022187',
    titularName: 'Ronniel Aybar Vessuup',
    billetEnabled: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function ensureAdminFile(): Promise<AdminUser> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(ADMIN_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Merge with defaults in case of new fields
      return { ...DEFAULT_ADMIN, ...parsed };
    } catch {
      await fs.writeFile(ADMIN_FILE, JSON.stringify(DEFAULT_ADMIN, null, 2), 'utf-8');
      return DEFAULT_ADMIN;
    }
  } catch (e) {
    return DEFAULT_ADMIN;
  }
}

export async function getAdminConfig(): Promise<AdminUser> {
  return await ensureAdminFile();
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const admin = await getAdminConfig();
  const computedHash = hashPassword(password, admin.salt);
  return computedHash === admin.passwordHash;
}

export async function updateAdminCredentials(params: Partial<{
  name: string;
  email: string;
  phoneWhatsApp: string;
  businessName: string;
  rnc: string;
  currentPassword: string;
  newPassword: string;
  twoFactorEnabled: boolean;
  lowStockThreshold: number;
  banks: Partial<BankAccountConfig>;
}>): Promise<{ success: boolean; admin?: AdminUser; message?: string }> {
  const admin = await getAdminConfig();

  // Si intenta cambiar contraseña, verificar la actual si se proporcionó
  if (params.newPassword && params.newPassword.trim().length >= 6) {
    if (params.currentPassword) {
      const isCurrentValid = hashPassword(params.currentPassword, admin.salt) === admin.passwordHash;
      if (!isCurrentValid) {
        return { success: false, message: 'La contraseña actual no es correcta' };
      }
    }
    const newSalt = crypto.randomBytes(16).toString('hex');
    admin.salt = newSalt;
    admin.passwordHash = hashPassword(params.newPassword, newSalt);
  }

  if (params.name) admin.name = params.name;
  if (params.email) admin.email = params.email.trim().toLowerCase();
  if (params.phoneWhatsApp) admin.phoneWhatsApp = params.phoneWhatsApp.replace(/[^0-9]/g, '');
  if (params.businessName) admin.businessName = params.businessName;
  if (params.rnc) admin.rnc = params.rnc;
  if (typeof params.twoFactorEnabled === 'boolean') admin.twoFactorEnabled = params.twoFactorEnabled;
  if (typeof params.lowStockThreshold === 'number') admin.lowStockThreshold = params.lowStockThreshold;

  if (params.banks) {
    admin.banks = { ...admin.banks, ...params.banks };
  }

  admin.updatedAt = new Date().toISOString();

  await fs.writeFile(ADMIN_FILE, JSON.stringify(admin, null, 2), 'utf-8');
  return { success: true, admin };
}
