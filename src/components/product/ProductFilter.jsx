import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductFilter = ({ products, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    skinTypes: [],
    concerns: [],
    priceRange: { min: 0, max: 100 }
  });
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    skinTypes: [],
    concerns: [],
    priceRange: { min: 0, max: 100 }
  });
  
  // Extract all available filter options from products
  useEffect(() => {
    if (!products || products.length === 0) return;
    
    const categories = new Set();
    const skinTypes = new Set();
    const concerns = new Set();
    let minPrice = Infinity;
    let maxPrice = 0;
    
    products.forEach(product => {
      // Categories
      categories.add(product.category);
      
      // Skin types
      product.skinType?.forEach(type => skinTypes.add(type));
      
      // Concerns
      product.concerns?.forEach(concern => concerns.add(concern));
      
      // Price range
      if (product.price < minPrice) minPrice = product.price;
      if (product.price > maxPrice) maxPrice = product.price;
    });
    
    setFilters({
      categories: Array.from(categories).sort(),
      skinTypes: Array.from(skinTypes).sort(),
      concerns: Array.from(concerns).sort(),
      priceRange: { 
        min: Math.floor(minPrice), 
        max: Math.ceil(maxPrice) 
      }
    });
    
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: { 
        min: Math.floor(minPrice), 
        max: Math.ceil(maxPrice) 
      }
    }));
  }, [products]);
  
  // Handle filter changes
  const handleFilterChange = (filterType, value, isChecked) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (Array.isArray(newFilters[filterType])) {
        if (isChecked) {
          newFilters[filterType] = [...newFilters[filterType], value];
        } else {
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        }
      }
      
      return newFilters;
    });
  };
  
  // Handle price range changes
  const handlePriceChange = (type, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: Number(value)
      }
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    onFilterChange(selectedFilters);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSelectedFilters({
      categories: [],
      skinTypes: [],
      concerns: [],
      priceRange: filters.priceRange
    });
    onFilterChange(null);
  };
  
  // Toggle filter panel on mobile
  const toggleFilterPanel = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <FilterContainer>
      <MobileFilterToggle onClick={toggleFilterPanel}>
        <FaFilter /> Filters
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </MobileFilterToggle>
      
      <FilterPanel isOpen={isOpen}>
        <FilterHeader>
          <h3>Filter Products</h3>
          <CloseButton onClick={() => setIsOpen(false)}>
            <FaTimes />
          </CloseButton>
        </FilterHeader>
        
        <FilterSection>
          <FilterTitle>Categories</FilterTitle>
          <CheckboxGroup>
            {filters.categories.map(category => (
              <CheckboxItem key={`category-${category}`}>
                <Checkbox 
                  type="checkbox"
                  id={`category-${category}`}
                  checked={selectedFilters.categories.includes(category)}
                  onChange={(e) => handleFilterChange('categories', category, e.target.checked)}
                />
                <CheckboxLabel htmlFor={`category-${category}`}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Skin Type</FilterTitle>
          <CheckboxGroup>
            {filters.skinTypes.map(type => (
              <CheckboxItem key={`skinType-${type}`}>
                <Checkbox 
                  type="checkbox"
                  id={`skinType-${type}`}
                  checked={selectedFilters.skinTypes.includes(type)}
                  onChange={(e) => handleFilterChange('skinTypes', type, e.target.checked)}
                />
                <CheckboxLabel htmlFor={`skinType-${type}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Concerns</FilterTitle>
          <CheckboxGroup>
            {filters.concerns.map(concern => (
              <CheckboxItem key={`concern-${concern}`}>
                <Checkbox 
                  type="checkbox"
                  id={`concern-${concern}`}
                  checked={selectedFilters.concerns.includes(concern)}
                  onChange={(e) => handleFilterChange('concerns', concern, e.target.checked)}
                />
                <CheckboxLabel htmlFor={`concern-${concern}`}>
                  {concern.charAt(0).toUpperCase() + concern.slice(1)}
                </CheckboxLabel>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FilterSection>
        
        <FilterSection>
          <FilterTitle>Price Range</FilterTitle>
          <PriceRangeContainer>
            <PriceInput>
              <label htmlFor="min-price">Min (Rp)</label>
              <input 
                type="number" 
                id="min-price"
                min={filters.priceRange.min}
                max={selectedFilters.priceRange.max}
                value={selectedFilters.priceRange.min}
                onChange={(e) => handlePriceChange('min', Number(e.target.value))}
              />
            </PriceInput>

            <PriceRangeDivider>-</PriceRangeDivider>

            <PriceInput>
              <label htmlFor="max-price">Max (Rp)</label>
              <input 
                type="number" 
                id="max-price"
                min={selectedFilters.priceRange.min}
                max={filters.priceRange.max}
                value={selectedFilters.priceRange.max}
                onChange={(e) => handlePriceChange('max', Number(e.target.value))}
              />
            </PriceInput>
          </PriceRangeContainer>
        </FilterSection>
        
        <FilterActions>
          <ResetButton onClick={resetFilters}>
            Reset All
          </ResetButton>
          <ApplyButton 
            onClick={applyFilters}
            as={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Apply Filters
          </ApplyButton>
        </FilterActions>
      </FilterPanel>
    </FilterContainer>
  );
};

// Styled Components
const FilterContainer = styled.div`
  position: relative;
  
  @media (min-width: 768px) {
    min-width: 250px;
    max-width: 300px;
  }
`;

const MobileFilterToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.5rem;
    &:last-child {
      margin-right: 0;
      margin-left: 0.5rem;
    }
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const FilterPanel = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  
  @media (max-width: 767px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 0;
    transform: translateX(${props => props.isOpen ? '0' : '100%'});
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--dark-gray);
  
  &:hover {
    color: var(--black);
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const FilterTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  cursor: pointer;
  accent-color: var(--primary);
  width: 18px;
  height: 18px;
`;

const CheckboxLabel = styled.label`
  cursor: pointer;
  font-size: 0.9rem;
  user-select: none;
`;

const PriceRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PriceInput = styled.div`
  flex: 1;
  
  label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    color: var(--dark-gray);
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--medium-gray);
    border-radius: 4px;
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
    }
  }
`;

const PriceRangeDivider = styled.span`
  font-weight: 600;
  color: var(--dark-gray);
`;

const FilterActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ResetButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  background: none;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

const ApplyButton = styled.button`
  flex: 2;
  padding: 0.75rem 1rem;
  background-color: var(--primary);
  color: var(--black);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

export default ProductFilter;