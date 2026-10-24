import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, CreditCard, Banknote, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, discountAmount, shippingAmount, totalAmount, appliedCoupon, clearCart } = useCart();
  const navigate = useNavigate();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [pinCode, setPinCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod');

  // Status & Error
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gatewayNotice, setGatewayNotice] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="section" style={{ textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>NO ITEMS IN BAG</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please add items to your shopping bag before accessing checkout.
        </p>
        <Link to="/products" className="btn btn-gold">
          EXPLORE CATALOGUE
        </Link>
      </div>
    );
  }

  // Handle Form Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setGatewayNotice(null);

    // Client-side validations
    if (customerName.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address for delivery updates.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (addressLine.trim().length < 5) {
      setErrorMessage('Please provide a complete street address.');
      return;
    }
    if (!pinCode || pinCode.replace(/\D/g, '').length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Submit to server-side checkout endpoint
      const orderPayload = {
        customerName: customerName.trim(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone,
        addressLine: addressLine.trim(),
        city: city.trim(),
        state: state.trim(),
        pinCode: pinCode.trim(),
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        paymentMethod,
        appliedCoupon,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          selectedSize: i.selectedSize,
          selectedColor: i.selectedColor,
          price: i.salePrice || i.price,
          isCustomPrint: i.isCustomPrint,
          customDesign: i.customDesign,
          customizationFee: i.customizationFee
        }))
      };

      const result = await api.createOrder(orderPayload);

      if (!result.success || !result.order) {
        setErrorMessage(result.error || 'Server rejected checkout. Please verify item stock.');
        setSubmitting(false);
        return;
      }

      const placedOrder = result.order;

      // 2. Handle Razorpay Payment if selected and configured
      if (paymentMethod === 'razorpay' && result.razorpayOrder) {
        // Load Razorpay SDK dynamically if not loaded
        if (!window.Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        if (window.Razorpay) {
          const options = {
            key: result.razorpayOrder.keyId,
            amount: result.razorpayOrder.amount,
            currency: result.razorpayOrder.currency,
            name: 'DV CLOTHING',
            description: `Order ${placedOrder.orderNumber}`,
            order_id: result.razorpayOrder.id,
            prefill: {
              name: customerName,
              email,
              contact: cleanPhone
            },
            theme: {
              color: '#c5a059'
            },
            handler: async (response: any) => {
              // Server-side verification
              await api.verifyPayment({
                orderNumber: placedOrder.orderNumber,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              });

              clearCart();
              navigate(`/order-confirmation/${placedOrder.orderNumber}`);
            },
            modal: {
              ondismiss: () => {
                setSubmitting(false);
                setGatewayNotice(
                  'Payment window was closed. Order created as pending. You can complete payment or switch to Cash on Delivery.'
                );
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
          return;
        }
      }

      // If Razorpay keys were pending or Cash on Delivery was selected
      if (paymentMethod === 'razorpay' && !result.razorpayOrder) {
        setGatewayNotice(
          'Notice: Online payment gateway credentials are not yet configured on the server. Your order has been registered under Cash on Delivery / Atelier Verification.'
        );
      }

      // Order completed successfully
      clearCart();
      navigate(`/order-confirmation/${placedOrder.orderNumber}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected checkout failure occurred.');
      setSubmitting(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/cart"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={14} /> Back to Bag
        </Link>

        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag">
            <Lock size={14} /> ENCRYPTED CHECKOUT
          </span>
          <h1 className="section-title">SHIPPING & PAYMENT</h1>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              padding: '1rem 1.25rem',
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#f87171',
              marginBottom: '2rem'
            }}
          >
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.85rem' }}>{errorMessage}</span>
          </div>
        )}

        {/* Notice Alert */}
        {gatewayNotice && (
          <div
            style={{
              backgroundColor: 'var(--accent-gold-glow)',
              border: '1px solid var(--border-gold)',
              padding: '1rem 1.25rem',
              borderRadius: '2px',
              color: 'var(--accent-gold)',
              marginBottom: '2rem',
              fontSize: '0.85rem'
            }}
          >
            {gatewayNotice}
          </div>
        )}

        {/* Checkout Split Grid */}
        <form onSubmit={handleSubmitOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr',
              gap: 'clamp(2rem, 4vw, 4rem)',
              alignItems: 'start'
            }}
            className="checkout-split-grid"
          >
            {/* Left: Customer Info & Shipping Address Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* 1. Contact Information */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  borderRadius: '2px'
                }}
              >
                <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
                  1. CONTACT DETAILS
                </h2>

                <div className="form-group">
                  <label className="form-label">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siddharth Verma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="form-input"
                    id="checkout-name"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="grid-2col">
                  <div className="form-group">
                    <label className="form-label">EMAIL ADDRESS *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      id="checkout-email"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">10-DIGIT MOBILE NUMBER *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input"
                      id="checkout-phone"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  borderRadius: '2px'
                }}
              >
                <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
                  2. DELIVERY ADDRESS (INDIA)
                </h2>

                <div className="form-group">
                  <label className="form-label">FLAT / BUILDING / STREET ADDRESS *</label>
                  <input
                    type="text"
                    required
                    placeholder="Flat 402, Signature Residency, Avinashi Road"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="form-input"
                    id="checkout-address"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }} className="grid-3col">
                  <div className="form-group">
                    <label className="form-label">CITY *</label>
                    <input
                      type="text"
                      required
                      placeholder="Tirupur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="form-input"
                      id="checkout-city"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">STATE *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="form-select"
                      id="checkout-state"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Kerala">Kerala</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other">Other States</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">6-DIGIT PIN CODE *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="641602"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="form-input"
                      id="checkout-pincode"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">DELIVERY INSTRUCTIONS (OPTIONAL)</label>
                  <input
                    type="text"
                    placeholder="Leave with security or near front gate"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  borderRadius: '2px'
                }}
              >
                <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
                  3. PAYMENT SELECTION
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* COD Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      backgroundColor: paymentMethod === 'cod' ? 'var(--accent-gold-glow)' : 'var(--bg-primary)',
                      border: '1px solid',
                      borderColor: paymentMethod === 'cod' ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <Banknote size={24} style={{ color: 'var(--accent-gold)' }} />
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        CASH ON DELIVERY (COD)
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Pay cash or UPI scan directly to courier at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Razorpay Option */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      backgroundColor: paymentMethod === 'razorpay' ? 'var(--accent-gold-glow)' : 'var(--bg-primary)',
                      border: '1px solid',
                      borderColor: paymentMethod === 'razorpay' ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      borderRadius: '2px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      style={{ accentColor: 'var(--accent-gold)' }}
                    />
                    <CreditCard size={24} style={{ color: 'var(--accent-gold)' }} />
                    <div style={{ flexGrow: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        RAZORPAY SECURE GATEWAY (UPI, CARDS, NETBANKING)
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Instant verification via Google Pay, PhonePe, Paytm, or Credit/Debit Cards.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
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
              <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                BAG OVERVIEW ({items.length} ITEMS)
              </h2>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '280px', overflowY: 'auto' }}>
                {items.map((i) => (
                  <div key={i.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{i.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {i.selectedSize} / {i.selectedColor} × {i.quantity}
                      </p>
                    </div>
                    <span style={{ fontWeight: 700 }}>
                      ₹{((i.salePrice || i.price) + (i.customizationFee || 0)) * i.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-gold)' }}>
                    <span>Promo Discount ({appliedCoupon})</span>
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
                    alignItems: 'baseline',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '0.75rem',
                    fontSize: '1.35rem',
                    fontWeight: 800
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--accent-gold)' }}>₹{totalAmount}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold btn-block"
                id="place-order-submit-btn"
              >
                {submitting ? 'PROCESSING SECURE ORDER...' : `CONFIRM & PLACE ORDER (₹${totalAmount})`}
              </button>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                <p>🔒 256-bit SSL encrypted checkout.</p>
                <p>Dispatched with tracking from Tirupur atelier.</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-split-grid {
            grid-template-columns: 1fr !important;
          }
          .grid-2col, .grid-3col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
