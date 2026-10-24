import { describe, it, expect } from 'vitest';

export interface TestCartItem {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  isCustomPrint?: boolean;
  customizationFee?: number;
}

export interface InventoryCheckResult {
  valid: boolean;
  errors: string[];
}

export function calculateOrderSummary(
  items: TestCartItem[],
  shippingThreshold = 1499,
  flatShippingRate = 99,
  couponDiscountPercent = 0
) {
  const subtotal = items.reduce((acc, item) => {
    const itemUnitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    const itemTotal = (itemUnitPrice + (item.customizationFee || 0)) * item.quantity;
    return acc + itemTotal;
  }, 0);

  const discountAmount = Math.round((subtotal * couponDiscountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping = subtotal >= shippingThreshold || items.length === 0 ? 0 : flatShippingRate;
  const total = discountedSubtotal + shipping;

  return {
    subtotal,
    discountAmount,
    shipping,
    total,
    freeShippingQualified: subtotal >= shippingThreshold,
    amountNeededForFreeShipping: Math.max(0, shippingThreshold - subtotal)
  };
}

export function validateStockAndQuantities(
  items: TestCartItem[],
  inventoryMap: Record<string, number>
): InventoryCheckResult {
  const errors: string[] = [];

  for (const item of items) {
    if (item.quantity <= 0) {
      errors.push(`Item "${item.name}" has an invalid quantity (${item.quantity}). Must be at least 1.`);
      continue;
    }

    const variantKey = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
    const availableStock = inventoryMap[variantKey] ?? inventoryMap[item.id] ?? 0;

    if (item.quantity > availableStock) {
      errors.push(
        `Requested quantity (${item.quantity}) for "${item.name}" (${item.selectedSize}/${item.selectedColor}) exceeds available stock (${availableStock}).`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

describe('E-commerce Business Logic & Calculations', () => {
  it('correctly calculates subtotal and qualifies for free shipping above threshold', () => {
    const items: TestCartItem[] = [
      {
        id: 'tee-01',
        name: 'DV Heavyweight Boxy Tee',
        price: 999,
        quantity: 2,
        selectedSize: 'L',
        selectedColor: 'Noir Black'
      }
    ];

    const summary = calculateOrderSummary(items);
    expect(summary.subtotal).toBe(1998);
    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(1998);
    expect(summary.freeShippingQualified).toBe(true);
    expect(summary.amountNeededForFreeShipping).toBe(0);
  });

  it('correctly adds shipping when subtotal is below threshold', () => {
    const items: TestCartItem[] = [
      {
        id: 'tee-01',
        name: 'DV Minimal Oversized Tee',
        price: 899,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Vintage Charcoal'
      }
    ];

    const summary = calculateOrderSummary(items);
    expect(summary.subtotal).toBe(899);
    expect(summary.shipping).toBe(99);
    expect(summary.total).toBe(998);
    expect(summary.freeShippingQualified).toBe(false);
    expect(summary.amountNeededForFreeShipping).toBe(600);
  });

  it('correctly incorporates custom printing charges per garment', () => {
    const items: TestCartItem[] = [
      {
        id: 'hoodie-01',
        name: 'DV Mineral Wash Hoodie',
        price: 1899,
        quantity: 2,
        selectedSize: 'XL',
        selectedColor: 'Washed Grey',
        isCustomPrint: true,
        customizationFee: 250 // Custom screen print fee
      }
    ];

    const summary = calculateOrderSummary(items);
    // (1899 + 250) * 2 = 2149 * 2 = 4298
    expect(summary.subtotal).toBe(4298);
    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(4298);
  });

  it('applies percentage coupon discounts correctly', () => {
    const items: TestCartItem[] = [
      {
        id: 'shirt-01',
        name: 'DV Cuban Collar Shirt',
        price: 1500,
        quantity: 1,
        selectedSize: 'L',
        selectedColor: 'Ivory'
      }
    ];

    // 10% discount: 150 off 1500 = 1350
    const summary = calculateOrderSummary(items, 1499, 99, 10);
    expect(summary.subtotal).toBe(1500);
    expect(summary.discountAmount).toBe(150);
    expect(summary.shipping).toBe(0); // Subtotal before discount was >= 1499
    expect(summary.total).toBe(1350);
  });

  it('detects out of stock or excessive quantity requests', () => {
    const items: TestCartItem[] = [
      {
        id: 'tee-rare',
        name: 'DV Limited Drop Tee',
        price: 1299,
        quantity: 5,
        selectedSize: 'XL',
        selectedColor: 'Black'
      }
    ];

    const inventory = {
      'tee-rare-XL-Black': 2
    };

    const check = validateStockAndQuantities(items, inventory);
    expect(check.valid).toBe(false);
    expect(check.errors.length).toBe(1);
    expect(check.errors[0]).toContain('exceeds available stock (2)');
  });

  it('approves orders when stock is strictly sufficient', () => {
    const items: TestCartItem[] = [
      {
        id: 'tee-01',
        name: 'DV Heavyweight Boxy Tee',
        price: 999,
        quantity: 2,
        selectedSize: 'M',
        selectedColor: 'Noir Black'
      }
    ];

    const inventory = {
      'tee-01-M-Noir Black': 15
    };

    const check = validateStockAndQuantities(items, inventory);
    expect(check.valid).toBe(true);
    expect(check.errors.length).toBe(0);
  });
});
