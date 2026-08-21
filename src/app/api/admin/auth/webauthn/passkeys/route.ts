import { NextResponse } from 'next/server';
import { getAllPasskeys, deletePasskey } from '@/lib/webauthn-store';
import { appendAuditLog } from '@/lib/audit-logger';
import { getAdminConfig } from '@/lib/admin-auth-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const passkeys = await getAllPasskeys();
    return NextResponse.json({ success: true, passkeys });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { passkeyId } = await request.json();
    if (!passkeyId) {
      return NextResponse.json({ success: false, message: 'ID de passkey requerido' }, { status: 400 });
    }

    const deleted = await deletePasskey(passkeyId);
    const admin = await getAdminConfig();

    await appendAuditLog({
      adminEmail: admin.email,
      action: 'WEBAUTHN_PASSKEY_DELETED',
      resource: 'AUTH_PASSKEYS',
      newValues: { credentialId: passkeyId },
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Browser',
      status: deleted ? 'SUCCESS' : 'WARNING',
    });

    return NextResponse.json({ success: true, message: 'Llave biométrica revocada con éxito' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
