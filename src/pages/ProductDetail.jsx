import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowLeft, FaStar, FaCheck } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';

// Import contexts
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';

// Import Supabase client
import { productService } from '../lib/supabaseClient';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Use context hooks
  const { addToCart } = useCart();
  const { addToCompare, isInCompareList } = useCompare();
  
  // Fetch product data from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the specific product by ID from Supabase
        const productData = await productService.getProductById(parseInt(id));
        setProduct(productData);
        
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Reset image states when product changes
  useEffect(() => {
    if (product) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [product]);
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading product...</p>
      </LoadingContainer>
    );
  }
  
  if (error) {
    return (
      <ErrorContainer>
        <h2>Failed to Load Product</h2>
        <p>Error: {error}</p>
        <BackButton as={Link} to="/products">
          <FaArrowLeft /> Back to Products
        </BackButton>
      </ErrorContainer>
    );
  }
  
  if (!product) {
    return (
      <ErrorContainer>
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <BackButton as={Link} to="/products">
          <FaArrowLeft /> Back to Products
        </BackButton>
      </ErrorContainer>
    );
  }
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const handleAddToCompare = () => {
    addToCompare(product);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoading(false);
    e.target.src = `/images/products/placeholder.jpg`;
  };
  
  const inCompareList = isInCompareList(product.id);
  
  // Process skin_type and concerns arrays (handle both string and array formats)
  const skinTypes = product.skin_type 
    ? Array.isArray(product.skin_type) 
      ? product.skin_type 
      : product.skin_type.split(',').map(type => type.trim())
    : [];
    
  const concerns = product.concerns 
    ? Array.isArray(product.concerns) 
      ? product.concerns 
      : product.concerns.split(',').map(concern => concern.trim())
    : [];
    
  const ingredients = product.ingredients 
    ? Array.isArray(product.ingredients) 
      ? product.ingredients 
      : product.ingredients.split(',').map(ingredient => ingredient.trim())
    : [];
  
  return (
    <ProductDetailContainer>
      <BackLink as={Link} to="/products">
        <FaArrowLeft /> Back to Products
      </BackLink>
      
      <ProductContent>
        <ProductImageContainer>
          {imageLoading && !imageError && (
            <ImageLoadingOverlay>
              <ImageLoadingSpinner />
            </ImageLoadingOverlay>
          )}
          <ProductImage 
            src={product.image || `/images/products/placeholder.jpg`} 
            alt={product.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ 
              opacity: imageLoading ? 0 : 1,
              transition: 'opacity 0.3s ease'
            }}
          />
        </ProductImageContainer>
        
        <ProductInfo>
          <ProductCategory>{product.category || 'Skincare'}</ProductCategory>
          <ProductName>{product.name}</ProductName>
          
          <ProductRating>
            <FaStar color="#FFEB3B" />
            <span>{product.rating || 4.5} ({product.reviews || 0} reviews)</span>
          </ProductRating>
          
          <ProductPrice>
            Rp {(product.price || 0).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
          </ProductPrice>
          
          <ProductDescription>
            {product.description || 'No description available.'}
          </ProductDescription>
          
          <ProductMeta>
            <MetaItem>
              <MetaLabel>Size:</MetaLabel>
              <MetaValue>{product.size || 'N/A'}</MetaValue>
            </MetaItem>
            
            {skinTypes.length > 0 && (
              <MetaItem>
                <MetaLabel>Skin Type:</MetaLabel>
                <MetaValue>{skinTypes.join(', ')}</MetaValue>
              </MetaItem>
            )}
            
            {product.brand && (
              <MetaItem>
                <MetaLabel>Brand:</MetaLabel>
                <MetaValue>{product.brand}</MetaValue>
              </MetaItem>
            )}
          </ProductMeta>
          
          <AddToCartSection>
            <QuantityControl>
              <QuantityLabel>Quantity:</QuantityLabel>
              <QuantityWrapper>
                <QuantityButton 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput 
                  type="number" 
                  min="1" 
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <QuantityButton onClick={() => setQuantity(prev => prev + 1)}>
                  +
                </QuantityButton>
              </QuantityWrapper>
            </QuantityControl>
            
            <ActionButtons>
              <AddToCartButton onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </AddToCartButton>
              
              <CompareButton 
                onClick={handleAddToCompare}
                isInCompare={inCompareList}
                disabled={inCompareList}
              >
                {inCompareList ? (
                  <>
                    <FaCheck /> In Compare
                  </>
                ) : (
                  <>
                    <MdCompare /> Add to Compare
                  </>
                )}
              </CompareButton>
            </ActionButtons>
          </AddToCartSection>
        </ProductInfo>
      </ProductContent>
      
      <ProductTabs>
        <TabButtons>
          <TabButton 
            isActive={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </TabButton>
          {ingredients.length > 0 && (
            <TabButton 
              isActive={activeTab === 'ingredients'}
              onClick={() => setActiveTab('ingredients')}
            >
              Ingredients
            </TabButton>
          )}
          {product.how_to_use && (
            <TabButton 
              isActive={activeTab === 'howToUse'}
              onClick={() => setActiveTab('howToUse')}
            >
              How to Use
            </TabButton>
          )}
        </TabButtons>
        
        <TabContent>
          {activeTab === 'description' && (
            <TabPanel>
              <p>{product.description || 'No description available.'}</p>
              
              {concerns.length > 0 && (
                <ConcernsSection>
                  <h4>Addresses These Concerns:</h4>
                  <ConcernsList>
                    {concerns.map(concern => (
                      <ConcernTag key={concern}>{concern}</ConcernTag>
                    ))}
                  </ConcernsList>
                </ConcernsSection>
              )}
            </TabPanel>
          )}
          
          {activeTab === 'ingredients' && ingredients.length > 0 && (
            <TabPanel>
              <IngredientsList>
                {ingredients.map(ingredient => (
                  <IngredientItem key={ingredient}>
                    <FaCheck /> {ingredient}
                  </IngredientItem>
                ))}
              </IngredientsList>
            </TabPanel>
          )}
          
          {activeTab === 'howToUse' && product.how_to_use && (
            <TabPanel>
              <p>{product.how_to_use}</p>
            </TabPanel>
          )}
        </TabContent>
      </ProductTabs>
    </ProductDetailContainer>
  );
};

