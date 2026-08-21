import { NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { getAllPasskeys, challengeStore } from '@/lib/webauthn-store';
import { getAdminConfig } from '@/lib/admin-auth-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getAdminConfig();
    const passkeys = await getAllPasskeys();

    const url = new URL(request.url);
    const rpID = url.hostname;

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: passkeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports as any,
      })),
      userVerification: 'required',
    });

    challengeStore.set(admin.email, {
      challenge: options.challenge,
      email: admin.email,
      expiresAt: Date.now() + 2 * 60 * 1000,
      type: 'authentication',
    });

    return NextResponse.json({
      success: true,
      hasPasskeys: passkeys.length > 0,
      options,
    });
  } catch (error: any) {
    console.error('Error generating WebAuthn login options:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
