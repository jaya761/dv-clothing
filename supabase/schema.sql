-- ==============================================================================
-- DV CLOTHING - TIRUPUR LUXURY STREETWEAR DATABASE SCHEMA
-- PostgreSQL / Supabase Compatible DDL
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation if not present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
  sku TEXT UNIQUE,
  gsm INTEGER DEFAULT 240,
  composition TEXT DEFAULT '100% Combed Heavyweight Cotton',
  fit TEXT DEFAULT 'Oversized Boxy Drop-Shoulder',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{"S","M","L","XL","XXL"}',
  colors TEXT[] NOT NULL DEFAULT '{"Noir Black"}',
  stock_quantity INTEGER NOT NULL DEFAULT 50 CHECK (stock_quantity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- PRODUCT VARIANTS (Variant-level stock inventory)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 15 CHECK (stock_quantity >= 0),
  sku TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, size, color)
);

-- ------------------------------------------------------------------------------
-- CUSTOM PRINT DESIGNS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS custom_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  garment_type TEXT NOT NULL DEFAULT 'oversized_tee',
  garment_color TEXT NOT NULL DEFAULT 'Noir Black',
  selected_size TEXT NOT NULL DEFAULT 'L',
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  custom_text TEXT,
  font_family TEXT DEFAULT 'Cinzel',
  text_color TEXT DEFAULT '#faf9f5',
  front_artwork_url TEXT,
  back_artwork_url TEXT,
  design_meta JSONB DEFAULT '{}'::jsonb,
  customization_fee NUMERIC(10, 2) NOT NULL DEFAULT 250.00,
  preview_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  delivery_instructions TEXT,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
  shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_amount >= 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL DEFAULT 'cod', -- 'razorpay' | 'cod'
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed' | 'refunded'
  order_status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled'
  tracking_number TEXT,
  courier_partner TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- ORDER ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  selected_size TEXT NOT NULL,
  selected_color TEXT NOT NULL,
  custom_design_id UUID REFERENCES custom_designs(id) ON DELETE SET NULL,
  item_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- PAYMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created', -- 'created' | 'captured' | 'failed'
  raw_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- SITE SETTINGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email_phone ON orders(email, phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Categories & Products: Publicly readable for active items
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products read" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public product_variants read" ON product_variants FOR SELECT USING (true);

-- Custom Designs: Anyone can insert a custom design draft
CREATE POLICY "Public custom_designs insert" ON custom_designs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public custom_designs select" ON custom_designs FOR SELECT USING (true);

-- Site settings: Publicly readable
CREATE POLICY "Public site_settings read" ON site_settings FOR SELECT USING (true);

-- Orders: Can only be inserted or updated via serverless functions using service role key
-- Direct client anon key cannot query all orders (prevents exposing customer information)

-- ------------------------------------------------------------------------------
-- SEED DATA (DEFAULT CATEGORIES & SETTINGS)
-- ------------------------------------------------------------------------------
INSERT INTO categories (name, slug, description, display_order)
VALUES 
  ('Oversized T-Shirts', 'oversized-t-shirts', 'Heavyweight 240+ GSM dropped shoulder boxy fits.', 1),
  ('T-Shirts', 't-shirts', 'Tailored luxury everyday cotton tees.', 2),
  ('Hoodies', 'hoodies', '420 GSM french terry and mineral washed fleece.', 3),
  ('Shirts', 'shirts', 'Resort collar and Cuban cut textured streetwear shirts.', 4),
  ('Custom Printed', 'custom-printed', 'Direct-to-garment & artisan screen prints made to order.', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO site_settings (key, value, description)
VALUES 
  ('announcement', '{"text": "COMPLIMENTARY PAN-INDIA SHIPPING ON ORDERS OVER ₹1,499 | NEW DROP LIVE", "active": true}'::jsonb, 'Header announcement banner'),
  ('store_info', '{"brand": "DV CLOTHING", "location": "Tirupur, Tamil Nadu, India", "instagram": "https://www.instagram.com/dv__clothing_tirupur/", "phone": "+91 98765 43210", "email": "contact@dvclothing.in"}'::jsonb, 'DV Clothing Store Details'),
  ('shipping', '{"threshold": 1499, "flat_rate": 99, "cod_allowed": true}'::jsonb, 'Shipping and payment configuration')
ON CONFLICT (key) DO NOTHING;
