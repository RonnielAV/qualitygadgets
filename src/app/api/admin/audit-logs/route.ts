import { NextResponse } from 'next/server';
import { getAuditLogs, appendAuditLog } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const logs = await getAuditLogs(150);
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, resource, oldValues, newValues, adminEmail } = body;

    const log = await appendAuditLog({
      adminEmail: adminEmail || 'admin@qualitygadgetsrd.com',
      action,
      resource,
      oldValues,
      newValues,
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Browser',
      status: 'SUCCESS',
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
