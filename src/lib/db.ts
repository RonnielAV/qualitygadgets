import { db } from '@vercel/postgres';
import { neon } from '@neondatabase/serverless';

// Verifica si existe variable de conexión a Postgres
export function isDbConnected(): boolean {
  return !!(
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

// Ejecutor SQL universal (compatible con Vercel Postgres y Neon)
export async function query<T = any>(queryString: string, params: any[] = []): Promise<T[]> {
  const connectionString =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL;

  if (!connectionString) {
    return [];
  }

  try {
    if (process.env.POSTGRES_URL) {
      const client = await db.connect();
      const { rows } = await client.query(queryString, params);
      return rows as T[];
    } else {
      const sqlClient: any = neon(connectionString);
      const result = await sqlClient(queryString, params);
      return (result || []) as T[];
    }
  } catch (error) {
    console.error('❌ Error ejecutando query en Vercel Postgres:', error);
    throw error;
  }
}

// Inicializador de Esquema y Tablas en PostgreSQL
export async function initDatabaseTables() {
  if (!isDbConnected()) {
    return { success: false, message: 'No hay conexión a Vercel Postgres configurada.' };
  }

  try {
    // 1. Tablas de Categorías y Marcas
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        handle VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        icon VARCHAR(100) DEFAULT 'Cpu',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS brands (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 2. Tablas de Productos y Variantes
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        handle VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        brand_id VARCHAR(100),
        brand VARCHAR(255),
        category_id VARCHAR(100),
        category VARCHAR(255),
        status VARCHAR(50) DEFAULT 'published',
        thumbnail_url TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        options JSONB DEFAULT '[]'::jsonb,
        is_deal BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT TRUE,
        rating_avg NUMERIC DEFAULT 5.0,
        rating_count INT DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
        sku VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        price_dop NUMERIC NOT NULL DEFAULT 0,
        compare_at_price_dop NUMERIC DEFAULT 0,
        cost_price_dop NUMERIC DEFAULT 0,
        physical_stock INT DEFAULT 0,
        committed_stock INT DEFAULT 0,
        available_stock INT DEFAULT 0,
        image_urls JSONB DEFAULT '[]'::jsonb,
        options JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Tabla de Pedidos OMS
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(255),
        customer_address TEXT NOT NULL,
        province VARCHAR(100),
        municipality VARCHAR(100),
        sector VARCHAR(100),
        payment_method VARCHAR(50) NOT NULL,
        subtotal_dop NUMERIC NOT NULL DEFAULT 0,
        shipping_cost_dop NUMERIC DEFAULT 0,
        discount_dop NUMERIC DEFAULT 0,
        total_dop NUMERIC NOT NULL DEFAULT 0,
        status VARCHAR(50) DEFAULT 'unfulfilled',
        notes TEXT,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        courier_id VARCHAR(100),
        tracking_number VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Tabla de Clientes CRM
    await query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        total_orders INT DEFAULT 1,
        total_spent_dop NUMERIC DEFAULT 0,
        last_order_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. Tabla de Registro de Auditoría
    await query(`
      CREATE TABLE IF NOT EXISTS admin_audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        admin_email VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        resource VARCHAR(100) DEFAULT 'SYSTEM',
        ip_address VARCHAR(100),
        user_agent TEXT,
        status VARCHAR(50) NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. Tabla de Ajustes & CMS
    await query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        key VARCHAR(100) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    return { success: true, message: 'Tablas de Vercel Postgres inicializadas correctamente.' };
  } catch (error: any) {
    console.error('Error inicializando tablas en Vercel Postgres:', error);
    return { success: false, error: error?.message || 'Error desconocido' };
  }
}
