import { NextResponse } from 'next/server';
import { updateAdminCredentials, getAdminConfig } from '@/lib/admin-auth-store';

export async function GET() {
  try {
    const admin = await getAdminConfig();
    return NextResponse.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        phoneWhatsApp: admin.phoneWhatsApp,
        businessName: admin.businessName,
        rnc: admin.rnc,
        twoFactorEnabled: admin.twoFactorEnabled,
        lowStockThreshold: admin.lowStockThreshold,
        banks: admin.banks,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await updateAdminCredentials(body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    const admin = result.admin!;
    return NextResponse.json({
      success: true,
      admin: {
        name: admin.name,
        email: admin.email,
        phoneWhatsApp: admin.phoneWhatsApp,
        businessName: admin.businessName,
        rnc: admin.rnc,
        twoFactorEnabled: admin.twoFactorEnabled,
        lowStockThreshold: admin.lowStockThreshold,
        banks: admin.banks,
        updatedAt: admin.updatedAt,
      },
      message: 'Configuración y perfil del administrador actualizados con éxito',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Error al actualizar' }, { status: 500 });
  }
}
