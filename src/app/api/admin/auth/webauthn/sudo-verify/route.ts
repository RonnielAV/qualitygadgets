import { NextResponse } from 'next/server';
import { verifyAdminPassword, getAdminConfig } from '@/lib/admin-auth-store';
import { appendAuditLog } from '@/lib/audit-logger';

export async function POST(request: Request) {
  try {
    const { password, actionType, resource } = await request.json();
    const admin = await getAdminConfig();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Confirmación de seguridad requerida' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    if (!isValid) {
      await appendAuditLog({
        adminEmail: admin.email,
        action: `SUDO_CONFIRMATION_FAILED:${actionType || 'UNKNOWN'}`,
        resource: resource || 'CRITICAL_ACTION',
        ipAddress,
        userAgent,
        status: 'DENIED',
      });

      return NextResponse.json({
        success: false,
        message: 'Contraseña de autorización sudo incorrecta. Acción denegada.',
      }, { status: 401 });
    }

    // Registrar en auditoría
    await appendAuditLog({
      adminEmail: admin.email,
      action: `SUDO_STEP_UP_APPROVED:${actionType || 'CRITICAL_ACTION'}`,
      resource: resource || 'SYSTEM',
      ipAddress,
      userAgent,
      status: 'SUCCESS',
    });

    return NextResponse.json({
      success: true,
      message: 'Autorización Sudo concedida para ejecutar la acción crítica.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
