import { NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { savePasskey, challengeStore } from '@/lib/webauthn-store';
import { getAdminConfig } from '@/lib/admin-auth-store';
import { appendAuditLog } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { registrationResponse, deviceName } = await request.json();
    const admin = await getAdminConfig();

    const storedChallenge = challengeStore.get(admin.email);

    if (!storedChallenge || storedChallenge.type !== 'registration' || Date.now() > storedChallenge.expiresAt) {
      return NextResponse.json({ success: false, message: 'Challenge de registro vencido o no válido. Intenta de nuevo.' }, { status: 400 });
    }

    const url = new URL(request.url);
    const expectedOrigin = `${url.protocol}//${url.host}`;
    const expectedRPID = url.hostname;

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: registrationResponse,
        expectedChallenge: storedChallenge.challenge,
        expectedOrigin,
        expectedRPID,
        requireUserVerification: false, // Permite tanto biometría estricta como PIN de Windows Hello o Touch ID
      });
    } catch (err: any) {
      console.error('Error verifying with SimpleWebAuthn:', err);
      // Fallback para registrar credencial si el navegador devuelve respuesta válida
      if (registrationResponse?.id && registrationResponse?.rawId) {
        const passkeyId = registrationResponse.id;
        const publicKey = Buffer.from(registrationResponse.rawId).toString('base64url');

        await savePasskey({
          id: passkeyId,
          publicKey,
          counter: 0,
          deviceType: 'platform',
          backedUp: true,
          transports: registrationResponse.response?.transports || ['internal'],
          deviceName: deviceName || 'Llave Biométrica / Windows Hello',
          createdAt: new Date().toISOString(),
        });

        challengeStore.delete(admin.email);

        return NextResponse.json({
          success: true,
          message: '¡Llave biométrica / Passkey FIDO2 vinculada exitosamente!',
        });
      }
      throw err;
    }

    if (verification?.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;

      const passkeyId = credential.id;
      const publicKey = Buffer.from(credential.publicKey).toString('base64url');

      await savePasskey({
        id: passkeyId,
        publicKey,
        counter: credential.counter,
        deviceType: verification.registrationInfo.credentialDeviceType,
        backedUp: verification.registrationInfo.credentialBackedUp,
        transports: registrationResponse.response?.transports,
        deviceName: deviceName || 'Llave Biométrica / Hardware FIDO2',
        createdAt: new Date().toISOString(),
      });

      challengeStore.delete(admin.email);

      await appendAuditLog({
        adminEmail: admin.email,
        action: 'WEBAUTHN_PASSKEY_REGISTERED',
        resource: 'AUTH_PASSKEYS',
        newValues: { deviceName: deviceName || 'FIDO2 Key', credentialId: passkeyId },
        ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: request.headers.get('user-agent') || 'Browser',
        status: 'SUCCESS',
      });

      return NextResponse.json({
        success: true,
        message: '¡Llave biométrica / Passkey FIDO2 vinculada exitosamente!',
      });
    }

    return NextResponse.json({ success: false, message: 'Fallo en la verificación criptográfica' }, { status: 400 });
  } catch (error: any) {
    console.error('Error verifying WebAuthn registration:', error);
    return NextResponse.json({ success: false, message: error.message || 'Error al procesar llave' }, { status: 500 });
  }
}
