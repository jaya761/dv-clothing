export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stockQuantity: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  gsm: number;
  composition: string;
  fit: string;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  images: string[];
  sizes: string[];
  colors: string[];
  stockQuantity: number;
  variants?: ProductVariant[];
  createdAt?: string;
}

export interface ArtworkTransform {
  scale: number;
  x: number;
  y: number;
  rotation: number;
}

export interface CustomDesign {
  id?: string;
  garmentType: 'oversized_tee' | 'hoodie';
  garmentColor: string;
  selectedSize: string;
  quantity: number;
  customText?: string;
  fontFamily?: string;
  textColor?: string;
  frontArtworkUrl?: string;
  backArtworkUrl?: string;
  designMeta?: {
    front?: ArtworkTransform;
    back?: ArtworkTransform;
  };
  previewImageUrl?: string;
  customizationFee: number;
  createdAt?: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  image: string;
  isCustomPrint?: boolean;
  customDesign?: CustomDesign;
  customizationFee?: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  customDesignId?: string;
  itemImage: string;
  customDesign?: CustomDesign;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  courierPartner?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  role: string;
  token?: string;
}

export interface SiteSettings {
  announcementText: string;
  announcementActive: boolean;
  freeShippingThreshold: number;
  flatShippingRate: number;
  codAllowed: boolean;
  storePhone: string;
  storeEmail: string;
  instagramUrl: string;
}
