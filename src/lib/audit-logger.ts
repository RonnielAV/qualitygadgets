import fs from 'fs/promises';
import path from 'path';
import { isDbConnected, query } from '@/lib/db';

export interface AuditLogEntry {
  id: string;
  adminEmail: string;
  action: string;
  resource: string;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  status: 'SUCCESS' | 'DENIED' | 'SUDO_REQUIRED' | 'WARNING' | string;
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
  if (isDbConnected()) {
    try {
      const rows = await query(`
        SELECT 
          id,
          admin_email as "adminEmail",
          action,
          resource,
          ip_address as "ipAddress",
          user_agent as "userAgent",
          status,
          timestamp
        FROM admin_audit_logs
        ORDER BY timestamp DESC
        LIMIT $1;
      `, [limit]);

      if (rows.length > 0) {
        return rows.map((r) => ({
          ...r,
          timestamp: new Date(r.timestamp).toISOString(),
        }));
      }
    } catch (e) {
      console.error('Error fetching audit logs from Postgres, fallback to file:', e);
    }
  }

  const logs = await ensureAuditFile();
  return logs.slice(0, limit);
}

export async function appendAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
  const newId = `audit_${Date.now()}_${Math.random().toString(36).substring(5)}`;
  const timestamp = new Date().toISOString();

  const newEntry: AuditLogEntry = {
    id: newId,
    ...entry,
    timestamp,
  };

  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO admin_audit_logs (id, admin_email, action, resource, ip_address, user_agent, status, timestamp)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW());`,
        [
          newId,
          entry.adminEmail,
          entry.action,
          entry.resource || 'SYSTEM',
          entry.ipAddress || '127.0.0.1',
          entry.userAgent || 'Browser',
          entry.status,
        ]
      );
    } catch (e) {
      console.error('Error saving audit log in Postgres:', e);
    }
  }

  const currentLogs = await ensureAuditFile();
  const updatedLogs = [newEntry, ...currentLogs.slice(0, 499)];
  await fs.writeFile(AUDIT_LOG_FILE, JSON.stringify(updatedLogs, null, 2), 'utf-8').catch(() => {});

  return newEntry;
}
