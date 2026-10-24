import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/initialCatalogue';

interface ProductFiltersProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  selectedSize: string;
  onSelectSize: (size: string) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  maxPrice: number;
  onSelectMaxPrice: (price: number) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedSize,
  onSelectSize,
  sortBy,
  onSelectSort,
  maxPrice,
  onSelectMaxPrice,
  onResetFilters,
  totalResults
}) => {
  const sizes = ['ALL', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        padding: '1.5rem',
        borderRadius: '2px',
        marginBottom: '2.5rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <SlidersHorizontal size={18} style={{ color: 'var(--accent-gold)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            FILTER CATALOGUE ({totalResults} STYLES)
          </span>
        </div>

        <button
          onClick={onResetFilters}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}
        >
          <RotateCcw size={13} /> Reset Filters
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => onSelectCategory('')}
          className={`btn btn-sm ${selectedCategory === '' ? 'btn-gold' : 'btn-outline'}`}
        >
          ALL
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => onSelectCategory(cat.slug)}
            className={`btn btn-sm ${selectedCategory === cat.slug ? 'btn-gold' : 'btn-outline'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Secondary Controls: Size, Price, Sort */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)'
        }}
      >
        {/* Size Selection */}
        <div>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>FILTER BY FIT SIZE</label>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSelectSize(s === 'ALL' ? '' : s)}
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '2px',
                  border: '1px solid',
                  borderColor: (selectedSize === '' && s === 'ALL') || selectedSize === s ? 'var(--accent-gold)' : 'var(--border-subtle)',
                  backgroundColor: (selectedSize === '' && s === 'ALL') || selectedSize === s ? 'var(--accent-gold-glow)' : 'transparent',
                  color: (selectedSize === '' && s === 'ALL') || selectedSize === s ? 'var(--accent-gold)' : 'var(--text-secondary)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>MAX PRICE</label>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{maxPrice}</span>
          </div>
          <input
            type="range"
            min="500"
            max="3000"
            step="100"
            value={maxPrice}
            onChange={(e) => onSelectMaxPrice(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-gold)', marginTop: '0.35rem' }}
          />
        </div>

        {/* Sort Dropdown */}
        <div>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>SORT ORDER</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', marginTop: '0.35rem' }}
          >
            <option value="featured">Featured Collection</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest Drops First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
