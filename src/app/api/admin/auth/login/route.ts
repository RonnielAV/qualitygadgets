import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyAdminPassword, getAdminConfig } from '@/lib/admin-auth-store';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, message: 'Contraseña requerida' }, { status: 400 });
    }

    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 401 });
    }

    const admin = await getAdminConfig();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 12 * 60 * 60 * 1000; // 12 horas

    const response = NextResponse.json({
      success: true,
      token,
      admin: {
        name: admin.name,
        email: admin.email,
      },
      expiresAt,
      message: 'Inicio de sesión exitoso',
    });

    response.cookies.set('qg_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error de autenticación' }, { status: 500 });
  }
}
