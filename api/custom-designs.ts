import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    garmentType,
    garmentColor,
    selectedSize,
    quantity,
    customText,
    fontFamily,
    textColor,
    frontArtworkUrl,
    backArtworkUrl,
    designMeta,
    previewImageUrl,
    customizationFee
  } = req.body || {};

  // Validation
  if (!garmentType || !['oversized_tee', 'hoodie'].includes(garmentType)) {
    return res.status(400).json({ error: 'Invalid garment type' });
  }

  const { supabase, isConfigured } = getSupabaseAdmin();
  const designId = `cst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (isConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('custom_designs')
        .insert({
          garment_type: garmentType,
          garment_color: garmentColor || 'Noir Black',
          selected_size: selectedSize || 'L',
          quantity: Math.max(1, Number(quantity) || 1),
          custom_text: customText ? String(customText).slice(0, 100) : null,
          font_family: fontFamily || 'Cinzel',
          text_color: textColor || '#faf9f5',
          front_artwork_url: frontArtworkUrl || null,
          back_artwork_url: backArtworkUrl || null,
          design_meta: designMeta || {},
          preview_image_url: previewImageUrl || null,
          customization_fee: Number(customizationFee) || 250.0
        })
        .select('id')
        .single();

      if (error) {
        return res.status(500).json({ error: `Failed to persist custom design: ${error.message}` });
      }

      return res.status(200).json({
        success: true,
        designId: data.id
      });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Database error' });
    }
  }

  return res.status(200).json({
    success: true,
    designId
  });
}
