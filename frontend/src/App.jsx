import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import MyProducts from './pages/seller/MyProducts';
import BuyerHome from './pages/buyer/BuyerHome';
import ProductDetail from './pages/buyer/ProductDetail';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';

export default function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={
          currentUser ? <Navigate to={currentUser.role === 'seller' ? '/seller/dashboard' : '/buyer/browse'} replace /> : <Signup />
        } />
        <Route path="/login" element={
          currentUser ? <Navigate to={currentUser.role === 'seller' ? '/seller/dashboard' : '/buyer/browse'} replace /> : <Login />
        } />

        {/* Seller Routes */}
        <Route path="/seller/dashboard" element={
          <ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>
        } />
        <Route path="/seller/add-product" element={
          <ProtectedRoute role="seller"><AddProduct /></ProtectedRoute>
        } />
        <Route path="/seller/my-products" element={
          <ProtectedRoute role="seller"><MyProducts /></ProtectedRoute>
        } />

        {/* Buyer Routes */}
        <Route path="/buyer/browse" element={
          <ProtectedRoute role="buyer"><BuyerHome /></ProtectedRoute>
        } />
        <Route path="/buyer/product/:id" element={
          <ProtectedRoute role="buyer"><ProductDetail /></ProtectedRoute>
        } />
        <Route path="/buyer/cart" element={
          <ProtectedRoute role="buyer"><Cart /></ProtectedRoute>
        } />
        <Route path="/buyer/checkout" element={
          <ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
