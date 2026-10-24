import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { api } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import type { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Oversized T-Shirts');
  const [categorySlug, setCategorySlug] = useState('oversized-t-shirts');
  const [price, setPrice] = useState('999');
  const [salePrice, setSalePrice] = useState('');
  const [gsm, setGsm] = useState('240');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [image, setImage] = useState('/images/hero.jpg');
  const [description, setDescription] = useState('Heavyweight streetwear piece crafted in Tirupur.');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getProducts();
        setProducts(res.products);
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newProd: Product = {
      id: `prod-${Date.now().toString().slice(-4)}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      category,
      categorySlug,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      sku: `DV-${name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      gsm: Number(gsm),
      composition: '100% Ring-Spun Combed Cotton',
      fit: 'Oversized Boxy Dropped Shoulder',
      isActive: true,
      isFeatured: false,
      isNewArrival: true,
      images: [image],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Noir Black'],
      stockQuantity: Number(stockQuantity)
    };

    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(newProd)
      });
    } catch {
      // Local state update
    }

    setProducts((prev) => [newProd, ...prev]);
    setIsModalOpen(false);
    setSubmitting(false);

    // Reset form
    setName('');
    setPrice('999');
    setSalePrice('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this garment from active inventory?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      }).catch(() => {});
    }
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockQuantity: Math.max(0, newStock) } : p))
    );
  };

  return (
    <AdminLayout title="INVENTORY & CATALOGUE MANAGEMENT">
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing {products.length} garments in active production catalogue
          </span>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-gold btn-sm" id="open-add-product-modal">
          <Plus size={16} />
          <span>ADD NEW GARMENT</span>
        </button>
      </div>

      {/* Products Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '2px',
          overflowX: 'auto'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: '#111116' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>IMAGE</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRODUCT NAME</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>CATEGORY</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRICE</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>GSM</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>STOCK</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem' }}>
                  <img
                    src={p.images[0] || '/images/hero.jpg'}
                    alt={p.name}
                    style={{ width: '48px', height: '60px', objectFit: 'cover', borderRadius: '2px', backgroundColor: '#15151a' }}
                  />
                </td>
                <td style={{ padding: '1rem' }}>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.name}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {p.sku}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.category}</td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>
                  {p.salePrice ? (
                    <div>
                      <span style={{ color: 'var(--accent-gold)' }}>₹{p.salePrice}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                        ₹{p.price}
                      </span>
                    </div>
                  ) : (
                    <span>₹{p.price}</span>
                  )}
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.gsm} GSM</td>
                <td style={{ padding: '1rem' }}>
                  <input
                    type="number"
                    value={p.stockQuantity}
                    onChange={(e) => handleUpdateStock(p.id, Number(e.target.value))}
                    style={{
                      width: '64px',
                      padding: '0.3rem 0.5rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      borderRadius: '2px'
                    }}
                  />
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={p.isActive ? 'badge badge-gold' : 'badge badge-noir'}>
                    {p.isActive ? 'ACTIVE' : 'ARCHIVED'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ color: 'var(--status-error)', padding: '0.4rem', cursor: 'pointer' }}
                    title="Delete product"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}
        >
          <div
            style={{
              backgroundColor: '#121216',
              border: '1px solid var(--border-gold)',
              borderRadius: '2px',
              width: '100%',
              maxWidth: '600px',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ADD NEW STREETWEAR GARMENT
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">GARMENT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DV Vintage Heavyweight Acid Tee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">CATEGORY</label>
                  <select
                    value={categorySlug}
                    onChange={(e) => {
                      setCategorySlug(e.target.value);
                      const opt = e.target.options[e.target.selectedIndex];
                      setCategory(opt.text);
                    }}
                    className="form-select"
                  >
                    <option value="oversized-t-shirts">Oversized T-Shirts</option>
                    <option value="t-shirts">T-Shirts</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="shirts">Shirts</option>
                    <option value="custom-printed">Custom Printed</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">FABRIC WEIGHT (GSM)</label>
                  <input
                    type="number"
                    value={gsm}
                    onChange={(e) => setGsm(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">PRICE (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">SALE PRICE (₹)</label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">INITIAL STOCK</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">LOCAL IMAGE ASSET PATH</label>
                <select
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="form-select"
                >
                  <option value="/images/oversized-tee.jpg">/images/oversized-tee.jpg</option>
                  <option value="/images/hoodie.jpg">/images/hoodie.jpg</option>
                  <option value="/images/luxury-shirt.jpg">/images/luxury-shirt.jpg</option>
                  <option value="/images/acid-tee.jpg">/images/acid-tee.jpg</option>
                  <option value="/images/custom-print.jpg">/images/custom-print.jpg</option>
                  <option value="/images/hero.jpg">/images/hero.jpg</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">GARMENT DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" disabled={submitting} className="btn btn-gold btn-block">
                  {submitting ? 'SAVING...' : 'PUBLISH TO CATALOGUE'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
