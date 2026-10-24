import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CustomStudioPage } from './pages/CustomStudioPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/TermsConditionsPage';
import { SearchResultsPage } from './pages/SearchResultsPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomPrintsPage } from './pages/admin/AdminCustomPrintsPage';

// Protected Admin Route Helper
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

// Layout Shell for conditional public navigation
const AppShell: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}

      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/custom-studio" element={<CustomStudioPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboardPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedAdminRoute>
                <AdminProductsPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedAdminRoute>
                <AdminOrdersPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/custom-prints"
            element={
              <ProtectedAdminRoute>
                <AdminCustomPrintsPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="section" style={{ textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-gold)' }}>404</h1>
                <h2 style={{ fontSize: '1.5rem', textTransform: 'uppercase', marginBottom: '1rem' }}>PAGE NOT FOUND</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  The requested atelier route does not exist.
                </p>
                <Link to="/" className="btn btn-gold">
                  RETURN TO HOME
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
