import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No se envió ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Formato no soportado. Usa JPG, PNG, WEBP o GIF.' },
        { status: 400 }
      );
    }

    // Buffer del archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar en public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      message: 'Foto cargada exitosamente',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error al cargar imagen' },
      { status: 500 }
    );
  }
}
