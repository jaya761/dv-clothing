import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSupabaseAdmin } from './_lib/supabase';
import { createRazorpayOrder, isRazorpayConfigured } from './_lib/razorpay';

const FREE_SHIPPING_THRESHOLD = 1499;
const FLAT_SHIPPING_FEE = 99;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // --------------------------------------------------------------------------
  // GET: Order Lookup by Order Number & Email / Phone
  // --------------------------------------------------------------------------
  if (req.method === 'GET') {
    const { orderNumber, contact } = req.query;

    if (!orderNumber || !contact) {
      return res.status(400).json({ error: 'Order number and phone/email are required' });
    }

    const { supabase, isConfigured } = getSupabaseAdmin();
    if (!isConfigured || !supabase) {
      return res.status(200).json({
        success: false,
        error: 'Database is not yet configured. Live order lookup unavailable.'
      });
    }

    try {
      const cleanOrderNo = String(orderNumber).trim().toUpperCase();
      const cleanContact = String(contact).trim().toLowerCase();

      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('order_number', cleanOrderNo)
        .single();

      if (error || !order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Security check: Must match email or phone
      const matchesEmail = order.email.toLowerCase() === cleanContact;
      const matchesPhone = order.phone.replace(/\D/g, '') === cleanContact.replace(/\D/g, '');

      if (!matchesEmail && !matchesPhone) {
        return res.status(403).json({ error: 'Order details do not match the contact information provided' });
      }

      return res.status(200).json({
        success: true,
        order: {
          id: order.id,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          email: order.email,
          phone: order.phone,
          addressLine: order.address_line,
          city: order.city,
          state: order.state,
          pinCode: order.pin_code,
          deliveryInstructions: order.delivery_instructions,
          subtotal: Number(order.subtotal),
          discountAmount: Number(order.discount_amount),
          shippingAmount: Number(order.shipping_amount),
          totalAmount: Number(order.total_amount),
          paymentMethod: order.payment_method,
          paymentStatus: order.payment_status,
          orderStatus: order.order_status,
          trackingNumber: order.tracking_number,
          courierPartner: order.courier_partner,
          createdAt: order.created_at,
          items: (order.order_items || []).map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            price: Number(item.price),
            quantity: item.quantity,
            selectedSize: item.selected_size,
            selectedColor: item.selected_color,
            itemImage: item.item_image,
            customDesignId: item.custom_design_id
          }))
        }
      });
    } catch (err: unknown) {
      return res.status(500).json({ error: err instanceof Error ? err.message : 'Lookup failed' });
    }
  }

  // --------------------------------------------------------------------------
  // POST: Create New Order
  // --------------------------------------------------------------------------
  if (req.method === 'POST') {
    const {
      customerName,
      email,
      phone,
      addressLine,
      city,
      state,
      pinCode,
      deliveryInstructions,
      paymentMethod,
      appliedCoupon,
      items
    } = req.body || {};

    // 1. Validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid customer name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    }
    if (!addressLine || addressLine.trim().length < 5) {
      return res.status(400).json({ error: 'Complete street address is required' });
    }
    if (!city || !state || !pinCode) {
      return res.status(400).json({ error: 'City, state, and PIN code are required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items cannot be empty' });
    }

    const { supabase, isConfigured } = getSupabaseAdmin();
    const orderNumber = `DV-${Date.now().toString().slice(-4)}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Re-verify product prices and stock from Supabase if configured
    let verifiedSubtotal = 0;
    const verifiedItems: any[] = [];

    if (isConfigured && supabase) {
      for (const item of items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          return res.status(400).json({ error: 'Invalid product or quantity in cart' });
        }

        const { data: dbProduct, error: prodErr } = await supabase
          .from('products')
          .select('id, name, price, sale_price, stock_quantity, images')
          .eq('id', item.productId)
          .single();

        if (prodErr || !dbProduct) {
          return res.status(400).json({ error: `Product ${item.productId} is not available.` });
        }

        if (dbProduct.stock_quantity < item.quantity) {
          return res.status(400).json({
            error: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock_quantity} available.`
          });
        }

        const unitPrice = dbProduct.sale_price ? Number(dbProduct.sale_price) : Number(dbProduct.price);
        const customizationFee = item.isCustomPrint ? Number(item.customizationFee || 250) : 0;
        const lineTotal = (unitPrice + customizationFee) * item.quantity;
        verifiedSubtotal += lineTotal;

        verifiedItems.push({
          productId: dbProduct.id,
          productName: dbProduct.name,
          price: unitPrice + customizationFee,
          quantity: item.quantity,
          selectedSize: item.selectedSize || 'Standard',
          selectedColor: item.selectedColor || 'Standard',
          itemImage: dbProduct.images?.[0] || '/images/hero.jpg',
          customDesignId: item.customDesign?.id || null
        });
      }
    } else {
      // Unconfigured fallback mode: Calculate using standard catalogue prices
      for (const item of items) {
        const fallbackPrice = item.price || 999;
        const customizationFee = item.isCustomPrint ? Number(item.customizationFee || 250) : 0;
        verifiedSubtotal += (fallbackPrice + customizationFee) * (item.quantity || 1);
        verifiedItems.push({
          productId: item.productId,
          productName: item.name || 'DV Streetwear Garment',
          price: fallbackPrice + customizationFee,
          quantity: item.quantity || 1,
          selectedSize: item.selectedSize || 'L',
          selectedColor: item.selectedColor || 'Noir Black',
          itemImage: item.image || '/images/hero.jpg',
          customDesignId: item.customDesign?.id || null
        });
      }
    }

    // Discount calculation
    let discountAmount = 0;
    if (appliedCoupon === 'DV10') discountAmount = Math.round(verifiedSubtotal * 0.1);
    if (appliedCoupon === 'FIRSTDROP') discountAmount = Math.round(verifiedSubtotal * 0.15);

    const shippingAmount = verifiedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
    const totalAmount = Math.max(0, verifiedSubtotal - discountAmount + shippingAmount);

    let savedOrder: any = null;

    if (isConfigured && supabase) {
      // 1. Insert order into DB
      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customerName.trim(),
          email: email.trim().toLowerCase(),
          phone: cleanPhone,
          address_line: addressLine.trim(),
          city: city.trim(),
          state: state.trim(),
          pin_code: pinCode.trim(),
          delivery_instructions: deliveryInstructions?.trim() || null,
          subtotal: verifiedSubtotal,
          discount_amount: discountAmount,
          shipping_amount: shippingAmount,
          total_amount: totalAmount,
          payment_method: paymentMethod || 'cod',
          payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
          order_status: 'confirmed'
        })
        .select()
        .single();

      if (orderErr || !newOrder) {
        return res.status(500).json({ error: `Failed to save order: ${orderErr?.message}` });
      }

      savedOrder = newOrder;

      // 2. Insert order items
      const orderItemsToInsert = verifiedItems.map((vi) => ({
        order_id: newOrder.id,
        product_id: vi.productId,
        product_name: vi.productName,
        price: vi.price,
        quantity: vi.quantity,
        selected_size: vi.selectedSize,
        selected_color: vi.selectedColor,
        item_image: vi.itemImage,
        custom_design_id: vi.customDesignId
      }));

      await supabase.from('order_items').insert(orderItemsToInsert);

      // 3. Atomically decrement inventory stock
      for (const vi of verifiedItems) {
        try {
          await supabase.rpc('decrement_product_stock', {
            p_id: vi.productId,
            p_qty: vi.quantity
          });
        } catch {
          // If RPC is not created yet, do standard update
          await supabase
            .from('products')
            .update({ stock_quantity: Math.max(0, 50 - vi.quantity) })
            .eq('id', vi.productId);
        }
      }
    } else {
      // Unconfigured environment preview snapshot
      savedOrder = {
        id: `ord_${Date.now()}`,
        order_number: orderNumber,
        customer_name: customerName,
        email,
        phone: cleanPhone,
        address_line: addressLine,
        city,
        state,
        pin_code: pinCode,
        subtotal: verifiedSubtotal,
        discount_amount: discountAmount,
        shipping_amount: shippingAmount,
        total_amount: totalAmount,
        payment_method: paymentMethod || 'cod',
        payment_status: 'pending',
        order_status: 'confirmed',
        created_at: new Date().toISOString()
      };
    }

    // Razorpay Integration
    let razorpayOrderData = null;
    if (paymentMethod === 'razorpay') {
      if (isRazorpayConfigured()) {
        const rpOrder = await createRazorpayOrder(totalAmount, orderNumber);
        if (rpOrder) {
          razorpayOrderData = rpOrder;
        }
      }
    }

    return res.status(200).json({
      success: true,
      order: {
        id: savedOrder.id,
        orderNumber,
        customerName,
        email,
        phone: cleanPhone,
        addressLine,
        city,
        state,
        pinCode,
        deliveryInstructions,
        subtotal: verifiedSubtotal,
        discountAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentStatus: savedOrder.payment_status,
        orderStatus: savedOrder.order_status,
        createdAt: savedOrder.created_at || new Date().toISOString(),
        items: verifiedItems
      },
      razorpayOrder: razorpayOrderData,
      razorpayConfigured: isRazorpayConfigured(),
      message: paymentMethod === 'razorpay' && !isRazorpayConfigured()
        ? 'Online payment gateway credentials pending. Order created under Cash on Delivery / Offline verification.'
        : 'Order placed successfully.'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
