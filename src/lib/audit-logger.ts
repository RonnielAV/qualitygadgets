import fs from 'fs/promises';
import path from 'path';

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  action: string;
  resource: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'DENIED' | 'SUDO_REQUIRED' | 'WARNING';
  timestamp: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'admin_audit_logs.json');

async function ensureAuditFile(): Promise<AuditLogEntry[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const content = await fs.readFile(AUDIT_LOG_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
  } catch {
    return [];
  }
}

export async function getAuditLogs(limit = 100): Promise<AuditLogEntry[]> {
  const logs = await ensureAuditFile();
  return logs.slice(0, limit);
}

export async function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
  const currentLogs = await ensureAuditFile();
  const newEntry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(5)}`,
    ...entry,
    timestamp: new Date().toISOString(),
  };

  // Append-only (el más reciente primero)
  const updatedLogs = [newEntry, ...currentLogs.slice(0, 499)]; // Guardar hasta 500 eventos
  await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(updatedLogs, null, 2), 'utf-8');

  return newEntry;
}
