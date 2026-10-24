import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { CATEGORIES } from '../data/initialCatalogue';
import { api } from '../services/api';
import type { Product } from '../types';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const currentCategory = CATEGORIES.find((c) => c.slug === slug);

  useEffect(() => {
    async function loadCategoryProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({ category: slug });
        setProducts(res.products);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryProducts();
  }, [slug]);

  const categoryTitle = currentCategory?.name || (slug ? slug.replace(/-/g, ' ').toUpperCase() : 'COLLECTION');

  return (
    <div className="section" style={{ minHeight: '90vh', paddingTop: '3rem' }}>
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
          <span className="section-tag">COLLECTION</span>
          <h1 className="section-title">{categoryTitle}</h1>
          <p className="section-subtitle">
            {currentCategory?.description || 'Tailored with premium heavyweight cotton in Tirupur, India.'}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem', color: 'var(--text-muted)' }}>
            Loading {categoryTitle}...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '5rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>NEW PIECES ARRIVING SOON</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Our craftsmen are currently finishing the next batch in the Tirupur atelier.
            </p>
            <Link to="/products" className="btn btn-gold btn-sm">
              EXPLORE OTHER COLLECTIONS
            </Link>
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
