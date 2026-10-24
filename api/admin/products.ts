import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateAdminRequest } from '../_lib/auth';
import { getSupabaseAdmin } from '../_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = authenticateAdminRequest(req);
  if (!auth.authenticated) {
    return res.status(401).json({ error: 'Unauthorized admin request' });
  }

  const { supabase, isConfigured } = getSupabaseAdmin();
  if (!isConfigured || !supabase) {
    return res.status(200).json({
      success: false,
      message: 'Supabase is not configured yet. Live product modification disabled.'
    });
  }

  // 1. GET ALL PRODUCTS
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, products: data });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  // 2. POST (CREATE OR UPDATE PRODUCT)
  if (req.method === 'POST') {
    const {
      id,
      name,
      slug,
      description,
      categoryId,
      price,
      salePrice,
      sku,
      gsm,
      composition,
      fit,
      isActive,
      isFeatured,
      isNewArrival,
      images,
      sizes,
      colors,
      stockQuantity
    } = req.body || {};

    if (!name || !price) {
      return res.status(400).json({ error: 'Product name and price are required' });
    }

    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    try {
      if (id) {
        // Update existing
        const { data, error } = await supabase
          .from('products')
          .update({
            name,
            slug: productSlug,
            description,
            category_id: categoryId || null,
            price: Number(price),
            sale_price: salePrice ? Number(salePrice) : null,
            sku,
            gsm: Number(gsm) || 240,
            composition,
            fit,
            is_active: isActive ?? true,
            is_featured: isFeatured ?? false,
            is_new_arrival: isNewArrival ?? false,
            images: images || [],
            sizes: sizes || ['S', 'M', 'L', 'XL'],
            colors: colors || ['Noir Black'],
            stock_quantity: Number(stockQuantity) || 0,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, product: data });
      } else {
        // Create new
        const { data, error } = await supabase
          .from('products')
          .insert({
            name,
            slug: productSlug,
            description: description || 'Tirupur luxury streetwear garment.',
            category_id: categoryId || null,
            price: Number(price),
            sale_price: salePrice ? Number(salePrice) : null,
            sku: sku || `DV-${Date.now().toString().slice(-4)}`,
            gsm: Number(gsm) || 240,
            composition: composition || '100% Combed Cotton',
            fit: fit || 'Oversized Boxy Silhouette',
            is_active: isActive ?? true,
            is_featured: isFeatured ?? false,
            is_new_arrival: isNewArrival ?? true,
            images: images || ['/images/hero.jpg'],
            sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            colors: colors || ['Noir Black'],
            stock_quantity: Number(stockQuantity) || 50
          })
          .select()
          .single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json({ success: true, product: data });
      }
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  // 3. DELETE (OR DEACTIVATE)
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Product ID is required' });

    try {
      const { error } = await supabase.from('products').delete().eq('id', String(id));
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
