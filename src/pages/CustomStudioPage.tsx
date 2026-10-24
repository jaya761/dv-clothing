import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, RotateCcw, ShoppingBag, Type, Check, Sparkles, Layers } from 'lucide-react';
import { GarmentCanvas } from '../components/studio/GarmentCanvas';
import { useCart } from '../context/CartContext';
import type { ArtworkTransform } from '../types';

export const CustomStudioPage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Customizer State
  const [garmentType, setGarmentType] = useState<'oversized_tee' | 'hoodie'>('oversized_tee');
  const [garmentColor, setGarmentColor] = useState('#0d0d11');
  const [colorName, setColorName] = useState('Noir Black');
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');

  // Text Customization
  const [customText, setCustomText] = useState('DV ATELIER');
  const [fontFamily, setFontFamily] = useState('Cinzel');
  const [textColor, setTextColor] = useState('#faf9f5');

  // Artwork Customization
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkTransform, setArtworkTransform] = useState<ArtworkTransform>({
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0
  });

  // Fit & Quantity
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Available Garment Colors
  const colors = [
    { name: 'Noir Black', hex: '#0d0d11' },
    { name: 'Mineral Charcoal', hex: '#27272a' },
    { name: 'Vintage Washed Grey', hex: '#484852' },
    { name: 'Off-White Ivory', hex: '#eae8e0' },
    { name: 'Raw Sand', hex: '#c8b9a6' },
    { name: 'Forest Sage', hex: '#2c352d' }
  ];

  // Pricing
  const basePrice = garmentType === 'oversized_tee' ? 1299 : 2299;
  const customizationFee = 250;
  const unitPrice = basePrice + customizationFee;
  const totalPrice = unitPrice * quantity;

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload an optimized PNG or JPG.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setArtworkUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCustomText('');
    setArtworkUrl(null);
    setArtworkTransform({ scale: 1, x: 0, y: 0, rotation: 0 });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: garmentType === 'oversized_tee' ? 'prod-custom-tee' : 'prod-custom-hoodie',
      name: `Custom ${garmentType === 'oversized_tee' ? 'Heavyweight Boxy Tee' : 'Mineral Wash Hoodie'}`,
      slug: garmentType === 'oversized_tee' ? 'dv-bespoke-custom-printed-heavyweight-tee' : 'dv-mineral-washed-heavyweight-hoodie',
      price: basePrice,
      selectedSize,
      selectedColor: colorName,
      quantity,
      image: garmentType === 'oversized_tee' ? '/images/custom-print.jpg' : '/images/hoodie.jpg',
      isCustomPrint: true,
      customizationFee,
      customDesign: {
        garmentType,
        garmentColor: colorName,
        selectedSize,
        quantity,
        customText,
        fontFamily,
        textColor,
        customizationFee
      }
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      navigate('/cart');
    }, 1200);
  };

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3rem' }}>
      <div className="container">
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-tag">
            <Sparkles size={14} /> BESPOKE ATELIER
          </span>
          <h1 className="section-title">CUSTOM PRINTING STUDIO</h1>
          <p className="section-subtitle">
            Engineer your own statement piece on our flagship 240 GSM heavyweight tees and 420 GSM french terry hoodies. Artisan high-density printing crafted to order in Tirupur.
          </p>
        </div>

        {/* Studio Workspace Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 480px) 1fr',
            gap: 'clamp(2rem, 4vw, 4rem)',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Garment Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
            <GarmentCanvas
              garmentType={garmentType}
              garmentColor={garmentColor}
              viewSide={viewSide}
              customText={customText}
              fontFamily={fontFamily}
              textColor={textColor}
              artworkUrl={artworkUrl}
              artworkTransform={artworkTransform}
              onUpdateTransform={(u) => setArtworkTransform((p) => ({ ...p, ...u }))}
            />

            {/* Front / Back Toggle Controls */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: 'var(--bg-secondary)',
                padding: '0.4rem',
                borderRadius: '2px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <button
                type="button"
                onClick={() => setViewSide('front')}
                className={`btn btn-sm ${viewSide === 'front' ? 'btn-gold' : 'btn-ghost'}`}
              >
                FRONT VIEW
              </button>
              <button
                type="button"
                onClick={() => setViewSide('back')}
                className={`btn btn-sm ${viewSide === 'back' ? 'btn-gold' : 'btn-ghost'}`}
              >
                BACK VIEW
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Real-time vector mock showing Tirupur print placement boundary.
            </p>
          </div>

          {/* Right Column: Customization Controls Panel */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}
          >
            {/* 1. Garment Silhouette Selection */}
            <div>
              <label className="form-label">1. SELECT GARMENT SILHOUETTE</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setGarmentType('oversized_tee')}
                  className={`btn btn-sm ${garmentType === 'oversized_tee' ? 'btn-gold' : 'btn-outline'}`}
                  style={{ flexDirection: 'column', padding: '1rem', height: 'auto', gap: '0.25rem' }}
                >
                  <span style={{ fontWeight: 700 }}>240 GSM BOXY TEE</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Base ₹1,299</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGarmentType('hoodie')}
                  className={`btn btn-sm ${garmentType === 'hoodie' ? 'btn-gold' : 'btn-outline'}`}
                  style={{ flexDirection: 'column', padding: '1rem', height: 'auto', gap: '0.25rem' }}
                >
                  <span style={{ fontWeight: 700 }}>420 GSM HOODIE</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Base ₹2,299</span>
                </button>
              </div>
            </div>

            {/* 2. Garment Color Picker */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="form-label">2. GARMENT FABRIC COLOR</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{colorName}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      setGarmentColor(c.hex);
                      setColorName(c.name);
                    }}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: '2px solid',
                      borderColor: garmentColor === c.hex ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      boxShadow: garmentColor === c.hex ? '0 0 0 2px var(--accent-gold)' : 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                    title={c.name}
                    aria-label={`Select color ${c.name}`}
                  />
                ))}
              </div>
            </div>

            {/* 3. Custom Typography Tool */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Type size={16} style={{ color: 'var(--accent-gold)' }} />
                <label className="form-label" style={{ margin: 0 }}>3. CUSTOM TYPOGRAPHY</label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Enter slogan or label (e.g. DV ATELIER)"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                  maxLength={30}
                  className="form-input"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {/* Font Selection */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>FONT STYLE</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="Cinzel">Cinzel (Editorial Serif)</option>
                      <option value="Syne">Syne (Geometric Streetwear)</option>
                      <option value="Oswald">Oswald (Industrial Bold)</option>
                      <option value="Playfair Display">Playfair (Luxury Roman)</option>
                    </select>
                  </div>

                  {/* Text Color Selection */}
                  <div>
                    <label className="form-label" style={{ fontSize: '0.7rem' }}>PRINT INK COLOR</label>
                    <select
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <option value="#faf9f5">Warm Ivory</option>
                      <option value="#c5a059">Champagne Gold</option>
                      <option value="#0d0d11">Pitch Black</option>
                      <option value="#ef4444">Scarlet Red</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Artwork Graphic Upload */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} style={{ color: 'var(--accent-gold)' }} />
                  <label className="form-label" style={{ margin: 0 }}>4. UPLOAD GRAPHIC / ARTWORK</label>
                </div>
                {artworkUrl && (
                  <button
                    onClick={() => setArtworkUrl(null)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.7rem', color: 'var(--status-error)' }}
                  >
                    Remove Graphic
                  </button>
                )}
              </div>

              {!artworkUrl ? (
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1.5rem',
                    border: '1px dashed var(--border-medium)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <Upload size={24} style={{ color: 'var(--accent-gold)', marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Click or Drag PNG / JPG Artwork</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Transparent PNG recommended • Max 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Scale slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Scale Artwork</span>
                      <span>{Math.round(artworkTransform.scale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.05"
                      value={artworkTransform.scale}
                      onChange={(e) =>
                        setArtworkTransform((p) => ({ ...p, scale: parseFloat(e.target.value) }))
                      }
                      style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                    />
                  </div>

                  {/* Vertical position slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Vertical Position</span>
                      <span>{artworkTransform.y}px</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      step="2"
                      value={artworkTransform.y}
                      onChange={(e) =>
                        setArtworkTransform((p) => ({ ...p, y: parseInt(e.target.value, 10) }))
                      }
                      style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. Fit Size & Quantity */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
              <label className="form-label">5. SELECT STREETWEAR FIT SIZE</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      borderRadius: '2px',
                      border: '1px solid',
                      borderColor: selectedSize === sz ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      backgroundColor: selectedSize === sz ? 'var(--accent-gold-glow)' : 'transparent',
                      color: selectedSize === sz ? 'var(--accent-gold)' : 'var(--text-secondary)'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Quantity Stepper */}
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  ORDER QUANTITY
                </span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: '2px', backgroundColor: 'var(--bg-primary)' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.35rem 0.65rem', color: 'var(--text-secondary)' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '0.35rem 0.65rem', color: 'var(--text-secondary)' }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Price Summary & Add to Cart */}
            <div
              style={{
                backgroundColor: '#0c0c10',
                border: '1px solid var(--border-gold)',
                padding: '1.25rem',
                borderRadius: '2px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Base Garment ({garmentType === 'oversized_tee' ? 'Heavy Tee' : 'Hoodie'})</span>
                <span>₹{basePrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--accent-gold)' }}>
                <span>Artisan Screen / DTF Printing Fee</span>
                <span>+₹{customizationFee}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.75rem',
                  fontSize: '1.25rem',
                  fontWeight: 800
                }}
              >
                <span>Total Investment</span>
                <span style={{ color: 'var(--text-primary)' }}>₹{totalPrice}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-gold"
                  style={{ flexGrow: 1 }}
                  id="add-custom-piece-btn"
                >
                  {addedSuccess ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{addedSuccess ? 'ADDED TO BAG' : 'ADD CUSTOM PIECE TO BAG'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline"
                  title="Reset customizer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .section > .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
