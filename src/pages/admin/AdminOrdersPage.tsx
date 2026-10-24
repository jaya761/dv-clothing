import React, { useEffect, useState } from 'react';
import { Download, X, Eye } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';
import type { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const { getAuthHeaders } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord-8492',
      orderNumber: 'DV-2026-8492',
      customerName: 'Aditya Kashyap',
      email: 'aditya.k@gmail.com',
      phone: '9840218899',
      addressLine: 'Flat 12B, Regency Heights, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      subtotal: 2898,
      discountAmount: 290,
      shippingAmount: 0,
      totalAmount: 2608,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'in_production',
      trackingNumber: 'BLUEDART-8829104',
      courierPartner: 'Blue Dart Express',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      items: [
        {
          id: 'it-1',
          productId: 'prod-001',
          productName: 'DV Heavyweight Boxy Oversized Tee',
          price: 899,
          quantity: 2,
          selectedSize: 'L',
          selectedColor: 'Noir Black',
          itemImage: '/images/oversized-tee.jpg'
        },
        {
          id: 'it-2',
          productId: 'prod-004',
          productName: 'DV Acid Wash Graphic Street Tee',
          price: 999,
          quantity: 1,
          selectedSize: 'XL',
          selectedColor: 'Mineral Charcoal',
          itemImage: '/images/acid-tee.jpg'
        }
      ]
    },
    {
      id: 'ord-8491',
      orderNumber: 'DV-2026-8491',
      customerName: 'Vikram Sundaram',
      email: 'vikram.sundaram@hotmail.com',
      phone: '9876543210',
      addressLine: '44 Cathedral Road, Gopalapuram',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pinCode: '600086',
      subtotal: 1999,
      discountAmount: 0,
      shippingAmount: 0,
      totalAmount: 1999,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      trackingNumber: 'DELHIVERY-992104',
      courierPartner: 'Delhivery Surface',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      items: [
        {
          id: 'it-3',
          productId: 'prod-002',
          productName: 'DV Mineral Washed Heavyweight Hoodie',
          price: 1999,
          quantity: 1,
          selectedSize: 'L',
          selectedColor: 'Washed Charcoal',
          itemImage: '/images/hoodie.jpg'
        }
      ]
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live orders from backend
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders', {
          headers: getAuthHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          if (data.orders && Array.isArray(data.orders) && data.orders.length > 0) {
            setOrders(data.orders);
          }
        }
      } catch {
        // Fallback demo orders active
      }
    }
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
    }

    fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ orderId, orderStatus: newStatus })
    }).catch(() => {});
  };

  const handleExportCSV = () => {
    const headers = 'Order Number,Customer Name,Email,Phone,City,State,Total Amount,Payment Method,Payment Status,Order Status,Date\n';
    const rows = orders.map((o) =>
      `"${o.orderNumber}","${o.customerName}","${o.email}","${o.phone}","${o.city}","${o.state}","${o.totalAmount}","${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}","${o.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `dv_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filterStatus === 'ALL' || o.orderStatus === filterStatus;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout title="ORDER FULFILLMENT & LOGISTICS">
      {/* Top Filter and Export Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search by Order # or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '280px', padding: '0.5rem 0.85rem', fontSize: '0.85rem' }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_production">In Production</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <button onClick={handleExportCSV} className="btn btn-outline btn-sm" id="export-orders-csv-btn">
          <Download size={14} />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Orders Table */}
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
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>ORDER REF</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMER</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>DESTINATION</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>ITEMS</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAYMENT</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((ord) => (
              <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {ord.orderNumber}
                </td>
                <td style={{ padding: '1rem' }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ord.customerName}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.phone}</span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  {ord.city}, {ord.state}
                </td>
                <td style={{ padding: '1rem' }}>
                  {ord.items.length} garments
                </td>
                <td style={{ padding: '1rem', fontWeight: 700 }}>
                  ₹{ord.totalAmount}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={ord.paymentStatus === 'paid' ? 'badge badge-gold' : 'badge badge-noir'}>
                    {ord.paymentMethod.toUpperCase()} • {ord.paymentStatus.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                    style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.75rem',
                      borderRadius: '2px'
                    }}
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="in_production">In Production</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Slideover/Modal */}
      {selectedOrder && (
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
              maxWidth: '650px',
              padding: '2.5rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER INVOICE SNAPSHOT</span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                  {selectedOrder.orderNumber}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Customer Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
              <div>
                <span className="form-label" style={{ fontSize: '0.7rem' }}>CLIENT DETAILS</span>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedOrder.customerName}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.email}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.phone}</p>
              </div>

              <div>
                <span className="form-label" style={{ fontSize: '0.7rem' }}>DELIVERY DESTINATION</span>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedOrder.addressLine}</p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedOrder.city}, {selectedOrder.state} — {selectedOrder.pinCode}
                </p>
                {selectedOrder.deliveryInstructions && (
                  <p style={{ color: 'var(--accent-gold)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Note: "{selectedOrder.deliveryInstructions}"
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
              <span className="form-label" style={{ fontSize: '0.7rem' }}>ORDER ITEMS</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{it.productName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Fit: {it.selectedSize} • Color: {it.selectedColor} • Qty: {it.quantity}
                      </p>
                    </div>
                    <span style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>
              <span>Total Paid / Payable</span>
              <span style={{ color: 'var(--accent-gold)' }}>₹{selectedOrder.totalAmount}</span>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <button onClick={() => setSelectedOrder(null)} className="btn btn-outline btn-block btn-sm">
                CLOSE DETAILS
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
