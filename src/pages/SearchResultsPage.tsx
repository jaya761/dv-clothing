import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { api } from '../services/api';
import type { Product } from '../types';

export const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function executeSearch() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api.getProducts({ search: query });
        setResults(res.products);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
  }, [query]);

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3.5rem' }}>
      <div className="container">
        {/* Back Link */}
        <Link
          to="/products"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}
        >
          <ArrowLeft size={14} /> Back to All Collections
        </Link>

        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <Search size={14} /> SEARCH ARCHIVE
          </span>
          <h1 className="section-title">RESULTS FOR "{query}"</h1>
          <p className="section-subtitle">
            Showing {results.length} matching streetwear styles in Tirupur collection.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            Searching DV CLOTHING archive...
          </div>
        ) : results.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>NO MATCHES FOR "{query}"</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Try searching by generic keywords like "oversized", "hoodie", "acid wash", or "cuban".
            </p>
            <Link to="/products" className="btn btn-gold btn-sm">
              VIEW COMPLETE CATALOGUE
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
