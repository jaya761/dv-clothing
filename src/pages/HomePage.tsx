import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame, Compass, Palette } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { ProductCard } from '../components/product/ProductCard';
import { CATEGORIES } from '../data/initialCatalogue';
import { api } from '../services/api';
import type { Product } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getProducts({ sort: 'newest' });
        setFeaturedProducts(res.products.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* 1. EDITORIAL HERO SECTION */}
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#09090c',
          overflow: 'hidden'
        }}
      >
        {/* Background Image with Cinematic Noir Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            filter: 'brightness(0.38) contrast(1.15)',
            transform: 'scale(1.02)'
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to right, rgba(9, 9, 12, 0.95) 0%, rgba(9, 9, 12, 0.65) 50%, rgba(9, 9, 12, 0.85) 100%)'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '3rem', paddingTop: '3rem' }}>
          <div style={{ maxWidth: '780px' }}>
            {/* Pill Tag */}
            <div
              className="section-tag"
              style={{
                backgroundColor: 'var(--accent-gold-glow)',
                border: '1px solid var(--border-gold)',
                padding: '0.4rem 0.85rem',
                borderRadius: '2px',
                marginBottom: '1.5rem'
              }}
            >
              <Sparkles size={14} /> AUTUMN / WINTER 2026 DROP LIVE
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 6.5vw, 5.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                color: 'var(--text-primary)'
              }}
            >
              DEFINED BY <br />
              <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontFamily: 'var(--font-heading)' }}>
                YOUR STYLE.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              style={{
                fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                maxWidth: '620px'
              }}
            >
              Everyday essentials. Statement pieces. Made to stand out. Heavyweight 240+ GSM combed cottons tailored in Tirupur, India.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-gold" id="shop-collection-hero-btn">
                <span>SHOP COLLECTION</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/custom-studio" className="btn btn-outline" id="customize-style-hero-btn">
                <Palette size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>CUSTOMIZE YOUR STYLE</span>
              </Link>
            </div>

            {/* Key Atelier Badges */}
            <div
              style={{
                display: 'flex',
                gap: 'clamp(1.5rem, 3vw, 3rem)',
                marginTop: '4rem',
                paddingTop: '2rem',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>240+ GSM</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Heavyweight Cotton</p>
              </div>
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>TIRUPUR</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Textile Capital Hub</p>
              </div>
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>BOXY DROP</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modern Street Cut</p>
              </div>
              <div>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>100% PRESHRUNK</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Zero Distortion</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SHOWCASE */}
      <section className="section" style={{ backgroundColor: '#0c0c0f' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">CURATED DEPARTMENTS</span>
            <h2 className="section-title">THE ARCHITECTURAL SILHOUETTES</h2>
            <p className="section-subtitle">
              Engineered fits constructed from high-density knits, mineral enzyme washes, and relaxed cuts.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  backgroundColor: '#16161c',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.75rem'
                }}
                className="category-card"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.65)',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  className="cat-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(8, 8, 10, 0.95) 0%, rgba(8, 8, 10, 0.2) 60%)'
                  }}
                />

                <div style={{ position: 'relative', zIndex: 2 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    COLLECTION
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', margin: '0.25rem 0' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {cat.description}
                  </p>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    DISCOVER NOW <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NEW ARRIVALS GRID */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="section-header" style={{ marginBottom: 0 }}>
              <span className="section-tag">
                <Flame size={14} /> NEW ARRIVALS
              </span>
              <h2 className="section-title">THE LATEST DROPS</h2>
              <p className="section-subtitle">
                Limited batches produced in Tirupur with high-density cotton and artisanal washes.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              VIEW ALL PRODUCTS <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading luxury drops...
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. CUSTOM PRINTING STUDIO CAMPAIGN */}
      <section
        style={{
          backgroundColor: '#0c0c10',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: 'clamp(4rem, 8vw, 7rem) 0'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'clamp(2rem, 5vw, 5rem)',
              alignItems: 'center'
            }}
            className="split-grid"
          >
            {/* Visual */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '4 / 5',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-elevated)'
              }}
            >
              <img
                src="/images/custom-print.jpg"
                alt="DV Custom Printing Studio Tirupur"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                  backgroundColor: 'rgba(18, 18, 22, 0.85)',
                  backdropFilter: 'blur(12px)',
                  padding: '1.25rem',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '2px'
                }}
              >
                <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
                  DIRECT ATELIER PRINTS
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  High-density screen printing & Direct-to-Film (DTF) execution on 240 GSM blanks.
                </p>
              </div>
            </div>

            {/* Copy */}
            <div>
              <span className="section-tag">
                <Palette size={14} /> BESPOKE STUDIO
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.25rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  margin: '0.75rem 0 1.25rem',
                  lineHeight: 1.15
                }}
              >
                YOUR VISION. <br />
                <span style={{ color: 'var(--accent-gold)' }}>OUR ATELIER FABRICS.</span>
              </h2>

              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
                Don't settle for flimsy merchandise tees. Build your custom streetwear graphics and branding directly on our heavyweight, pre-shrunk boxy silhouettes. We handle the production in our Tirupur facility and deliver nationwide.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--accent-gold)' }}>✓</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <strong>Interactive Garment Studio:</strong> Real-time front and back mockups
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--accent-gold)' }}>✓</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <strong>Artisan Inks:</strong> High wash-durability with crack-resistant pigment
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--accent-gold)' }}>✓</div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <strong>No Minimum Order:</strong> 1 piece to 500+ pieces supported
                  </span>
                </div>
              </div>

              <Link to="/custom-studio" className="btn btn-gold">
                <span>LAUNCH CUSTOM STUDIO</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BRAND STORY & TIRUPUR HERITAGE */}
      <section className="section">
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: 'clamp(2.5rem, 6vw, 5rem)',
              borderRadius: '2px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ maxWidth: '720px' }}>
              <span className="section-tag">
                <Compass size={14} /> CRAFTSMANSHIP MATTERS
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  margin: '0.75rem 0 1.5rem',
                  lineHeight: 1.2
                }}
              >
                THE TIRUPUR ADVANTAGE.
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Tirupur is globally recognized as the knitwear heartland of India, producing fabric for the world's most elite luxury houses. DV CLOTHING harnesses this indigenous textile mastery directly at the source.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                By knitting, dyeing, cutting, and stitching within our hometown ecosystem, we bypass middleman distributor markups. The result: uncompromising 240+ GSM heavyweight streetwear available straight to your doorstep.
              </p>
              <Link to="/about" className="btn btn-outline btn-sm">
                READ OUR HERITAGE STORY <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INSTAGRAM LOOKBOOK FEED */}
      <section className="section" style={{ backgroundColor: '#09090c', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="section-tag">
              <InstagramIcon size={14} /> COMMUNITY LOOKBOOK
            </span>
            <h2 className="section-title">TAG US @DV__CLOTHING_TIRUPUR</h2>
            <p className="section-subtitle">
              Styled on the streets. Tag us in your fits to be featured on our official Instagram feed.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}
          >
            {[
              { img: '/images/hero.jpg', caption: 'Signature Boxy Fit in Deep Noir' },
              { img: '/images/oversized-tee.jpg', caption: '240 GSM Ring-Spun Cotton' },
              { img: '/images/hoodie.jpg', caption: 'Mineral Washed French Terry' },
              { img: '/images/acid-tee.jpg', caption: 'Acid Wash Streetwear Patrol' },
              { img: '/images/luxury-shirt.jpg', caption: 'Cuban Resort Textured Weave' }
            ].map((feed, idx) => (
              <a
                key={idx}
                href="https://www.instagram.com/dv__clothing_tirupur/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                  borderRadius: '2px',
                  backgroundColor: '#121216',
                  display: 'block'
                }}
                className="insta-tile"
              >
                <img
                  src={feed.img}
                  alt={feed.caption}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease'
                  }}
                  className="insta-img"
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    opacity: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    transition: 'opacity 0.2s ease'
                  }}
                  className="insta-hover"
                >
                  <InstagramIcon size={28} />
                </div>
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="https://www.instagram.com/dv__clothing_tirupur/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <InstagramIcon size={18} />
              <span>FOLLOW ON INSTAGRAM @DV__CLOTHING_TIRUPUR</span>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .category-card:hover .cat-img {
          transform: scale(1.08);
        }
        .insta-tile:hover .insta-img {
          transform: scale(1.06);
        }
        .insta-tile:hover .insta-hover {
          opacity: 1 !important;
        }
        @media (max-width: 860px) {
          .split-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
