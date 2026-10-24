import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Palette, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Inventory & Catalogue', path: '/admin/products', icon: Package },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Custom Print Jobs', path: '/admin/custom-prints', icon: Palette }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0d', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Bar */}
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#111116',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
            <ShieldCheck size={20} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.1em', fontSize: '1.1rem' }}>
              DV ATELIER PORTAL
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
            {admin?.username || 'admin@dvclothing.in'} • {admin?.role || 'Administrator'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            target="_blank"
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>Live Store</span>
            <ExternalLink size={12} />
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Body */}
      <div style={{ display: 'flex', flexGrow: 1 }}>
        {/* Sidebar Nav */}
        <aside
          style={{
            width: '240px',
            borderRight: '1px solid var(--border-subtle)',
            backgroundColor: '#0c0c10',
            padding: '1.5rem 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}
          className="admin-sidebar"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--accent-gold-glow)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Content Area */}
        <main style={{ flexGrow: 1, padding: '2.5rem', backgroundColor: '#08080a', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};
