import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, Truck, Sparkles, MapPin } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="section" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-gold)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            borderRadius: '2px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-elevated)'
          }}
        >
          {/* Success Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold-glow)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <CheckCircle2 size={40} />
          </div>

          <span className="section-tag" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> ORDER CONFIRMED
          </span>

          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}
          >
            THANK YOU FOR YOUR PATRONAGE.
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your piece is registered in our Tirupur atelier queue. A confirmation receipt has been dispatched to your email and mobile.
          </p>

          {/* Order Reference Box */}
          <div
            style={{
              backgroundColor: '#0c0c10',
              border: '1px solid var(--border-subtle)',
              padding: '1.25rem',
              borderRadius: '2px',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              UNIQUE ORDER REFERENCE
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.05em' }}>
              {orderId || `DV-2026-${Math.floor(1000 + Math.random() * 9000)}`}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--status-success)', fontWeight: 600 }}>
              ● Status: Verified & Queued for Tirupur Dispatch
            </span>
          </div>

          {/* Timeline Milestones */}
          <div
            style={{
              textAlign: 'left',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.5rem',
              marginBottom: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
              <div style={{ color: 'var(--accent-gold)' }}>✓</div>
              <span><strong>1. Order Logged:</strong> Inventory snapshot secured</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <Truck size={16} style={{ color: 'var(--accent-gold)' }} />
              <span><strong>2. Quality Inspection:</strong> Pre-shrunk 240+ GSM check</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
              <MapPin size={16} style={{ color: 'var(--accent-gold)' }} />
              <span><strong>3. Pan-India Delivery:</strong> Estimated 3 to 5 business days</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/track-order" className="btn btn-gold">
              <PackageCheck size={16} />
              <span>TRACK ORDER STATUS</span>
            </Link>
            <Link to="/products" className="btn btn-outline">
              <span>EXPLORE MORE DROPS</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
