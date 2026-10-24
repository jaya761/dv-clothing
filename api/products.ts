import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { supabase, isConfigured } = getSupabaseAdmin();
  if (!isConfigured || !supabase) {
    return res.status(200).json({
      success: false,
      message: 'Supabase database is not configured yet. Fallback catalogue active.',
      products: [],
      isDatabaseConnected: false
    });
  }

  const { slug, category, search, sort } = req.query;

  try {
    if (slug) {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('slug', String(slug))
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Product not found' });
      }

      return res.status(200).json({
        product: {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description,
          category: data.categories?.name || 'Streetwear',
          categorySlug: data.categories?.slug || 'streetwear',
          price: Number(data.price),
          salePrice: data.sale_price ? Number(data.sale_price) : null,
          sku: data.sku,
          gsm: data.gsm,
          composition: data.composition,
          fit: data.fit,
          isActive: data.is_active,
          isFeatured: data.is_featured,
          isNewArrival: data.is_new_arrival,
          images: data.images,
          sizes: data.sizes,
          colors: data.colors,
          stockQuantity: data.stock_quantity
        }
      });
    }

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true);

    if (category) {
      query = query.eq('categories.slug', String(category));
    }

    if (search) {
      query = query.ilike('name', `%${String(search)}%`);
    }

    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const products = (data || []).map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: item.categories?.name || 'Streetwear',
      categorySlug: item.categories?.slug || 'streetwear',
      price: Number(item.price),
      salePrice: item.sale_price ? Number(item.sale_price) : null,
      sku: item.sku,
      gsm: item.gsm,
      composition: item.composition,
      fit: item.fit,
      isActive: item.is_active,
      isFeatured: item.is_featured,
      isNewArrival: item.is_new_arrival,
      images: item.images,
      sizes: item.sizes,
      colors: item.colors,
      stockQuantity: item.stock_quantity
    }));

    return res.status(200).json({
      success: true,
      products,
      total: products.length,
      isDatabaseConnected: true
    });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Database query error' });
  }
}
