import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Shield, Factory, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="section-header center">
          <span className="section-tag">
            <Compass size={14} /> THE TIRUPUR ATELIER
          </span>
          <h1 className="section-title">DEFINED BY YOUR STYLE.</h1>
          <p className="section-subtitle">
            Born at the epicenter of India’s textile mastery. Engineered with 240+ GSM heavyweight cottons, architectural silhouettes, and enduring craftsmanship.
          </p>
        </div>

        {/* Hero Editorial Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '16 / 9',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '4rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-elevated)'
          }}
        >
          <img
            src="/images/hero.jpg"
            alt="DV Clothing Tirupur Atelier"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(8, 8, 10, 0.9) 0%, transparent 60%)'
            }}
          />
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              TIRUPUR • TAMIL NADU
            </span>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Where World-Class Knitwear is Conceived and Perfected.
            </p>
          </div>
        </div>

        {/* Brand Narrative Columns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '5rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              1. THE BIRTH OF DV CLOTHING
            </h2>
            <p>
              In a streetwear market flooded with synthetic blends, wafer-thin 160 GSM blanks, and arbitrary 10x luxury markups, DV CLOTHING was established with a singular manifesto: <strong>pure architectural substance</strong>.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Operating from Tirupur, Tamil Nadu—the globally celebrated textile capital of India—we design and manufacture men’s oversized t-shirts, vintage wash hoodies, textured cuban shirts, and bespoke printed apparel that exude structural weight and effortless drape.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              2. THE HEAVYWEIGHT 240+ GSM STANDARD
            </h2>
            <p>
              Weight is the hallmark of modern luxury streetwear. Our foundational blanks are custom-knitted using 100% combed ring-spun cotton at a dense 240 to 260 GSM. For our hoodies, we employ 420 GSM double-knitted french terry.
            </p>
            <p style={{ marginTop: '1rem' }}>
              Every single roll of fabric undergoes mechanical preshrinking and silicone wash treatment. The result is a garment that resists sagging, holds its boxy dropped shoulder shape through years of rotation, and feels silky yet impenetrable against the skin.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              3. ARTISAN BESPOKE PRINTING
            </h2>
            <p>
              Through our direct-to-garment and high-density screen printing workshop, we turn our heavyweight blanks into custom canvasses for independent creators, fashion connoisseurs, and streetwear collectives nationwide.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem'
          }}
        >
          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '2rem', borderRadius: '2px' }}>
            <Factory size={28} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>DIRECT SOURCE</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              We knit, dye, and construct in Tirupur. No middleman agencies or excessive retail margins.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '2rem', borderRadius: '2px' }}>
            <Shield size={28} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>ETHICAL PRODUCTION</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Fair wages, safe artisan working conditions, and responsible water effluent treatment.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: '2rem', borderRadius: '2px' }}>
            <HeartHandshake size={28} style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>COMMUNITY DRIVEN</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Connected with our followers via Instagram @dv__clothing_tirupur with transparent drops.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', backgroundColor: '#0c0c10', border: '1px solid var(--border-gold)', padding: '3rem', borderRadius: '2px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            EXPERIENCE THE TIRUPUR STANDARD
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Explore our drops or engineer your unique garment in our Custom Studio.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-gold">
              SHOP COLLECTION <ArrowRight size={16} />
            </Link>
            <Link to="/custom-studio" className="btn btn-outline">
              CUSTOM PRINT STUDIO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
