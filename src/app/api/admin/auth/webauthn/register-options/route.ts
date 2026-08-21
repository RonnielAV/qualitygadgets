import { NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { getAllPasskeys, challengeStore } from '@/lib/webauthn-store';
import { getAdminConfig } from '@/lib/admin-auth-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getAdminConfig();
    const existingPasskeys = await getAllPasskeys();

    const url = new URL(request.url);
    const rpID = url.hostname;

    const options = await generateRegistrationOptions({
      rpName: 'Quality Gadgets RD Admin',
      rpID,
      userID: new TextEncoder().encode(admin.id),
      userName: admin.email,
      userDisplayName: admin.name,
      attestationType: 'none',
      excludeCredentials: existingPasskeys.map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports as any,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'required',
      },
    });

    challengeStore.set(admin.email, {
      challenge: options.challenge,
      email: admin.email,
      expiresAt: Date.now() + 2 * 60 * 1000,
      type: 'registration',
    });

    return NextResponse.json({ success: true, options });
  } catch (error: any) {
    console.error('Error generating WebAuthn registration options:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
