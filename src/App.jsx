// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import History from './pages/History';
import ProductDetail from './pages/ProductDetail';
import SearchResults from './pages/SearchResults';
import CartPage from './pages/CartPage';
import ProductList from './pages/ProductList';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomFooter from './components/Footer';
import UserProfile from './pages/UserProfile'; 
import Logout from './pages/Logout';
import Auth from './pages/Auth';
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  const isAuth = Boolean(localStorage.getItem('token'));

  return (
    <GoogleOAuthProvider clientId="141475592651-5pecc5oh35ka0ckd0r16ogv8g10bi7dt.apps.googleusercontent.com">
      <Router>
        <Header />
        <div style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/favorites" element={isAuth ? <Favorites /> : <Navigate to="/auth" />} />
            <Route path="/history" element={isAuth ? <History /> : <Navigate to="/auth" />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<ProductList />} />

            <Route path="/auth" element={!isAuth ? <Auth /> : <Navigate to="/profile" />} />
            <Route path="/profile" element={isAuth ? <UserProfile /> : <Navigate to="/auth" />} />
            <Route path="/checkout" element={isAuth ? <CheckoutPage /> : <Navigate to="/auth" />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
        <CustomFooter />
      </Router>
    </GoogleOAuthProvider>
  );
}
