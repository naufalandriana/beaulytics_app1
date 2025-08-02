import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitle = ({ title }) => {
  useEffect(() => {
    // Set the document title with the provided title
    document.title = title ? `Beaulytics | ${title}` : 'Beaulytics';
    
    // Restore the default title when component unmounts
    return () => {
      document.title = 'Beaulytics';
    };
  }, [title]);

  return null; // This component doesn't render anything
};

// Helper component that automatically sets title based on current route
export const RouteTitle = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Map routes to page titles
    const getTitleFromPath = (pathname) => {
      switch (pathname) {
        case '/':
          return 'Home';
        case '/products':
          return 'Products';
        case '/compare':
          return 'Compare';
        case '/login':
          return 'Login';
        case '/checkout':
          return 'Checkout';
        case '/cart':
          return 'Cart';
        case '/payment':
          return 'Payment';
        default:
          // For product detail pages
          if (pathname.startsWith('/products/')) {
            return 'Product Detail';
          }
          return '';
      }
    };
    
    const pageTitle = getTitleFromPath(location.pathname);
    document.title = pageTitle ? `Beaulytics | ${pageTitle}` : 'Beaulytics';
  }, [location]);

  return null;
};

export default PageTitle;