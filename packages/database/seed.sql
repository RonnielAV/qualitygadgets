-- ============================================================================
-- QUALITY GADGETS RD - SEED DE DATOS PARA CATÁLOGO TECNOLÓGICO PREMIUM
-- ============================================================================

-- 1. Marcas
INSERT INTO brands (id, name, slug, logo_url) VALUES
('b1000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=120&auto=format&fit=crop&q=80'),
('b1000000-0000-0000-0000-000000000002', 'Sony', 'sony', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=120&auto=format&fit=crop&q=80'),
('b1000000-0000-0000-0000-000000000003', 'DJI', 'dji', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=120&auto=format&fit=crop&q=80'),
('b1000000-0000-0000-0000-000000000004', 'Samsung', 'samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=120&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 2. Categorías
INSERT INTO categories (id, name, handle, description, icon_name) VALUES
('c1000000-0000-0000-0000-000000000001', 'Smartphones & Pro', 'smartphones', 'Teléfonos de alta gama con conectividad 5G y cámaras de nivel cinematográfico', 'Smartphone'),
('c1000000-0000-0000-0000-000000000002', 'Audio Pro & Hi-Fi', 'audio-pro', 'Auriculares con cancelación de ruido activa y parlantes premium', 'Headphones'),
('c1000000-0000-0000-0000-000000000003', 'Wearables & Smartwatches', 'wearables', 'Relojes inteligentes y monitores biométricos para salud y deporte', 'Watch'),
('c1000000-0000-0000-0000-000000000004', 'Drones & Fotografía', 'drones-foto', 'Estabilizadores, cámaras de acción y drones 4K/8K', 'Camera'),
('c1000000-0000-0000-0000-000000000005', 'Smarthome & Domótica', 'smarthome', 'Automatización para el hogar inteligente y gadgets de oficina', 'Home')
ON CONFLICT (id) DO NOTHING;

-- 3. Ubicación de Almacenes
INSERT INTO inventory_locations (id, name, address, is_active) VALUES
('l1000000-0000-0000-0000-000000000001', 'Hub Central Santo Domingo (Distrito Nacional)', 'Av. Winston Churchill #1099, Piantini, Santo Domingo', TRUE),
('l1000000-0000-0000-0000-000000000002', 'Hub Norte Santiago', 'Av. Juan Pablo Duarte #45, Santiago de los Caballeros', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 4. Producto Principal: iPhone 16 Pro Max
INSERT INTO products (
    id, brand_id, category_id, title, handle, description, status,
    thumbnail_url, images, rating_avg, rating_count, is_featured, is_deal
) VALUES (
    'p1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'iPhone 16 Pro Max Titanium 5G',
    'iphone-16-pro-max-titanium',
    'El smartphone más avanzado con cuerpo de titanio de grado aeroespacial, chip A18 Pro y botón de Control de Cámara profesional. Pantalla Super Retina XDR de 6.9 pulgadas.',
    'published',
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80", "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"]'::jsonb,
    4.95,
    184,
    TRUE,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- Opciones de iPhone
INSERT INTO product_options (id, product_id, title, position) VALUES
('o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Color', 0),
('o1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'Almacenamiento', 1)
ON CONFLICT (id) DO NOTHING;

-- Valores de Opciones
INSERT INTO product_option_values (id, option_id, value, hex_color) VALUES
('v1000000-0000-0000-0000-000000000001', 'o1000000-0000-0000-0000-000000000001', 'Titanio Negro', '#212124'),
('v1000000-0000-0000-0000-000000000002', 'o1000000-0000-0000-0000-000000000001', 'Titanio Desierto', '#c7b299'),
('v1000000-0000-0000-0000-000000000003', 'o1000000-0000-0000-0000-000000000002', '256GB', NULL),
('v1000000-0000-0000-0000-000000000004', 'o1000000-0000-0000-0000-000000000002', '512GB', NULL)
ON CONFLICT (id) DO NOTHING;

-- Variantes del iPhone 16 Pro Max
INSERT INTO product_variants (
    id, product_id, sku, barcode, price_dop, compare_at_price_dop, price_usd, compare_at_price_usd, weight_grams
) VALUES
('pv100000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'IP16PM-BLK-256', '195949012345', 78500.00, 84900.00, 1299.00, 1399.00, 227),
('pv100000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000001', 'IP16PM-DES-256', '195949012346', 78500.00, 84900.00, 1299.00, 1399.00, 227),
('pv100000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000001', 'IP16PM-BLK-512', '195949012347', 89500.00, 96000.00, 1480.00, 1599.00, 227)
ON CONFLICT (id) DO NOTHING;

-- Relación de Variantes con Valores de Opción
INSERT INTO product_variant_option_values (variant_id, option_value_id) VALUES
('pv100000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000001'), -- Negro
('pv100000-0000-0000-0000-000000000001', 'v1000000-0000-0000-0000-000000000003'), -- 256GB
('pv100000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000002'), -- Desierto
('pv100000-0000-0000-0000-000000000002', 'v1000000-0000-0000-0000-000000000003'), -- 256GB
('pv100000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000001'), -- Negro
('pv100000-0000-0000-0000-000000000003', 'v1000000-0000-0000-0000-000000000004')  -- 512GB
ON CONFLICT DO NOTHING;

-- Niveles de Inventario
INSERT INTO inventory_levels (variant_id, location_id, stocked_quantity, reserved_quantity) VALUES
('pv100000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000001', 25, 2),
('pv100000-0000-0000-0000-000000000001', 'l1000000-0000-0000-0000-000000000002', 10, 0),
('pv100000-0000-0000-0000-000000000002', 'l1000000-0000-0000-0000-000000000001', 18, 1),
('pv100000-0000-0000-0000-000000000003', 'l1000000-0000-0000-0000-000000000001', 12, 0)
ON CONFLICT (variant_id, location_id) DO UPDATE SET stocked_quantity = EXCLUDED.stocked_quantity;
