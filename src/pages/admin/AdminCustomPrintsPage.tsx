import React, { useState } from 'react';
import { Eye, Layers, Type } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const AdminCustomPrintsPage: React.FC = () => {
  const [customJobs, setCustomJobs] = useState([
    {
      id: 'job-01',
      orderNumber: 'DV-2026-8495',
      customerName: 'Karthik Raja',
      garmentType: '240 GSM Oversized Tee',
      garmentColor: 'Noir Black',
      size: 'XL',
      quantity: 3,
      customText: 'VOID COLLECTIVE',
      fontFamily: 'Cinzel',
      textColor: 'Warm Ivory (#faf9f5)',
      artworkUrl: '/images/custom-print.jpg',
      status: 'Screen Prepared',
      submittedAt: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      id: 'job-02',
      orderNumber: 'DV-2026-8488',
      customerName: 'Rohit Menon',
      garmentType: '420 GSM Mineral Hoodie',
      garmentColor: 'Mineral Charcoal',
      size: 'L',
      quantity: 1,
      customText: 'TIRUPUR ATELIER 2026',
      fontFamily: 'Syne',
      textColor: 'Champagne Gold (#c5a059)',
      artworkUrl: null,
      status: 'In Queue',
      submittedAt: new Date(Date.now() - 3600000 * 28).toISOString()
    }
  ]);

  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setCustomJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
  };

  return (
    <AdminLayout title="CUSTOM PRINTING ATELIER JOBS">
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Review bespoke artwork and custom text generated in the Custom Printing Studio before screen exposure and DTF printing.
        </p>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {customJobs.map((job) => (
          <div
            key={job.id}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '2px',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Job Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>REF: {job.orderNumber}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {job.customerName}
                </h3>
              </div>
              <span className="badge badge-gold">{job.status}</span>
            </div>

            {/* Garment Meta */}
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '2px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <p>• <strong>Silhouette:</strong> {job.garmentType}</p>
              <p>• <strong>Fabric Color:</strong> {job.garmentColor}</p>
              <p>• <strong>Fit Size & Qty:</strong> {job.size} • {job.quantity} units</p>
            </div>

            {/* Print Customization Specs */}
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Type size={16} style={{ color: 'var(--accent-gold)' }} />
                <span>Custom Typography: <strong>"{job.customText}"</strong></span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '1.5rem' }}>
                Font: {job.fontFamily} • Ink Color: {job.textColor}
              </p>

              {job.artworkUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <Layers size={16} style={{ color: 'var(--accent-gold)' }} />
                  <span>Custom Artwork File Provided</span>
                </div>
              )}
            </div>

            {/* Status Selector */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <select
                value={job.status}
                onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
              >
                <option value="In Queue">In Queue</option>
                <option value="Screen Prepared">Screen Prepared</option>
                <option value="Printed & Cured">Printed & Cured</option>
                <option value="Ready for Dispatch">Ready for Dispatch</option>
              </select>

              <button
                onClick={() => setSelectedJob(job)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                <Eye size={12} />
                <span>Preview Specs</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedJob && (
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
              maxWidth: '540px',
              padding: '2rem'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', textTransform: 'uppercase' }}>
              PRINT JOB PREVIEW ({selectedJob.orderNumber})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Client: {selectedJob.customerName} • {selectedJob.garmentType}
            </p>

            <div style={{ backgroundColor: '#09090c', padding: '1.5rem', borderRadius: '2px', textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: selectedJob.fontFamily, fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.1em' }}>
                {selectedJob.customText}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Vector Scale: 100% • Centered on Front Chest
              </p>
            </div>

            <button onClick={() => setSelectedJob(null)} className="btn btn-gold btn-block btn-sm">
              CLOSE PREVIEW
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
