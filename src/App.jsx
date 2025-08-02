import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// Theme and Global Styles
import { theme, GlobalStyle } from './styles/theme';
import './App.css'
import './index.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Compare from './pages/Compare';
import Checkout from './pages/Checkout';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Profile from './pages/Profile';
import Security from './pages/Security';
import OurStory from './pages/OurStory';
import Ingredients from './pages/Ingredients';
import Sustainability from './pages/Sustainability';
import Blog from './pages/Blog';
import Press from './pages/Press';
import FAQ from './pages/FAQ';
import ShippingReturns from './pages/ShippingReturns';
import ContactUs from './pages/ContactUs';
import TrackOrder from './pages/TrackOrder';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Auth from './pages/Auth';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartSidebar from './components/cart/CartSidebar';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CompareProvider } from './context/CompareContext';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>

      <GlobalStyle />
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <Router>
              <div className="app-container">
                <Header />
                <CartSidebar />
                <main style={{ display: 'flex', flex: 1, width: '100%' }}>
                  {/* Temporarily disable AnimatePresence */}
                  {/* <AnimatePresence mode="wait"> */}
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetail />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/reset-password" element={<Auth />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/payment" element={<Payment />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/security" element={<Security />} />
                      <Route path="/our-story" element={<OurStory />} />
                      <Route path="/ingredients" element={<Ingredients />} />
                      <Route path="/sustainability" element={<Sustainability />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/press" element={<Press />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping-returns" element={<ShippingReturns />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="/track-order" element={<TrackOrder />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="*" element={<div>Page Not Found</div>} />
                    </Routes>
                  {/* </AnimatePresence> */}
                </main>
                <Footer />
              </div>
            </Router>
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
