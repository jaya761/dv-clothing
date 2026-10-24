import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // User Selections
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Accordion tabs
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await api.getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          setSelectedImage(prod.images[0] || '/images/hero.jpg');
          setSelectedSize(prod.sizes[0] || 'L');
          setSelectedColor(prod.colors[0] || 'Noir Black');

          // Load related products
          const allRes = await api.getProducts();
          const related = allRes.products.filter((p) => p.id !== prod.id).slice(0, 3);
          setRelatedProducts(related);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '10rem 1rem', color: 'var(--text-muted)' }}>
        Loading luxury streetwear details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section" style={{ textAlign: 'center', padding: '10rem 1rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>PRODUCT NOT FOUND</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The requested garment might be sold out or retired from our catalogue.
        </p>
        <Link to="/products" className="btn btn-gold">
          RETURN TO COLLECTION
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      selectedSize,
      selectedColor,
      quantity,
      image: product.images[0] || '/images/hero.jpg'
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>HOME</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--text-muted)' }}>COLLECTIONS</Link>
          <span>/</span>
          <Link to={`/category/${product.categorySlug}`} style={{ color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--accent-gold)' }}>{product.name}</span>
        </div>

        {/* Product Layout Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.1fr) 1fr',
            gap: 'clamp(2rem, 5vw, 5rem)',
            alignItems: 'start',
            marginBottom: '6rem'
          }}
          className="product-detail-grid"
        >
          {/* Left Column: Image Gallery */}
          <div>
            {/* Primary Main Image */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '3 / 4',
                backgroundColor: '#121216',
                borderRadius: '2px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1rem',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <ImageWithFallback
                src={selectedImage}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Badges */}
              <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {product.isNewArrival && <span className="badge badge-gold">NEW DROP</span>}
                {product.salePrice && <span className="badge badge-sale">{discountPercent}% OFF</span>}
                <span className="badge badge-noir">{product.gsm} GSM</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '80px',
                      height: '100px',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: selectedImage === img ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      backgroundColor: '#121216',
                      cursor: 'pointer'
                    }}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Meta & Purchase Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <span className="section-tag">{product.category} • {product.gsm} GSM FABRIC</span>
              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  lineHeight: 1.15,
                  margin: '0.5rem 0 1rem',
                  letterSpacing: '-0.02em'
                }}
              >
                {product.name}
              </h1>

              {/* Price Row */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
                {product.salePrice ? (
                  <>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                      ₹{product.salePrice}
                    </span>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{product.price}
                    </span>
                    <span className="badge badge-sale">Save ₹{product.price - product.salePrice}</span>
                  </>
                ) : (
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{product.price}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  Inclusive of all taxes
                </span>
              </div>

              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Color Swatches */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label className="form-label">COLORWAY</label>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{selectedColor}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: '2px',
                      border: '1px solid',
                      borderColor: selectedColor === c ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      backgroundColor: selectedColor === c ? 'var(--accent-gold-glow)' : 'var(--bg-secondary)',
                      color: selectedColor === c ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector & Size Guide Link */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label className="form-label">SELECT FIT SIZE</label>
                <Link
                  to="/size-guide"
                  target="_blank"
                  style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', textDecoration: 'underline' }}
                >
                  Size & Measurement Guide
                </Link>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    style={{
                      flex: 1,
                      minWidth: '55px',
                      padding: '0.75rem 0',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      borderRadius: '2px',
                      border: '1px solid',
                      borderColor: selectedSize === sz ? 'var(--accent-gold)' : 'var(--border-subtle)',
                      backgroundColor: selectedSize === sz ? 'var(--accent-gold-glow)' : 'var(--bg-secondary)',
                      color: selectedSize === sz ? 'var(--accent-gold)' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Stock Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--status-success)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)', display: 'inline-block' }} />
                <span>In Stock at Tirupur Atelier • Ready for Dispatch</span>
              </div>
            </div>

            {/* Quantity and Add to Bag */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}
                >
                  -
                </button>
                <span style={{ fontWeight: 700, minWidth: '32px', textAlign: 'center', fontSize: '0.95rem' }}>
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-gold"
                style={{ flexGrow: 1 }}
                id="add-to-bag-pdp-btn"
              >
                {addedSuccess ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{addedSuccess ? 'ADDED TO BAG' : 'ADD TO BAG'}</span>
              </button>
            </div>

            {/* Custom Studio Upsell Pill */}
            {product.categorySlug === 'custom-printed' && (
              <div
                style={{
                  backgroundColor: 'var(--accent-gold-glow)',
                  border: '1px solid var(--border-gold)',
                  padding: '1rem',
                  borderRadius: '2px'
                }}
              >
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  Want to customize your own artwork or text on this garment?
                </p>
                <Link to="/custom-studio" style={{ fontSize: '0.8rem', fontWeight: 700, textDecoration: 'underline' }}>
                  Open Interactive Custom Printing Studio →
                </Link>
              </div>
            )}

            {/* Accordions */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '1rem' }}>
              {/* Accordion 1: Fabric Specs */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'specs' ? null : 'specs')}
                  style={{ width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  <span>FABRIC & SILHOUETTE SPECIFICATIONS</span>
                  {openAccordion === 'specs' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'specs' && (
                  <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p>• <strong>Fabric Weight:</strong> {product.gsm} GSM Heavyweight Knit</p>
                    <p>• <strong>Composition:</strong> {product.composition}</p>
                    <p>• <strong>Cut:</strong> {product.fit}</p>
                    <p>• <strong>Origin:</strong> Knitted & Crafted in Tirupur, Tamil Nadu</p>
                    <p>• <strong>Shrinkage Control:</strong> Pre-washed & preshrunk to hold structural shape</p>
                  </div>
                )}
              </div>

              {/* Accordion 2: Care Instructions */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                  style={{ width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  <span>CARE & LONGEVITY</span>
                  {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'care' && (
                  <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p>• Machine wash cold (inside-out) on gentle cycle</p>
                    <p>• Hang dry in shade to preserve cotton density and collar elasticity</p>
                    <p>• Do not tumble dry</p>
                    <p>• Iron inside-out with low heat; never iron directly over printed graphics</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Guarantee */}
              <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  style={{ width: '100%', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                >
                  <span>SHIPPING & EXCHANGES</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'shipping' && (
                  <div style={{ paddingBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p>• Free pan-India courier on all orders over ₹1,499</p>
                    <p>• Dispatched within 24–48 hours from Tirupur atelier</p>
                    <p>• 7-day hassle-free fit exchange policy for standard items</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Streetwear Pieces */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="section-header">
              <span className="section-tag">COMPLEMENTARY STYLES</span>
              <h2 className="section-title" style={{ fontSize: '2rem' }}>PAIR WITH</h2>
            </div>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
