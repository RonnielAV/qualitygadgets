import { NextResponse } from 'next/server';
import { isDbConnected, initDatabaseTables, query } from '@/lib/db';
import { CATEGORIES, MOCK_PRODUCTS } from '@/lib/mock-data';

export async function POST(req: Request) {
  try {
    if (!isDbConnected()) {
      return NextResponse.json(
        {
          success: false,
          message: 'No se detectaron credenciales de conexión (POSTGRES_URL o DATABASE_URL). Configúralas en Vercel -> Storage -> Postgres.',
        },
        { status: 400 }
      );
    }

    // 1. Crear tablas
    const initResult = await initDatabaseTables();
    if (!initResult.success) {
      return NextResponse.json({ success: false, error: initResult }, { status: 500 });
    }

    // 2. Comprobar si ya existen productos
    const existingProds = await query('SELECT COUNT(*) as count FROM products');
    const prodCount = Number(existingProds[0]?.count || 0);

    let seeded = false;
    if (prodCount === 0) {
      // Sembrar categorías
      for (const cat of CATEGORIES) {
        await query(
          `INSERT INTO categories (id, name, handle, description, icon) 
           VALUES ($1, $2, $3, $4, $5) 
           ON CONFLICT (id) DO NOTHING`,
          [cat.id, cat.name, cat.handle, cat.description || '', cat.iconName || 'Cpu']
        );
      }

      // Sembrar marcas
      const brandsList = ['Apple', 'Sony', 'DJI', 'Samsung', 'Bose', 'Nintendo'];
      for (const b of brandsList) {
        const bId = `brand-${b.toLowerCase()}`;
        await query(
          `INSERT INTO brands (id, name, slug, description) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (id) DO NOTHING`,
          [bId, b, b.toLowerCase(), `Equipos y accesorios oficiales de ${b}`]
        );
      }

      // Sembrar productos iniciales
      for (const p of MOCK_PRODUCTS) {
        const brandName = typeof p.brand === 'object' ? (p.brand as any)?.name : p.brand || 'Apple';
        const brandId = `brand-${String(brandName).toLowerCase()}`;
        const catId = (p as any).categoryId || (typeof p.category === 'object' ? (p.category as any)?.id : null) || 'cat-smartphones';
        const categoryName = typeof p.category === 'object' ? (p.category as any)?.name : typeof p.category === 'string' ? p.category : 'General';

        await query(
          `INSERT INTO products (
            id, title, handle, description, brand_id, brand, category_id, category, status, thumbnail_url, images, options, is_deal, is_featured, rating_avg, rating_count
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO NOTHING`,
          [
            p.id,
            p.title,
            p.handle,
            p.description || '',
            brandId,
            brandName,
            catId,
            typeof p.category === 'string' ? p.category : (p.category as any)?.name || 'General',
            p.status || 'published',
            p.thumbnailUrl,
            JSON.stringify(p.images || [p.thumbnailUrl]),
            JSON.stringify(p.options || []),
            p.isDeal || false,
            p.isFeatured !== false,
            p.ratingAvg || 5.0,
            p.ratingCount || 1,
          ]
        );

        // Sembrar variantes
        if (Array.isArray(p.variants)) {
          for (let vi = 0; vi < p.variants.length; vi++) {
            const v: any = p.variants[vi];
            const vTitle = v.title || v.name || 'Estándar';
            const vSku = v.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;

            await query(
              `INSERT INTO product_variants (
                id, product_id, sku, title, price_dop, compare_at_price_dop, cost_price_dop, physical_stock, committed_stock, available_stock, image_urls, options
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
              ON CONFLICT (id) DO NOTHING`,
              [
                v.id || `var-${p.id}-${vi}`,
                p.id,
                vSku,
                vTitle,
                Number(v.priceDop || 0),
                Number(v.compareAtPriceDop || v.priceDop || 0),
                Number(v.costPriceDop || Math.round((v.priceDop || 0) * 0.7)),
                Number(v.physicalStock ?? 10),
                Number(v.committedStock || 0),
                Number(v.availableStock ?? v.physicalStock ?? 10),
                JSON.stringify(v.imageUrls || [p.thumbnailUrl]),
                JSON.stringify(v.options || {}),
              ]
            );
          }
        }
      }
      seeded = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Base de datos Vercel Postgres inicializada con éxito.',
      seeded,
    });
  } catch (error: any) {
    console.error('Error inicializando base de datos:', error);
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function GET() {
  const connected = isDbConnected();
  return NextResponse.json({
    connected,
    message: connected
      ? 'Vercel Postgres conectado y listo.'
      : 'No se detectaron variables de entorno de Postgres.',
  });
}
