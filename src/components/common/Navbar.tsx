import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Shield, PackageCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'ALL PRODUCTS', path: '/products' },
    { label: 'OVERSIZED TEES', path: '/category/oversized-t-shirts' },
    { label: 'HOODIES', path: '/category/hoodies' },
    { label: 'SHIRTS', path: '/category/shirts' },
    { label: 'CUSTOM STUDIO', path: '/custom-studio', highlight: true },
    { label: 'ABOUT', path: '/about' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <aside className="announcement-bar" aria-label="Store Announcement">
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <span>
            COMPLIMENTARY PAN-INDIA SHIPPING ON ORDERS OVER <strong>₹1,499</strong> | NEW DROP LIVE
          </span>
        </div>
      </aside>

      {/* Main Sticky Luxury Header */}
      <header className="header-nav">
        <div className="container nav-wrapper">
          {/* Mobile Menu Button */}
          <button
            className="action-icon-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{ display: 'none' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
            <span className="brand-wordmark">DV CLOTHING</span>
            <span className="brand-submark">TIRUPUR • ATELIER</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    style={item.highlight ? { color: 'var(--accent-gold)' } : {}}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Header Action Icons */}
          <div className="nav-actions">
            <button
              className="action-icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search Collection"
            >
              <Search size={20} />
            </button>

            <Link
              to="/track-order"
              className="action-icon-btn"
              title="Track Order"
              aria-label="Track Order Status"
            >
              <PackageCheck size={20} />
            </Link>

            <Link
              to="/admin"
              className="action-icon-btn"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <Shield size={19} />
            </Link>

            {/* Shopping Cart Button */}
            <button
              className="action-icon-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label={`Shopping Bag (${itemCount} items)`}
              id="cart-drawer-trigger"
            >
              <ShoppingBag size={21} />
              {itemCount > 0 && <span className="cart-counter">{itemCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Inline Search Overlay Bar */}
      {searchOpen && (
        <div
          style={{
            backgroundColor: '#121216',
            borderBottom: '1px solid var(--border-medium)',
            padding: '1rem 0',
            position: 'sticky',
            top: 'var(--nav-height)',
            zIndex: 99
          }}
        >
          <div className="container">
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search heavyweight tees, acid hoodies, cuban shirts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{ flexGrow: 1 }}
              />
              <button type="submit" className="btn btn-gold btn-sm">
                SEARCH
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSearchOpen(false)}
              >
                CLOSE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            top: 'var(--nav-height)',
            backgroundColor: '#0a0a0d',
            zIndex: 150,
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: item.highlight ? 'var(--accent-gold)' : 'var(--text-primary)',
                letterSpacing: '0.05em',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-outline btn-block"
            >
              TRACK YOUR ORDER
            </Link>
            <Link
              to="/custom-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-gold btn-block"
            >
              LAUNCH CUSTOM STUDIO
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </>
  );
};
