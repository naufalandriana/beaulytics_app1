import { createContext, useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Create Compare Context
const CompareContext = createContext();

// Custom hook to use the compare context
export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

// Compare Provider Component
export const CompareProvider = ({ children }) => {
  // Initialize compare list from localStorage or empty array
  const [compareList, setCompareList] = useState(() => {
    const savedList = localStorage.getItem('compareList');
    return savedList ? JSON.parse(savedList) : [];
  });
  
  const [notification, setNotification] = useState(null);
  const MAX_COMPARE_ITEMS = 3; // Maximum number of products to compare

  // Save compare list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  // Add product to compare list
  const addToCompare = (product) => {
    setCompareList(prevList => {
      // Check if product already exists in compare list
      if (prevList.some(item => item.id === product.id)) {
        setNotification({
          message: `${product.name} is already in your compare list`,
          type: 'info'
        });
        return prevList;
      }
      
      // Check if compare list is full
      if (prevList.length >= MAX_COMPARE_ITEMS) {
        setNotification({
          message: `You can only compare up to ${MAX_COMPARE_ITEMS} products. Remove one to add another.`,
          type: 'warning'
        });
        return prevList;
      }
      
      // Add product to compare list
      setNotification({
        message: `${product.name} added to compare list`,
        type: 'success'
      });
      return [...prevList, product];
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Remove product from compare list
  const removeFromCompare = (productId) => {
    setCompareList(prevList => prevList.filter(item => item.id !== productId));
    setNotification({
      message: 'Product removed from compare list',
      type: 'info'
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Clear compare list
  const clearCompareList = () => {
    setCompareList([]);
    setNotification({
      message: 'Compare list cleared',
      type: 'info'
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Check if product is in compare list
  const isInCompareList = (productId) => {
    return compareList.some(item => item.id === productId);
  };

  // Reorder compare list (for drag and drop functionality)
  const reorderCompareList = (startIndex, endIndex) => {
    const result = Array.from(compareList);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setCompareList(result);
  };

  // Context value
  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompareList,
    isInCompareList,
    reorderCompareList,
    notification,
    maxCompareItems: MAX_COMPARE_ITEMS
  };

  return (
    <CompareContext.Provider value={value}>
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
              backgroundColor: 
                notification.type === 'success' ? 'var(--success)' : 
                notification.type === 'warning' ? '#FF9800' : 
                notification.type === 'info' ? '#2196F3' : 
                'var(--error)',
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
    </CompareContext.Provider>
  );
};

export default CompareContext;