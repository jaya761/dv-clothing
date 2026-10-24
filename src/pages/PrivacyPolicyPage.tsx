import React from 'react';
import { Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Lock size={14} /> DATA SECURITY
          </span>
          <h1 className="section-title">PRIVACY POLICY</h1>
          <p className="section-subtitle">
            Effective Date: Autumn 2026. DV CLOTHING is committed to protecting your personal information with absolute integrity.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            borderRadius: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              1. INFORMATION WE COLLECT
            </h2>
            <p>
              When you purchase garments from DV CLOTHING or submit custom artwork via our Custom Studio, we collect necessary transactional details including your name, delivery address, phone number, and email.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              2. PAYMENT SECURITY & ENCRYPTION
            </h2>
            <p>
              We prioritize zero data exposure. We do <strong>not</strong> collect, process, or store credit card numbers, debit card numbers, or CVVs on our servers. All digital transactions are processed directly via PCI-DSS compliant payment infrastructure (Razorpay) utilizing end-to-end 256-bit SSL encryption.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              3. CUSTOM ARTWORK UPLOADS
            </h2>
            <p>
              Graphics, brand logos, and artwork uploaded to the Custom Studio are stored in secure persistent cloud storage solely to render mockups and execute your garment order. We never sell, distribute, or reuse your proprietary designs.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              4. COMMUNICATIONS & OPT-OUT
            </h2>
            <p>
              We only send transactional updates regarding order confirmation and courier dispatch. You can opt out of drops newsletter emails anytime with one click.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            For privacy inquiries or data requests, contact our Data Protection Officer at <strong>privacy@dvclothing.in</strong>.
          </div>
        </div>
      </div>
    </div>
  );
};
