import React from 'react';
import { Truck, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="section-header center">
          <span className="section-tag">
            <Truck size={14} /> CLIENT CARE
          </span>
          <h1 className="section-title">SHIPPING & RETURNS</h1>
          <p className="section-subtitle">
            Transparent pan-India logistics direct from our Tirupur atelier, with tracked courier dispatch and a 7-day fit exchange commitment.
          </p>
        </div>

        {/* 1. Shipping Policy */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            borderRadius: '2px',
            marginBottom: '3rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Truck size={24} style={{ color: 'var(--accent-gold)' }} />
            <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              1. PAN-INDIA SHIPPING & DELIVERY
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p>
              • <strong>Complimentary Shipping:</strong> All orders with a subtotal of <strong>₹1,499 and above</strong> receive free express courier delivery across all serviceable PIN codes in India.
            </p>
            <p>
              • <strong>Standard Flat Courier Fee:</strong> For orders under ₹1,499, a nominal flat rate of <strong>₹99</strong> is applied at checkout.
            </p>
            <p>
              • <strong>Dispatch Timelines:</strong> Standard pieces are inspected, packed, and dispatched from our Tirupur atelier within <strong>24 to 48 hours</strong>. Custom-printed studio orders undergo manual screen/DTF processing and curing, dispatching within <strong>3 to 5 business days</strong>.
            </p>
            <p>
              • <strong>Courier Partners:</strong> We partner exclusively with tier-1 express carriers including Blue Dart, Delhivery, and DTDC. Real-time AWB tracking is provided via SMS and email.
            </p>
            <p>
              • <strong>Transit Estimates:</strong>
              <br />— Metro cities (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad): 2–4 business days.
              <br />— Rest of India: 4–6 business days.
            </p>
          </div>
        </div>

        {/* 2. Returns & Exchanges Policy */}
        <div
          id="returns"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            borderRadius: '2px',
            marginBottom: '3rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <RefreshCw size={24} style={{ color: 'var(--accent-gold)' }} />
            <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              2. 7-DAY FIT & SIZE EXCHANGE
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p>
              We want your streetwear silhouette to hang with architectural precision. If your garment fit is not what you envisioned, we provide a <strong>7-day exchange window</strong> from the date of package delivery.
            </p>
            <p>
              • <strong>Eligibility Criteria:</strong> Garments must be unworn, unwashed, unaltered, and retained with original DV tags and polybag packaging intact.
            </p>
            <p>
              • <strong>Custom Printing Policy:</strong> Bespoke custom-printed pieces engineered with personalized customer graphics or text are made-to-order and cannot be restocked. However, if there is an atelier print defect or damaged fabric, we replace it immediately with a brand new print.
            </p>
            <p>
              • <strong>How to Request:</strong> Email <strong>contact@dvclothing.in</strong> or WhatsApp <strong>+91 98765 43210</strong> with your order reference number and desired size. Our logistics team will arrange reverse pickup.
            </p>
          </div>
        </div>

        {/* 3. Cancellation Policy */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            borderRadius: '2px',
            marginBottom: '3.5rem'
          }}
        >
          <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            3. ORDER CANCELLATIONS
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Orders can be cancelled free of charge prior to warehouse packaging and dispatch. Once an AWB courier number has been generated or custom printing ink has been transferred, cancellations cannot be processed.
          </p>
        </div>

        {/* Quick Links CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/products" className="btn btn-gold">
            EXPLORE THE STOREFRONT
          </Link>
        </div>
      </div>
    </div>
  );
};
