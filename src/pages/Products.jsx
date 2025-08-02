import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes } from 'react-icons/fa';

// Import components
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';

// Import Supabase client
import { productService } from '../lib/supabaseClient';

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Parse query parameters for initial filtering
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        
        let productsArray;
        
        // If category parameter exists, fetch products by category
        if (categoryParam) {
          productsArray = await productService.getProductsByCategory(categoryParam);
        } else {
          // Otherwise, fetch all products
          productsArray = await productService.getAllProducts();
        }
        
        setProducts(productsArray);
        
        // Apply initial category filter if present in URL
        if (categoryParam && productsArray.length > 0) {
          setFilteredProducts(productsArray);
          setActiveFilters({
            categories: [categoryParam.toLowerCase()],
            skinTypes: [],
            concerns: [],
            priceRange: { 
              min: Math.min(...productsArray.map(p => p.price || 0)), 
              max: Math.max(...productsArray.map(p => p.price || 0)) 
            }
          });
        } else {
          setFilteredProducts(productsArray);
        }
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);
  
  // Handle filter changes
  const handleFilterChange = (filters) => {
    if (!filters) {
      // Reset filters
      setFilteredProducts(products);
      setActiveFilters(null);
      return;
    }
    
    setActiveFilters(filters);
    
    // Apply filters
    const filtered = products.filter(product => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category?.toLowerCase())) {
        return false;
      }
      
      // Skin type filter
      if (filters.skinTypes.length > 0 && product.skin_type) {
        const productSkinTypes = Array.isArray(product.skin_type) 
          ? product.skin_type 
          : product.skin_type.split(',').map(type => type.trim());
        
        if (!filters.skinTypes.some(type => productSkinTypes.includes(type))) {
          return false;
        }
      }
      
      // Concerns filter
      if (filters.concerns.length > 0 && product.concerns) {
        const productConcerns = Array.isArray(product.concerns) 
          ? product.concerns 
          : product.concerns.split(',').map(concern => concern.trim());
        
        if (!filters.concerns.some(concern => productConcerns.includes(concern))) {
          return false;
        }
      }
      
      // Price range filter
      const productPrice = product.price || 0;
      if (productPrice < filters.priceRange.min || productPrice > filters.priceRange.max) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProducts(filtered);
  };
  
  // Clear a specific filter
  const clearFilter = (filterType, value) => {
    if (!activeFilters) return;
    
    const newFilters = { ...activeFilters };
    
    if (filterType === 'priceRange') {
      newFilters.priceRange = { 
        min: Math.min(...products.map(p => p.price || 0)), 
        max: Math.max(...products.map(p => p.price || 0)) 
      };
    } else {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    }
    
    handleFilterChange(newFilters);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    handleFilterChange(null);
  };
  
  // Toggle mobile filter panel
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  // Loading state
  if (loading) {
    return (
      <ProductsContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading products...</p>
        </LoadingContainer>
      </ProductsContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <ProductsContainer>
        <ErrorContainer>
          <h2>Failed to Load Products</h2>
          <p>Error: {error}</p>
          <RetryButton onClick={() => window.location.reload()}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      </ProductsContainer>
    );
  }
  
  return (
    <ProductsContainer>
      <ProductsHeader>
        <h1>All Products</h1>
        <p>Discover our range of skincare products ({products.length} products)</p>
        
        <MobileFilterButton onClick={toggleMobileFilter}>
          <FaFilter /> Filters
        </MobileFilterButton>
        
        {activeFilters && Object.values(activeFilters).some(filter => 
          Array.isArray(filter) ? filter.length > 0 : true
        ) && (
          <ActiveFiltersContainer>
            <ActiveFiltersTitle>Active Filters:</ActiveFiltersTitle>
            <ActiveFiltersList>
              {activeFilters.categories.map(category => (
                <ActiveFilterTag key={`category-${category}`}>
                  Category: {category}
                  <RemoveFilterButton onClick={() => clearFilter('categories', category)}>
                    <FaTimes />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              ))}
              
              {activeFilters.skinTypes.map(type => (
                <ActiveFilterTag key={`skinType-${type}`}>
                  Skin Type: {type}
                  <RemoveFilterButton onClick={() => clearFilter('skinTypes', type)}>
                    <FaTimes />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              ))}
              
              {activeFilters.concerns.map(concern => (
                <ActiveFilterTag key={`concern-${concern}`}>
                  Concern: {concern}
                  <RemoveFilterButton onClick={() => clearFilter('concerns', concern)}>
                    <FaTimes />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              ))}
              
              {(activeFilters.priceRange.min > Math.min(...products.map(p => p.price || 0)) || 
                activeFilters.priceRange.max < Math.max(...products.map(p => p.price || 0))) && (
                <ActiveFilterTag key="price-range">
                  Price: Rp {(activeFilters.priceRange.min).toLocaleString('id-ID',{ minimumFractionDigits: 0 })} - Rp {(activeFilters.priceRange.max).toLocaleString('id-ID')}
                  <RemoveFilterButton onClick={() => clearFilter('priceRange')}>
                    <FaTimes />
                  </RemoveFilterButton>
                </ActiveFilterTag>
              )}
              
              <ClearAllButton onClick={clearAllFilters}>
                Clear All
              </ClearAllButton>
            </ActiveFiltersList>
          </ActiveFiltersContainer>
        )}
      </ProductsHeader>
      
      <ProductsContent>
        <FilterSidebar isMobileOpen={isMobileFilterOpen}>
          <MobileFilterHeader>
            <h3>Filters</h3>
            <CloseFilterButton onClick={toggleMobileFilter}>
              <FaTimes />
            </CloseFilterButton>
          </MobileFilterHeader>
          
          <ProductFilter 
            products={products} 
            onFilterChange={handleFilterChange} 
          />
        </FilterSidebar>
        
        <ProductsGrid>
          {filteredProducts.length === 0 ? (
            <NoProductsMessage>
              <h3>No products found</h3>
              <p>Try adjusting your filters to find what you're looking for.</p>
              <ResetButton onClick={clearAllFilters}>
                Reset Filters
              </ResetButton>
            </NoProductsMessage>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </ProductsGrid>
      </ProductsContent>
    </ProductsContainer>
  );
};

// Styled Components
const ProductsContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProductsHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-weight: 500;
  margin-top: 1rem;
  cursor: pointer;
  
  @media (max-width: 992px) {
    display: flex;
  }
`;

const ActiveFiltersContainer = styled.div`
  margin-top: 1.5rem;
`;

const ActiveFiltersTitle = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ActiveFiltersList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ActiveFilterTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--light-gray);
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  color: var(--dark-gray);
  
  &:hover {
    color: var(--black);
  }
`;

const ClearAllButton = styled.button`
  background: none;
  border: 1px solid var(--medium-gray);
  border-radius: 20px;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const ProductsContent = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FilterSidebar = styled.div`
  @media (max-width: 992px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    z-index: 1000;
    padding: 1.5rem;
    overflow-y: auto;
    transform: translateX(${props => props.isMobileOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
  }
`;

const MobileFilterHeader = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 992px) {
    display: flex;
  }
`;

const CloseFilterButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--dark-gray);
  
  &:hover {
    color: var(--black);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const NoProductsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background-color: var(--light-gray);
  border-radius: 10px;
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
    margin-bottom: 1.5rem;
  }
`;

const ResetButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-gray);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    color: var(--error);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--dark-gray);
    margin-bottom: 1.5rem;
  }
`;

const RetryButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

export default Products;