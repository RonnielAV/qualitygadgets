import { NextResponse } from 'next/server';
import { isDbConnected, query } from '@/lib/db';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

// GET: Obtener todos los productos y sus variantes
export async function GET() {
  try {
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, products: MOCK_PRODUCTS, source: 'local' });
    }

    const products = await query(`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', v.id,
              'productId', v.product_id,
              'sku', v.sku,
              'title', v.title,
              'priceDop', v.price_dop,
              'compareAtPriceDop', v.compare_at_price_dop,
              'costPriceDop', v.cost_price_dop,
              'physicalStock', v.physical_stock,
              'committedStock', v.committed_stock,
              'availableStock', v.available_stock,
              'imageUrls', v.image_urls,
              'options', v.options
            )
          ) FILTER (WHERE v.id IS NOT NULL),
          '[]'::json
        ) as variants
      FROM products p
      LEFT JOIN product_variants v ON p.id = v.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `);

    // Normalizar campos para compatibilidad exacta con frontend
    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: p.description,
      brandId: p.brand_id,
      brand: p.brand,
      categoryId: p.category_id,
      category: p.category,
      status: p.status,
      thumbnailUrl: p.thumbnail_url,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
      options: typeof p.options === 'string' ? JSON.parse(p.options) : p.options || [],
      isDeal: !!p.is_deal,
      isFeatured: !!p.is_featured,
      ratingAvg: Number(p.rating_avg || 5),
      ratingCount: Number(p.rating_count || 1),
      variants: Array.isArray(p.variants) ? p.variants : typeof p.variants === 'string' ? JSON.parse(p.variants) : [],
    }));

    return NextResponse.json({ success: true, products: formatted, source: 'postgres' });
  } catch (error: any) {
    console.error('Error fetching products from Vercel Postgres:', error);
    return NextResponse.json({ success: true, products: MOCK_PRODUCTS, source: 'fallback_error', error: error?.message });
  }
}

// POST: Crear nuevo producto y variantes
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!isDbConnected()) {
      return NextResponse.json({ success: true, product: body, source: 'local_mode' });
    }

    const {
      id = `prod-${Date.now()}`,
      title,
      handle = (title || 'gadget').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description = '',
      brandId,
      brand,
      categoryId,
      category,
      status = 'published',
      thumbnailUrl = '',
      images = [],
      options = [],
      isDeal = false,
      isFeatured = true,
      variants = [],
    } = body;

    // 1. Insertar producto principal
    await query(
      `INSERT INTO products (
        id, title, handle, description, brand_id, brand, category_id, category, status, thumbnail_url, images, options, is_deal, is_featured, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        handle = EXCLUDED.handle,
        description = EXCLUDED.description,
        brand_id = EXCLUDED.brand_id,
        brand = EXCLUDED.brand,
        category_id = EXCLUDED.category_id,
        category = EXCLUDED.category,
        status = EXCLUDED.status,
        thumbnail_url = EXCLUDED.thumbnail_url,
        images = EXCLUDED.images,
        options = EXCLUDED.options,
        is_deal = EXCLUDED.is_deal,
        is_featured = EXCLUDED.is_featured,
        updated_at = NOW();`,
      [
        id,
        title,
        handle,
        description,
        brandId || '',
        brand || '',
        categoryId || '',
        typeof category === 'string' ? category : (category as any)?.name || '',
        status,
        thumbnailUrl,
        JSON.stringify(images),
        JSON.stringify(options),
        isDeal,
        isFeatured,
      ]
    );

    // 2. Insertar variantes
    if (Array.isArray(variants)) {
      // Eliminar variantes antiguas del producto para recrear limpiamente
      await query('DELETE FROM product_variants WHERE product_id = $1', [id]);

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const vId = v.id || `var-${Date.now()}-${i}`;
        await query(
          `INSERT INTO product_variants (
            id, product_id, sku, title, price_dop, compare_at_price_dop, cost_price_dop, physical_stock, committed_stock, available_stock, image_urls, options
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            vId,
            id,
            v.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
            v.title || 'Estándar',
            Number(v.priceDop || 0),
            Number(v.compareAtPriceDop || v.priceDop || 0),
            Number(v.costPriceDop || 0),
            Number(v.physicalStock ?? 10),
            Number(v.committedStock || 0),
            Number(v.availableStock ?? v.physicalStock ?? 10),
            JSON.stringify(v.imageUrls || [thumbnailUrl]),
            JSON.stringify(v.options || {}),
          ]
        );
      }
    }

    return NextResponse.json({ success: true, id, message: 'Producto guardado en PostgreSQL.' });
  } catch (error: any) {
    console.error('Error saving product in Vercel Postgres:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

// DELETE: Eliminar producto o grupo de productos
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all') === 'true';

    if (!isDbConnected()) {
      return NextResponse.json({ success: true, message: 'Modo local simulado.' });
    }

    if (all) {
      await query('DELETE FROM product_variants;');
      await query('DELETE FROM products;');
      return NextResponse.json({ success: true, message: 'Todos los productos han sido eliminados de Postgres.' });
    }

    if (id) {
      await query('DELETE FROM product_variants WHERE product_id = $1;', [id]);
      await query('DELETE FROM products WHERE id = $1;', [id]);
      return NextResponse.json({ success: true, message: `Producto ${id} eliminado.` });
    }

    // Eliminación por lote JSON en body
    const body = await req.json().catch(() => ({}));
    if (Array.isArray(body.ids) && body.ids.length > 0) {
      const placeholders = body.ids.map((_: any, idx: number) => `$${idx + 1}`).join(',');
      await query(`DELETE FROM product_variants WHERE product_id IN (${placeholders});`, body.ids);
      await query(`DELETE FROM products WHERE id IN (${placeholders});`, body.ids);
      return NextResponse.json({ success: true, count: body.ids.length });
    }

    return NextResponse.json({ success: false, message: 'Parámetro id o lista de ids requerido.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error deleting products from Vercel Postgres:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
