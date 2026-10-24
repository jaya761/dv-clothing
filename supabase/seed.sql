-- ==============================================================================
-- DV CLOTHING - TIRUPUR LUXURY STREETWEAR SEED PRODUCTS
-- ==============================================================================

DO $$
DECLARE
  cat_oversized UUID;
  cat_tshirts UUID;
  cat_hoodies UUID;
  cat_shirts UUID;
  cat_custom UUID;
  p_id UUID;
BEGIN
  SELECT id INTO cat_oversized FROM categories WHERE slug = 'oversized-t-shirts';
  SELECT id INTO cat_tshirts FROM categories WHERE slug = 't-shirts';
  SELECT id INTO cat_hoodies FROM categories WHERE slug = 'hoodies';
  SELECT id INTO cat_shirts FROM categories WHERE slug = 'shirts';
  SELECT id INTO cat_custom FROM categories WHERE slug = 'custom-printed';

  -- 1. DV Heavyweight Boxy Oversized Tee
  INSERT INTO products (
    name, slug, description, category_id, price, sale_price, sku, gsm, composition, fit, 
    is_active, is_featured, is_new_arrival, images, sizes, colors, stock_quantity
  ) VALUES (
    'DV Heavyweight Boxy Oversized Tee',
    'dv-heavyweight-boxy-oversized-tee',
    'Crafted in Tirupur from 240 GSM ultra-combed ring-spun cotton. Features dropped shoulders, a tight structured 1.25-inch ribbed collar, and an exaggerated boxy drape engineered for modern street silhouettes. Preshrunk to eliminate distortion.',
    cat_oversized, 999.00, 899.00, 'DV-OVS-BLK-01', 240, '100% Ring-Spun Combed Cotton', 'Boxy Dropped Shoulder Fit',
    true, true, true, ARRAY['/images/oversized-tee.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Noir Black', 'Vintage Grey', 'Raw Bone'], 45
  ) RETURNING id INTO p_id;

  INSERT INTO product_variants (product_id, size, color, stock_quantity, sku) VALUES
    (p_id, 'S', 'Noir Black', 8, 'DV-OVS-BLK-S'),
    (p_id, 'M', 'Noir Black', 12, 'DV-OVS-BLK-M'),
    (p_id, 'L', 'Noir Black', 15, 'DV-OVS-BLK-L'),
    (p_id, 'XL', 'Noir Black', 10, 'DV-OVS-BLK-XL');

  -- 2. DV Mineral Washed Heavyweight Hoodie
  INSERT INTO products (
    name, slug, description, category_id, price, sale_price, sku, gsm, composition, fit, 
    is_active, is_featured, is_new_arrival, images, sizes, colors, stock_quantity
  ) VALUES (
    'DV Mineral Washed Heavyweight Hoodie',
    'dv-mineral-washed-heavyweight-hoodie',
    'Sculpted from 420 GSM double-knitted french terry. Undergoes an artisanal stone-mineral enzyme wash for a textured, vintage patina. Double-layered hood without drawstring for clean architectural lines. Heavy 2x2 ribbing at hem and cuffs.',
    cat_hoodies, 2299.00, 1999.00, 'DV-HD-WSH-02', 420, '100% Heavy French Terry Cotton', 'Structured Relaxed Silhouette',
    true, true, true, ARRAY['/images/hoodie.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Washed Charcoal', 'Pitch Black'], 30
  ) RETURNING id INTO p_id;

  INSERT INTO product_variants (product_id, size, color, stock_quantity, sku) VALUES
    (p_id, 'M', 'Washed Charcoal', 10, 'DV-HD-WSH-M'),
    (p_id, 'L', 'Washed Charcoal', 12, 'DV-HD-WSH-L'),
    (p_id, 'XL', 'Washed Charcoal', 8, 'DV-HD-WSH-XL');

  -- 3. DV Resort Cuban Collar Textured Shirt
  INSERT INTO products (
    name, slug, description, category_id, price, sale_price, sku, gsm, composition, fit, 
    is_active, is_featured, is_new_arrival, images, sizes, colors, stock_quantity
  ) VALUES (
    'DV Resort Cuban Collar Textured Shirt',
    'dv-resort-cuban-collar-textured-shirt',
    'A sophisticated warm-weather statement piece. Woven from breathable cotton-linen blend with a distinctive slub texture. Features an open camp collar, matte horn buttons, and a straight vented hem for an effortless streetwear drape.',
    cat_shirts, 1699.00, NULL, 'DV-SHT-CBN-03', 190, '70% Cotton, 30% Linen Slub', 'Relaxed Resort Drape',
    true, true, false, ARRAY['/images/luxury-shirt.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Warm Ivory', 'Sand Dune'], 25
  ) RETURNING id INTO p_id;

  -- 4. DV Acid Wash Graphic Street Tee
  INSERT INTO products (
    name, slug, description, category_id, price, sale_price, sku, gsm, composition, fit, 
    is_active, is_featured, is_new_arrival, images, sizes, colors, stock_quantity
  ) VALUES (
    'DV Acid Wash Graphic Street Tee',
    'dv-acid-wash-graphic-street-tee',
    '260 GSM heavy cotton featuring vintage distressed wash and subtle rear typographic embroidery. Tirupur high-density pigment printed for longevity without cracking.',
    cat_oversized, 1199.00, 999.00, 'DV-OVS-ACD-04', 260, '100% Combed Cotton Heavyweight', 'Oversized Streetwear Drape',
    true, false, true, ARRAY['/images/acid-tee.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Mineral Charcoal'], 35
  ) RETURNING id INTO p_id;

  -- 5. DV Bespoke Custom Printed Heavyweight Tee
  INSERT INTO products (
    name, slug, description, category_id, price, sale_price, sku, gsm, composition, fit, 
    is_active, is_featured, is_new_arrival, images, sizes, colors, stock_quantity
  ) VALUES (
    'DV Bespoke Custom Printed Heavyweight Tee',
    'dv-bespoke-custom-printed-heavyweight-tee',
    'Your vision realized on our flagship 240 GSM blank canvas. Premium Direct-to-Film (DTF) and screen printing with ultra-soft hand feel, vibrant resolution, and high wash-durability.',
    cat_custom, 1299.00, 1149.00, 'DV-CST-TEE-05', 240, '100% Ring-Spun Cotton', 'Customizable Boxy Fit',
    true, true, false, ARRAY['/images/custom-print.jpg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Noir Black', 'Vintage Grey', 'Raw White'], 100
  ) RETURNING id INTO p_id;

  -- 6. DV Everyday Minimal Heavyweight Tee
  INSERT INTO products (
    name, slug, description, category_id, price, sale_price, sku, gsm, composition, fit, 
    is_active, is_featured, is_new_arrival, images, sizes, colors, stock_quantity
  ) VALUES (
    'DV Everyday Minimal Heavyweight Tee',
    'dv-everyday-minimal-heavyweight-tee',
    'The foundational luxury everyday staple. 220 GSM single jersey cotton with silicon wash for extreme softness. Clean neckline, tailored chest, and subtle DV hem label.',
    cat_tshirts, 899.00, 799.00, 'DV-TSH-EVR-06', 220, '100% Super-Combed Cotton', 'Regular Tailored Fit',
    true, false, true, ARRAY['/images/hero.jpg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Matte Black', 'Optic White'], 50
  ) RETURNING id INTO p_id;

END $$;
