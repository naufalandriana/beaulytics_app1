import { createContext, useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Create Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new product to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
    
    // Show notification
    setNotification({
      message: `${product.name} added to cart`,
      type: 'success'
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  // Context value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isCartOpen,
    toggleCart,
    notification
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      
      {/* Notification component */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            className="notification"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: notification.type === 'success' ? 'var(--success)' : 'var(--error)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
};

export default CartContext;