// Styled Components
const ProductDetailContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--black);
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  background-color: var(--light-gray);
  min-height: 400px;
  
  @media (max-width: 992px) {
    min-height: 300px;
  }
`;

const ImageLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  z-index: 1;
`;

const ImageLoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid var(--medium-gray);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  min-height: 400px;
  object-fit: cover;
  display: block;
  
  @media (max-width: 992px) {
    min-height: 300px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  span {
    color: var(--dark-gray);
  }
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ProductDescription = styled.p`
  color: var(--dark-gray);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MetaLabel = styled.span`
  font-weight: 600;
`;

const MetaValue = styled.span`
  color: var(--dark-gray);
  text-transform: capitalize;
`;

const AddToCartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
`;

const QuantityWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  height: 36px;
  text-align: center;
  border: 1px solid var(--light-gray);
  border-radius: 4px;
  margin: 0 0.5rem;
  font-size: 1rem;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const CompareButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--medium-gray);
  background-color: ${props => props.isInCompare ? 'var(--light-gray)' : 'transparent'};
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: var(--light-gray);
  }
  
  &:disabled {
    cursor: default;
  }
`;

const ProductTabs = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid var(--light-gray);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  background-color: ${props => props.isActive ? 'white' : 'var(--light-gray)'};
  border: none;
  border-bottom: ${props => props.isActive ? '2px solid var(--primary)' : 'none'};
  font-weight: ${props => props.isActive ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? 'white' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  padding: 2rem;
`;

const TabPanel = styled.div`
  line-height: 1.6;
`;

const ConcernsSection = styled.div`
  margin-top: 2rem;
  
  h4 {
    margin-bottom: 1rem;
  }
`;

const ConcernsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ConcernTag = styled.span`
  background-color: var(--light-gray);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const IngredientItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: var(--success);
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

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

export default ProductDetail;