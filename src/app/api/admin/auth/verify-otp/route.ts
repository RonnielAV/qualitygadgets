import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { otpStore } from '@/lib/auth-otp-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { challengeId, otp } = await request.json();

    if (!challengeId || !otp) {
      return NextResponse.json(
        { success: false, message: 'Challenge ID y código OTP requeridos' },
        { status: 400 }
      );
    }

    const entry = otpStore.get(challengeId);

    if (!entry) {
      return NextResponse.json(
        { success: false, message: 'Código vencido o solicitud no válida. Solicita uno nuevo.' },
        { status: 401 }
      );
    }

    // Comprobar expiración
    if (Date.now() > entry.expiresAt) {
      otpStore.delete(challengeId);
      return NextResponse.json(
        { success: false, message: 'El código OTP ha expirado.' },
        { status: 401 }
      );
    }

    // Control de fuerza bruta (máximo 5 intentos)
    entry.attempts += 1;
    if (entry.attempts > 5) {
      otpStore.delete(challengeId);
      return NextResponse.json(
        { success: false, message: 'Demasiados intentos fallidos. Solicita un nuevo código por seguridad.' },
        { status: 429 }
      );
    }

    // Verificar hash SHA-256
    const cleanOtp = otp.toString().trim();
    const computedHash = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    if (computedHash !== entry.hashedOtp) {
      return NextResponse.json(
        { success: false, message: `Código incorrecto. Intentos restantes: ${5 - entry.attempts}` },
        { status: 401 }
      );
    }

    // OTP Correcto: Invalida el código para que sea ESTRICTAMENTE DE UN SOLO USO (Anti-Replay)
    otpStore.delete(challengeId);

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresSession = Date.now() + 8 * 60 * 60 * 1000;

    const response = NextResponse.json({
      success: true,
      token: sessionToken,
      adminEmail: entry.email,
      expiresAt: expiresSession,
      message: 'Autenticación exitosa. Sesión administrativa segura establecida.',
    });

    response.cookies.set('qg_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error de verificación' },
      { status: 500 }
    );
  }
}
