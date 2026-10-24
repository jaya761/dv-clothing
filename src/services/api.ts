import type { Product, Order, CustomDesign } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialCatalogue';

const API_BASE = '/api';

export interface ProductsResponse {
  products: Product[];
  total: number;
  isDatabaseConnected: boolean;
}

export const api = {
  // Fetch products with optional filtering
  async getProducts(params?: { category?: string; search?: string; sort?: string }): Promise<ProductsResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.search) query.append('search', params.search);
      if (params?.sort) query.append('sort', params.sort);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          return {
            products: data.products,
            total: data.total || data.products.length,
            isDatabaseConnected: true
          };
        }
      }
    } catch {
      // API call failed, fallback below
    }

    // Graceful fallback to verified initial catalogue
    let filtered = [...INITIAL_PRODUCTS];
    if (params?.category) {
      filtered = filtered.filter(
        (p) => p.categorySlug.toLowerCase() === params.category?.toLowerCase()
      );
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (params?.sort) {
      if (params.sort === 'price_asc') {
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      } else if (params.sort === 'price_desc') {
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      } else if (params.sort === 'newest') {
        filtered.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      }
    }

    return {
      products: filtered,
      total: filtered.length,
      isDatabaseConnected: false
    };
  },

  // Fetch product by slug
  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const res = await fetch(`${API_BASE}/products?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.product) return data.product;
      }
    } catch {
      // Fallback below
    }

    const found = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return found || null;
  },

  // Submit new order to backend
  async createOrder(payload: {
    customerName: string;
    email: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
    deliveryInstructions?: string;
    paymentMethod: 'razorpay' | 'cod';
    appliedCoupon?: string | null;
    items: Array<{
      productId: string;
      quantity: number;
      selectedSize: string;
      selectedColor: string;
      isCustomPrint?: boolean;
      customDesign?: CustomDesign;
      customizationFee?: number;
    }>;
  }): Promise<{
    success: boolean;
    order?: Order;
    razorpayOrder?: { id: string; amount: number; currency: string; keyId: string };
    message?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network failure';
      return { success: false, error: msg };
    }
  },

  // Verify Razorpay payment
  async verifyPayment(payload: {
    orderNumber: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Verification failed' };
    }
  },

  // Lookup order
  async lookupOrder(orderNumber: string, contact: string): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/orders?orderNumber=${encodeURIComponent(orderNumber)}&contact=${encodeURIComponent(contact)}`);
      return await res.json();
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Lookup failed' };
    }
  },

  // Save custom design
  async saveCustomDesign(design: CustomDesign): Promise<{ success: boolean; designId?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/custom-designs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design)
      });
      return await res.json();
    } catch {
      // Local fallback ID
      return { success: true, designId: `cst_${Date.now()}` };
    }
  },

  // System Health
  async getHealth(): Promise<{
    status: string;
    database: { connected: boolean; message: string };
    paymentGateway: { configured: boolean; provider: string; status: string };
  }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return {
      status: 'offline',
      database: { connected: false, message: 'Database credentials not yet configured' },
      paymentGateway: { configured: false, provider: 'Razorpay', status: 'Pending configuration' }
    };
  }
};
