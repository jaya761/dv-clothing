import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin@dvclothing.in');
  const [password, setPassword] = useState('DV_Luxury_Streetwear_2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token && data.user) {
          login(data.token, data.user);
          navigate('/admin');
          return;
        }
      }

      // If serverless endpoint is not active (e.g. static preview), check preset fallback credentials
      if (
        username.toLowerCase() === 'admin@dvclothing.in' &&
        password === 'DV_Luxury_Streetwear_2026!'
      ) {
        login(`token_mock_${Date.now()}`, {
          id: 'admin-01',
          username: 'admin@dvclothing.in',
          role: 'super_admin'
        });
        navigate('/admin');
        return;
      }

      setError('Invalid admin credentials. Please verify your username and password.');
    } catch {
      // Local preview fallback check
      if (
        username.toLowerCase() === 'admin@dvclothing.in' &&
        password === 'DV_Luxury_Streetwear_2026!'
      ) {
        login(`token_mock_${Date.now()}`, {
          id: 'admin-01',
          username: 'admin@dvclothing.in',
          role: 'super_admin'
        });
        navigate('/admin');
      } else {
        setError('Authentication service unavailable. Please check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#08080a',
        padding: '2rem'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#121216',
          border: '1px solid var(--border-gold)',
          borderRadius: '2px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-elevated)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-gold-glow)',
              color: 'var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ATELIER PORTAL
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Privileged Management Access for DV CLOTHING
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '0.85rem 1rem',
              borderRadius: '2px',
              color: '#f87171',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">ADMIN USERNAME / EMAIL</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              id="admin-username"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">SECRET ACCESS PASSPHRASE</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              id="admin-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold btn-block"
            style={{ marginTop: '0.75rem' }}
            id="admin-login-submit"
          >
            <Lock size={16} />
            <span>{loading ? 'AUTHENTICATING...' : 'SECURE SIGN IN'}</span>
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <p>Initial Credentials configured in .env.example</p>
          <p style={{ color: 'var(--accent-gold)', marginTop: '0.25rem' }}>
            admin@dvclothing.in / DV_Luxury_Streetwear_2026!
          </p>
        </div>
      </div>
    </div>
  );
};
