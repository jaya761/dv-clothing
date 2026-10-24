import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { api } from '../services/api';
import type { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(3000);

  useEffect(() => {
    async function fetchCatalogue() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          category: selectedCategory || undefined,
          search: initialSearch || undefined,
          sort: sortBy
        });

        let filtered = res.products;

        if (selectedSize) {
          filtered = filtered.filter((p) => p.sizes.includes(selectedSize));
        }

        filtered = filtered.filter((p) => (p.salePrice || p.price) <= maxPrice);

        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogue();
  }, [selectedCategory, selectedSize, sortBy, maxPrice, initialSearch]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSortBy('featured');
    setMaxPrice(3000);
    setSearchParams({});
  };

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">CATALOGUE ARCHIVE</span>
          <h1 className="section-title">ALL LUXURY STREETWEAR</h1>
          <p className="section-subtitle">
            Engineered silhouettes in Tirupur, India. 240+ GSM dropped shoulder boxy fits, acid washes, and luxury fabrics.
          </p>
        </div>

        {/* Filters Bar */}
        <ProductFilters
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (cat) setSearchParams({ category: cat });
            else setSearchParams({});
          }}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          maxPrice={maxPrice}
          onSelectMaxPrice={setMaxPrice}
          onResetFilters={handleResetFilters}
          totalResults={products.length}
        />

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            Loading street catalogue...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '6rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>NO STYLES FOUND</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              No items match your active filters. Try broadening your criteria.
            </p>
            <button onClick={handleResetFilters} className="btn btn-gold btn-sm">
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
