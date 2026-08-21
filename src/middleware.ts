import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate Limiter en memoria del Edge / Server
const rateLimitMap = new Map<string, { count: number; firstAttempt: number; lockedUntil?: number }>();

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

  // 1. Rate Limiting agresivo para rutas de autenticación de admin (5 fallos = bloqueo)
  if (pathname.startsWith('/api/admin/auth/')) {
    const now = Date.now();
    const rateData = rateLimitMap.get(ip) || { count: 0, firstAttempt: now };

    // Verificar si está en bloqueo temporal
    if (rateData.lockedUntil && now < rateData.lockedUntil) {
      const remainingMin = Math.ceil((rateData.lockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `[ACCESO BLOQUEADO POR CIBERSEGURIDAD] Demasiados intentos. Espera ${remainingMin} minutos.`,
        },
        { status: 429 }
      );
    }

    // Reiniciar ventana tras 15 minutos
    if (now - rateData.firstAttempt > 15 * 60 * 1000) {
      rateData.count = 0;
      rateData.firstAttempt = now;
      rateData.lockedUntil = undefined;
    }

    rateData.count += 1;

    if (rateData.count > 10) {
      rateData.lockedUntil = now + 15 * 60 * 1000; // 15 minutos de baneo
      rateLimitMap.set(ip, rateData);
      return NextResponse.json(
        {
          success: false,
          message: '[DEFENSA PERIMETRAL] IP bloqueada temporalmente por actividad sospechosa.',
        },
        { status: 429 }
      );
    }

    rateLimitMap.set(ip, rateData);
  }

  // 2. Inyección de Cabeceras de Seguridad Estrictas (Defense-in-Depth)
  const response = NextResponse.next();

  // Content-Security-Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // Strict-Transport-Security (HSTS 2 años)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Anti-Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Anti-MIME-Sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
