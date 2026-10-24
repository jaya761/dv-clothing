import React from 'react';
import { Scale } from 'lucide-react';

export const TermsConditionsPage: React.FC = () => {
  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="section-header">
          <span className="section-tag">
            <Scale size={14} /> LEGAL FRAMEWORK
          </span>
          <h1 className="section-title">TERMS & CONDITIONS</h1>
          <p className="section-subtitle">
            Please read these terms carefully before accessing or placing orders through the DV CLOTHING atelier website.
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
              1. OVERVIEW & ACCEPTANCE
            </h2>
            <p>
              This website is operated by DV CLOTHING, Tirupur, Tamil Nadu. Throughout the site, the terms “we”, “us” and “our” refer to DV CLOTHING. By visiting our site and/or purchasing from our collections, you engage in our “Service” and agree to be bound by the following terms.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              2. STORE POLICIES & ACCURACY
            </h2>
            <p>
              We have made every effort to display the colors and weights (GSM) of our garments as accurately as possible. Due to digital display color calibration, slight hue variations may exist between screen displays and dyed cotton fabric.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              3. PRICING & MODIFICATIONS
            </h2>
            <p>
              Prices for our products are subject to change without prior notice. We reserve the right to modify or discontinue any product drop at any time. Prices are verified by the server at checkout.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              4. INTELLECTUAL PROPERTY & UPLOADS
            </h2>
            <p>
              By uploading artwork or text to the Custom Printing Studio, you warrant that you own or possess valid licenses to use the intellectual property. DV CLOTHING reserves the right to decline print jobs that infringe upon third-party copyrights or contain unlawful content.
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Governing Law: Any dispute arising in connection with orders shall be subject to the exclusive jurisdiction of the courts of Tirupur, Tamil Nadu, India.
          </div>
        </div>
      </div>
    </div>
  );
};
