import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterStatus('You are subscribed to the private DV drop list.');
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="footer-luxury">
      {/* Brand Value Pillars Bar */}
      <section aria-label="Brand Pillars" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '3.5rem', marginBottom: '4rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem'
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-gold)' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  240+ GSM HEAVYWEIGHT
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Ring-spun combed cotton knit directly in Tirupur.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-gold)' }}>
                <Truck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  PAN-INDIA EXPRESS
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Complimentary tracked courier on orders above ₹1,499.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-gold)' }}>
                <RefreshCw size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  7-DAY FIT EXCHANGE
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Hassle-free size and silhouette exchanges.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent-gold)' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  AUTHENTIC ATELIER
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Direct artisan production, zero retail markups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Links & Newsletter */}
      <div className="container">
        <div className="footer-grid">
          {/* Brand Intro & Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Link to="/" className="brand-logo">
              <span className="brand-wordmark" style={{ fontSize: '1.75rem' }}>DV CLOTHING</span>
              <span className="brand-submark">DEFINED BY YOUR STYLE</span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.6 }}>
              Crafted in Tirupur, India's textile capital. Engineered for modern luxury streetwear enthusiasts with uncompromising fabric density, architectural boxy fits, and bespoke artisan prints.
            </p>

            {/* Newsletter Input */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                EXCLUSIVE DROP ACCESS
              </span>
              <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', marginTop: '0.75rem', maxWidth: '360px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="form-input"
                  style={{ borderRight: 'none', borderRadius: '2px 0 0 2px' }}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ borderRadius: '0 2px 2px 0', padding: '0 1.25rem' }}
                  aria-label="Subscribe"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
              {newsletterStatus && (
                <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--status-success)' }}>
                  {newsletterStatus}
                </span>
              )}
            </div>

            {/* Instagram Social Link */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
              <a
                href="https://www.instagram.com/dv__clothing_tirupur/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', borderColor: 'var(--border-gold)' }}
              >
                <InstagramIcon size={16} />
                <span>@dv__clothing_tirupur</span>
              </a>
            </div>
          </div>

          {/* Column 1: Collections */}
          <div>
            <h4 className="footer-column-title">COLLECTIONS</h4>
            <ul className="footer-link-list">
              <li><Link to="/products" className="footer-link">All Streetwear</Link></li>
              <li><Link to="/category/oversized-t-shirts" className="footer-link">Heavyweight Oversized</Link></li>
              <li><Link to="/category/hoodies" className="footer-link">Mineral Wash Hoodies</Link></li>
              <li><Link to="/category/shirts" className="footer-link">Cuban Collar Shirts</Link></li>
              <li><Link to="/category/t-shirts" className="footer-link">Essential Combed Tees</Link></li>
              <li><Link to="/custom-studio" className="footer-link" style={{ color: 'var(--accent-gold)' }}>Custom Print Studio</Link></li>
            </ul>
          </div>

          {/* Column 2: Client Care */}
          <div>
            <h4 className="footer-column-title">CLIENT CARE</h4>
            <ul className="footer-link-list">
              <li><Link to="/track-order" className="footer-link">Track Your Order</Link></li>
              <li><Link to="/size-guide" className="footer-link">Streetwear Size Guide</Link></li>
              <li><Link to="/shipping-returns" className="footer-link">Shipping & Delivery</Link></li>
              <li><Link to="/shipping-returns#returns" className="footer-link">Returns & Exchanges</Link></li>
              <li><Link to="/contact" className="footer-link">Contact Tirupur Atelier</Link></li>
            </ul>
          </div>

          {/* Column 3: The Atelier */}
          <div>
            <h4 className="footer-column-title">THE ATELIER</h4>
            <ul className="footer-link-list">
              <li><Link to="/about" className="footer-link">Tirupur Heritage Story</Link></li>
              <li><Link to="/privacy-policy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms & Conditions</Link></li>
              <li><Link to="/admin" className="footer-link">Admin Portal</Link></li>
            </ul>

            <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>DV CLOTHING TIRUPUR</p>
              <p>Textile Hub, Tirupur, Tamil Nadu, 641602 India</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} DV CLOTHING. All rights reserved. Defined by your style.</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: 'var(--text-muted)' }}>Privacy</Link>
            <Link to="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
            <Link to="/shipping-returns" style={{ color: 'var(--text-muted)' }}>Shipping</Link>
            <span>Secured with 256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
