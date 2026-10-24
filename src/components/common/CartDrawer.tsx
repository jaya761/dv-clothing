import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ImageWithFallback } from './ImageWithFallback';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingAmount,
    totalAmount,
    freeShippingThreshold,
    freeShippingQualified,
    amountNeededForFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setIsCartDrawerOpen(false)} />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              SHOPPING BAG
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setIsCartDrawerOpen(false)}
            className="action-icon-btn"
            aria-label="Close Shopping Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div
          style={{
            backgroundColor: '#121217',
            padding: '0.85rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {freeShippingQualified ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
              <Sparkles size={14} /> Congratulations! You have unlocked FREE Express Shipping.
            </p>
          ) : (
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Add <strong style={{ color: 'var(--accent-gold)' }}>₹{amountNeededForFreeShipping}</strong> more for <strong>FREE PAN-INDIA SHIPPING</strong>
              </p>
              <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${freeShippingProgress}%`,
                    backgroundColor: 'var(--accent-gold)',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items Container */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Tag size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>YOUR BAG IS EMPTY</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                Discover our signature heavyweight boxy silhouettes and vintage wash drops.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/products');
                }}
                style={{ marginTop: '0.5rem' }}
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            items.map((item) => {
              const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              const lineTotal = (unitPrice + (item.customizationFee || 0)) * item.quantity;

              return (
                <div
                  key={item.cartItemId}
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '80px',
                      height: '100px',
                      flexShrink: 0,
                      backgroundColor: '#121216',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                  >
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Variant specs */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.35rem 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Color: <strong>{item.selectedColor}</strong></span>
                    </div>

                    {item.isCustomPrint && (
                      <span className="badge badge-gold" style={{ alignSelf: 'flex-start', margin: '0.2rem 0' }}>
                        Custom Artisan Print (+₹{item.customizationFee || 250})
                      </span>
                    )}

                    {/* Quantity & Line Total Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '2px',
                          backgroundColor: 'var(--bg-primary)'
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--text-secondary)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 0.5rem', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--text-secondary)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        ₹{lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#0c0c10',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'var(--accent-gold-glow)', border: '1px solid var(--border-gold)', borderRadius: '2px', fontSize: '0.8rem' }}>
                  <span>Code <strong>{appliedCoupon}</strong> active (-₹{discountAmount})</span>
                  <button onClick={removeCoupon} style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', fontWeight: 700 }}>
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Promo code (e.g. DV10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-input"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">
                    APPLY
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                <span style={{ display: 'block', fontSize: '0.7rem', marginTop: '0.3rem', color: couponMsg.error ? 'var(--status-error)' : 'var(--status-success)' }}>
                  {couponMsg.text}
                </span>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                  <span>Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shippingAmount === 0 ? 'COMPLIMENTARY' : `₹${shippingAmount}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <span>Estimated Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button onClick={handleGoToCheckout} className="btn btn-gold btn-block" id="proceed-checkout-btn">
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </button>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-outline btn-block btn-sm"
              >
                VIEW FULL BAG
              </button>
            </div>

            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <ShieldCheck size={14} /> 100% Secure Checkout with Razorpay & COD
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
