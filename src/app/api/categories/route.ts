import { NextResponse } from 'next/server';
import { isDbConnected, query } from '@/lib/db';
import { CATEGORIES } from '@/lib/mock-data';

export async function GET() {
  try {
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, categories: CATEGORIES, source: 'local' });
    }

    const categories = await query('SELECT * FROM categories ORDER BY name ASC;');
    return NextResponse.json({ success: true, categories, source: 'postgres' });
  } catch (error: any) {
    console.error('Error fetching categories from Postgres:', error);
    return NextResponse.json({ success: true, categories: CATEGORIES, source: 'fallback' });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, category: body });
    }

    const { id = `cat-${Date.now()}`, name, handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), description = '', icon = 'Cpu' } = body;

    await query(
      `INSERT INTO categories (id, name, handle, description, icon)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         handle = EXCLUDED.handle,
         description = EXCLUDED.description,
         icon = EXCLUDED.icon;`,
      [id, name, handle, description, icon]
    );

    return NextResponse.json({ success: true, category: { id, name, handle, description, icon } });
  } catch (error: any) {
    console.error('Error saving category to Postgres:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID requerido' }, { status: 400 });

    if (isDbConnected()) {
      await query('DELETE FROM categories WHERE id = $1;', [id]);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
