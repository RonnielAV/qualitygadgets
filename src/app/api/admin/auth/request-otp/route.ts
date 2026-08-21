import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { otpStore } from '@/lib/auth-otp-store';
import { getAdminConfig } from '@/lib/admin-auth-store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Correo electrónico requerido' },
        { status: 400 }
      );
    }

    const admin = await getAdminConfig();
    const normalizedEmail = email.trim().toLowerCase();
    const configuredAdminEmail = (admin.email || 'contacto@qualitygadgetsrd.com').trim().toLowerCase();

    // Permitir el correo configurado del administrador o correos oficiales
    const isAuthorized =
      normalizedEmail === configuredAdminEmail ||
      normalizedEmail === 'contacto@qualitygadgetsrd.com' ||
      normalizedEmail === 'ronnielaybar@gmail.com' ||
      normalizedEmail === 'admin@qualitygadgetsrd.com';

    const rawOtp = crypto.randomInt(100000, 999999).toString();
    const challengeId = crypto.randomBytes(16).toString('hex');
    const hashedOtp = crypto.createHash('sha256').update(rawOtp).digest('hex');

    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos de validez

    otpStore.set(challengeId, {
      hashedOtp,
      expiresAt,
      attempts: 0,
      email: normalizedEmail,
    });

    console.log(`\n================================================================`);
    console.log(`[SEGURIDAD ADMIN QUALITY GADGETS RD] CÓDIGO OTP DE UN SOLO USO:`);
    console.log(`Destinatario: ${normalizedEmail}`);
    console.log(`Código OTP (Válido 10 min): >>> ${rawOtp} <<<`);
    console.log(`Challenge ID: ${challengeId}`);
    console.log(`================================================================\n`);

    const [userPart, domainPart] = normalizedEmail.split('@');
    const maskedEmail = `${userPart.substring(0, 2)}***@${domainPart || 'gmail.com'}`;

    return NextResponse.json({
      success: true,
      challengeId,
      maskedEmail,
      message: `Código de seguridad OTP generado para ${maskedEmail}.`,
      otpCode: rawOtp,
      devHint: rawOtp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error de servidor' },
      { status: 500 }
    );
  }
}
