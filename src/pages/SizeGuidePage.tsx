import React, { useState } from 'react';
import { Ruler } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SizeGuidePage: React.FC = () => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [selectedSilhouette, setSelectedSilhouette] = useState<'oversized' | 'hoodie' | 'regular' | 'shirt'>('oversized');

  // Measurement charts
  const charts = {
    oversized: {
      title: 'DV HEAVYWEIGHT OVERSIZED TEES (240–260 GSM)',
      fitNote: 'Designed with exaggerated drop-shoulders and a wide, boxy drape. Buy your regular size for an authentic oversized street silhouette. Size down for a relaxed but closer fit.',
      headers: ['Size', 'Chest Width', 'Garment Length', 'Shoulder Width', 'Sleeve Length'],
      inches: [
        ['S', '42"', '28"', '21"', '8.5"'],
        ['M', '44"', '29"', '22"', '9.0"'],
        ['L', '46"', '30"', '23"', '9.5"'],
        ['XL', '48"', '31"', '24"', '10.0"'],
        ['XXL', '50"', '32"', '25"', '10.5"']
      ],
      cm: [
        ['S', '106 cm', '71 cm', '53 cm', '21.5 cm'],
        ['M', '112 cm', '73.5 cm', '56 cm', '23 cm'],
        ['L', '117 cm', '76 cm', '58.5 cm', '24 cm'],
        ['XL', '122 cm', '78.5 cm', '61 cm', '25.5 cm'],
        ['XXL', '127 cm', '81 cm', '63.5 cm', '26.5 cm']
      ]
    },
    hoodie: {
      title: 'DV MINERAL WASH HEAVYWEIGHT HOODIES (420 GSM)',
      fitNote: 'Constructed from heavy french terry with structured double-layer hood and generous torso room. Perfect for layering over our oversized tees.',
      headers: ['Size', 'Chest Width', 'Length', 'Shoulder', 'Sleeve Length'],
      inches: [
        ['S', '44"', '27.5"', '22"', '24.5"'],
        ['M', '46"', '28.5"', '23"', '25.0"'],
        ['L', '48"', '29.5"', '24"', '25.5"'],
        ['XL', '50"', '30.5"', '25"', '26.0"'],
        ['XXL', '52"', '31.5"', '26"', '26.5"']
      ],
      cm: [
        ['S', '112 cm', '70 cm', '56 cm', '62 cm'],
        ['M', '117 cm', '72.5 cm', '58.5 cm', '63.5 cm'],
        ['L', '122 cm', '75 cm', '61 cm', '65 cm'],
        ['XL', '127 cm', '77.5 cm', '63.5 cm', '66 cm'],
        ['XXL', '132 cm', '80 cm', '66 cm', '67 cm']
      ]
    },
    regular: {
      title: 'DV ESSENTIAL COMBED TEES (220 GSM)',
      fitNote: 'Tailored everyday classic fit. Sits cleanly on the natural shoulder line with standard torso length.',
      headers: ['Size', 'Chest Width', 'Length', 'Shoulder', 'Sleeve Length'],
      inches: [
        ['S', '38"', '27"', '17.5"', '7.5"'],
        ['M', '40"', '28"', '18.5"', '8.0"'],
        ['L', '42"', '29"', '19.5"', '8.5"'],
        ['XL', '44"', '30"', '20.5"', '9.0"'],
        ['XXL', '46"', '31"', '21.5"', '9.5"']
      ],
      cm: [
        ['S', '96 cm', '68.5 cm', '44.5 cm', '19 cm'],
        ['M', '101 cm', '71 cm', '47 cm', '20 cm'],
        ['L', '106 cm', '73.5 cm', '49.5 cm', '21.5 cm'],
        ['XL', '112 cm', '76 cm', '52 cm', '23 cm'],
        ['XXL', '117 cm', '78.5 cm', '54.5 cm', '24 cm']
      ]
    },
    shirt: {
      title: 'DV RESORT CUBAN COLLAR SHIRTS (190 GSM)',
      fitNote: 'Relaxed airy drape with open camp collar and straight vented hem.',
      headers: ['Size', 'Chest Width', 'Length', 'Shoulder', 'Sleeve Length'],
      inches: [
        ['S', '40"', '27.5"', '18.5"', '9.0"'],
        ['M', '42"', '28.5"', '19.5"', '9.5"'],
        ['L', '44"', '29.5"', '20.5"', '10.0"'],
        ['XL', '46"', '30.5"', '21.5"', '10.5"']
      ],
      cm: [
        ['S', '101 cm', '70 cm', '47 cm', '23 cm'],
        ['M', '106 cm', '72.5 cm', '49.5 cm', '24 cm'],
        ['L', '112 cm', '75 cm', '52 cm', '25.5 cm'],
        ['XL', '117 cm', '77.5 cm', '54.5 cm', '26.5 cm']
      ]
    }
  };

  const currentChart = charts[selectedSilhouette];

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Header */}
        <div className="section-header center">
          <span className="section-tag">
            <Ruler size={14} /> PRECISION TAILORING
          </span>
          <h1 className="section-title">STREETWEAR FIT & SIZE GUIDE</h1>
          <p className="section-subtitle">
            All DV CLOTHING garments are preshrunk and tailored to custom streetwear patterns in Tirupur. Consult our exact measurement charts below to find your ideal drape.
          </p>
        </div>

        {/* Silhouette Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedSilhouette('oversized')}
            className={`btn btn-sm ${selectedSilhouette === 'oversized' ? 'btn-gold' : 'btn-outline'}`}
          >
            OVERSIZED TEES
          </button>
          <button
            type="button"
            onClick={() => setSelectedSilhouette('hoodie')}
            className={`btn btn-sm ${selectedSilhouette === 'hoodie' ? 'btn-gold' : 'btn-outline'}`}
          >
            MINERAL HOODIES
          </button>
          <button
            type="button"
            onClick={() => setSelectedSilhouette('shirt')}
            className={`btn btn-sm ${selectedSilhouette === 'shirt' ? 'btn-gold' : 'btn-outline'}`}
          >
            CUBAN SHIRTS
          </button>
          <button
            type="button"
            onClick={() => setSelectedSilhouette('regular')}
            className={`btn btn-sm ${selectedSilhouette === 'regular' ? 'btn-gold' : 'btn-outline'}`}
          >
            REGULAR COMBED TEES
          </button>
        </div>

        {/* Units Switcher Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
            borderRadius: '2px 2px 0 0'
          }}
        >
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
              {currentChart.title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: 'var(--bg-primary)', padding: '0.25rem', borderRadius: '2px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setUnit('inches')}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '2px',
                backgroundColor: unit === 'inches' ? 'var(--accent-gold)' : 'transparent',
                color: unit === 'inches' ? 'var(--bg-primary)' : 'var(--text-secondary)'
              }}
            >
              INCHES
            </button>
            <button
              onClick={() => setUnit('cm')}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '2px',
                backgroundColor: unit === 'cm' ? 'var(--accent-gold)' : 'transparent',
                color: unit === 'cm' ? 'var(--bg-primary)' : 'var(--text-secondary)'
              }}
            >
              CENTIMETERS (CM)
            </button>
          </div>
        </div>

        {/* Fit Note */}
        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '0.85rem 1.5rem', borderLeft: '3px solid var(--accent-gold)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {currentChart.fitNote}
        </div>

        {/* Measurement Table */}
        <div style={{ overflowX: 'auto', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderTop: 'none', marginBottom: '3.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                {currentChart.headers.map((h, i) => (
                  <th key={i} style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(unit === 'inches' ? currentChart.inches : currentChart.cm).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '1rem 1.5rem', fontWeight: cIdx === 0 ? 800 : 400, color: cIdx === 0 ? 'var(--accent-gold)' : 'var(--text-secondary)' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Instructions */}
        <div
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem',
            borderRadius: '2px',
            marginBottom: '4rem'
          }}
        >
          <h3 style={{ fontSize: '1.25rem', textTransform: 'uppercase', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            HOW TO MEASURE YOUR BEST-FITTING TEE
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>1. CHEST WIDTH</p>
              <p>Lay your favorite flat t-shirt down. Measure straight across from armpit seam to armpit seam, then double the figure for full circumference.</p>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>2. LENGTH</p>
              <p>Measure from the highest shoulder point beside the collar ribbing straight down to the bottom hemline.</p>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>3. SHOULDER DROP</p>
              <p>Measure across the back from the edge of one shoulder seam to the other. Our oversized cuts intentionally feature wider drops.</p>
            </div>
          </div>
        </div>

        {/* Exchange Guarantee Banner */}
        <div style={{ textAlign: 'center', backgroundColor: '#0c0c10', border: '1px solid var(--border-gold)', padding: '2.5rem', borderRadius: '2px' }}>
          <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>UNSURE ABOUT YOUR FIT?</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
            We provide a 7-day hassle-free size exchange policy on all standard collection items.
          </p>
          <Link to="/products" className="btn btn-gold btn-sm">
            EXPLORE THE COLLECTION
          </Link>
        </div>
      </div>
    </div>
  );
};
