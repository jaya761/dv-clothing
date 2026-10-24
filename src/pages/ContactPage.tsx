import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div className="section-header center">
          <span className="section-tag">
            <MessageSquare size={14} /> ATELIER CONCIERGE
          </span>
          <h1 className="section-title">CONNECT WITH DV CLOTHING</h1>
          <p className="section-subtitle">
            Have questions about custom printing batches, sizing, or pan-India orders? Our Tirupur team is at your disposal.
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.3fr',
            gap: 'clamp(2rem, 5vw, 4rem)',
            alignItems: 'start'
          }}
          className="contact-grid"
        >
          {/* Left Column: Direct Atelier Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem'
              }}
            >
              <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent-gold)' }}>
                TIRUPUR WORKSHOP & ATELIER
              </h2>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <MapPin size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    HEADQUARTERS
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    DV CLOTHING ATELIER<br />
                    Textile Hub, Avinashi Road,<br />
                    Tirupur, Tamil Nadu — 641602, India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <InstagramIcon size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    OFFICIAL INSTAGRAM
                  </h3>
                  <a
                    href="https://www.instagram.com/dv__clothing_tirupur/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', textDecoration: 'underline' }}
                  >
                    @dv__clothing_tirupur
                  </a>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Direct message us for styling previews & custom quotes.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Mail size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    EMAIL INQUIRIES
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    contact@dvclothing.in
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Phone size={22} style={{ color: 'var(--accent-gold)', flexShrink: 0, marginTop: '0.2rem' }} />
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                    PHONE & WHATSAPP
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    +91 98765 43210 (Mon–Sat, 10 AM – 7 PM IST)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '2.5rem',
              borderRadius: '2px'
            }}
          >
            <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              SEND A MESSAGE
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              We typically respond within 12 to 24 hours.
            </p>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <CheckCircle2 size={48} style={{ color: 'var(--status-success)' }} />
                <h3 style={{ fontSize: '1.25rem' }}>MESSAGE RECEIVED</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '360px' }}>
                  Thank you for reaching out to DV CLOTHING. An atelier representative will connect with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '1rem' }}
                >
                  SEND ANOTHER INQUIRY
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">YOUR FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">TOPIC / INQUIRY TYPE</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-select"
                  >
                    <option value="Product Sizing & Fit">Product Sizing & Fit Guidance</option>
                    <option value="Custom Printing Studio">Custom Printing Studio / Bulk Orders</option>
                    <option value="Order Tracking & Shipping">Order Status & Shipping Query</option>
                    <option value="Exchange or Return">Exchange or Return Request</option>
                    <option value="Brand Collaboration">Brand Collaboration / Media</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">MESSAGE DETAILS *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: '0.5rem' }}>
                  <Send size={16} />
                  <span>DISPATCH MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
