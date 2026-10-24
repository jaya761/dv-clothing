import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CartPage: React.FC = () => {
  const {
    items,
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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput('');
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px', padding: '2rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-muted)' }}>
            <Tag size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>YOUR BAG IS EMPTY</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Explore our Tirupur-crafted heavyweight silhouettes, mineral wash drops, and bespoke custom printing atelier.
          </p>
          <Link to="/products" className="btn btn-gold">
            EXPLORE THE COLLECTION <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag">REVIEW SELECTION</span>
          <h1 className="section-title">SHOPPING BAG ({items.reduce((s, i) => s + i.quantity, 0)})</h1>
        </div>

        {/* Free Shipping Alert */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem',
            borderRadius: '2px',
            marginBottom: '2.5rem'
          }}
        >
          {freeShippingQualified ? (
            <p style={{ color: 'var(--status-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} /> COMPLIMENTARY PAN-INDIA EXPRESS SHIPPING UNLOCKED
            </p>
          ) : (
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Add <strong style={{ color: 'var(--accent-gold)' }}>₹{amountNeededForFreeShipping}</strong> more to your order for <strong>FREE PAN-INDIA SHIPPING</strong>.
              </p>
              <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${freeShippingProgress}%`, backgroundColor: 'var(--accent-gold)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 1fr',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start'
          }}
          className="cart-layout-grid"
        >
          {/* Left: Items Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {items.map((item) => {
              const unitPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              const lineTotal = (unitPrice + (item.customizationFee || 0)) * item.quantity;

              return (
                <div
                  key={item.cartItemId}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '1.5rem',
                    borderRadius: '2px',
                    display: 'flex',
                    gap: '1.5rem',
                    alignItems: 'center'
                  }}
                  className="cart-item-row"
                >
                  {/* Image */}
                  <div style={{ width: '90px', height: '115px', flexShrink: 0, backgroundColor: '#121216', borderRadius: '2px', overflow: 'hidden' }}>
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link to={`/product/${item.slug}`} style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Fit: <strong>{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Color: <strong>{item.selectedColor}</strong></span>
                    </div>

                    {item.isCustomPrint && (
                      <span className="badge badge-gold" style={{ alignSelf: 'flex-start', margin: '0.2rem 0' }}>
                        Custom Artisan Print (+₹{item.customizationFee || 250})
                      </span>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-primary)', borderRadius: '2px' }}>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} style={{ padding: '0.4rem 0.65rem', color: 'var(--text-secondary)' }}>
                          <Minus size={13} />
                        </button>
                        <span style={{ minWidth: '28px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} style={{ padding: '0.4rem 0.65rem', color: 'var(--text-secondary)' }}>
                          <Plus size={13} />
                        </button>
                      </div>

                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ₹{lineTotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            <Link
              to="/products"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}
            >
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Right: Order Summary Box */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '2rem',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'sticky',
              top: 'calc(var(--nav-height) + 2rem)'
            }}
          >
            <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ORDER SUMMARY
            </h2>

            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1rem', backgroundColor: 'var(--accent-gold-glow)', border: '1px solid var(--border-gold)', borderRadius: '2px', fontSize: '0.85rem' }}>
                  <span>Code <strong>{appliedCoupon}</strong> active (-₹{discountAmount})</span>
                  <button onClick={removeCoupon} style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.75rem' }}>
                    REMOVE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. DV10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-input"
                    style={{ textTransform: 'uppercase', padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">
                    APPLY
                  </button>
                </form>
              )}
              {couponMsg && !appliedCoupon && (
                <span style={{ display: 'block', fontSize: '0.75rem', marginTop: '0.4rem', color: couponMsg.error ? 'var(--status-error)' : 'var(--status-success)' }}>
                  {couponMsg.text}
                </span>
              )}
            </div>

            {/* Numbers Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                  <span>Promotional Discount</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Pan-India Courier</span>
                <span>{shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.85rem',
                  fontSize: '1.35rem',
                  fontWeight: 800
                }}
              >
                <span>Estimated Total</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-gold btn-block"
              id="cart-page-checkout-btn"
            >
              PROCEED TO CHECKOUT <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} /> 256-bit encrypted checkout with Razorpay & COD
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
