import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check } from 'lucide-react';
import type { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'L');
  const [addedAnim, setAddedAnim] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      selectedSize,
      selectedColor: product.colors[0] || 'Noir Black',
      quantity: 1,
      image: product.images[0] || '/images/hero.jpg'
    });

    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const discountPercent = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Image Container with Badges */}
        <div className="product-image-container">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="product-card-img"
          />

          {/* Badges Overlay */}
          <div className="product-badge-overlay">
            {product.isNewArrival && <span className="badge badge-gold">NEW DROP</span>}
            {product.salePrice && <span className="badge badge-sale">{discountPercent}% OFF</span>}
            {product.isFeatured && !product.isNewArrival && <span className="badge badge-noir">SIGNATURE</span>}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className="product-category-meta">{product.category}</span>
            <span className="product-gsm-pill">{product.gsm} GSM</span>
          </div>

          <h3 className="product-name">{product.name}</h3>

          {/* Quick Size Select Pills */}
          <div
            style={{ display: 'flex', gap: '0.35rem', margin: '0.5rem 0', flexWrap: 'wrap' }}
            onClick={(e) => e.stopPropagation()}
          >
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedSize(size);
                }}
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  border: '1px solid',
                  borderColor: selectedSize === size ? 'var(--accent-gold)' : 'var(--border-subtle)',
                  backgroundColor: selectedSize === size ? 'var(--accent-gold-glow)' : 'transparent',
                  color: selectedSize === size ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
                aria-label={`Select size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price & Quick Add Row */}
          <div className="product-price-row">
            <div>
              {product.salePrice ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span className="current-price sale-price">₹{product.salePrice}</span>
                  <span className="original-price">₹{product.price}</span>
                </div>
              ) : (
                <span className="current-price">₹{product.price}</span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              className="btn btn-outline btn-sm"
              style={{
                marginLeft: 'auto',
                padding: '0.4rem 0.85rem',
                backgroundColor: addedAnim ? 'var(--accent-gold)' : 'transparent',
                borderColor: addedAnim ? 'var(--accent-gold)' : 'var(--border-medium)',
                color: addedAnim ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}
              title="Quick Add to Bag"
              aria-label={`Add ${product.name} to bag`}
            >
              {addedAnim ? <Check size={14} /> : <Plus size={14} />}
              <span style={{ fontSize: '0.7rem' }}>{addedAnim ? 'ADDED' : 'ADD'}</span>
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};
