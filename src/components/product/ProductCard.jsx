import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';

// Import contexts
import { useCart } from '../../context/CartContext';
import { useCompare } from '../../context/CompareContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToCompare, isInCompareList } = useCompare();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };
  
  const handleAddToCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };
  
  const inCompareList = isInCompareList(product.id);
  
  return (
    <Card 
      as={motion.div}
      whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.id}`}>
        <ImageContainer>
          <ProductImage src={product.image || `../src/assets/images/products/placeholder.jpg`} alt={product.name} />
          <AnimatedActions isVisible={isHovered}>
            <ActionButton onClick={handleAddToCart}>
              <FaShoppingCart /> Add to Cart
            </ActionButton>
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
                  <MdCompare /> Compare
                </>
              )}
            </CompareButton>
          </AnimatedActions>
        </ImageContainer>
        
        <ProductInfo>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductName>{product.name}</ProductName>
          <ProductRating>
            <FaStar color="#FFEB3B" />
            <span>{product.rating} ({product.reviews} reviews)</span>
          </ProductRating>
          <ProductPrice>
  Rp {product.price.toLocaleString('id-ID', { minimumFractionDigits: 0 })}
</ProductPrice>
        </ProductInfo>
      </Link>
    </Card>
  );
};

// Styled Components
const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  height: 100%;
  
  a {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%;
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
`;

const AnimatedActions = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  transform: translateY(${props => props.isVisible ? '0' : '100%'});
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: all 0.3s ease;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const CompareButton = styled(ActionButton)`
  background-color: ${props => props.isInCompare ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.isInCompare ? 'white' : 'var(--black)'};
  
  &:disabled {
    cursor: default;
    transform: none;
    box-shadow: none;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ProductCategory = styled.p`
  color: var(--dark-gray);
  font-size: 0.8rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  span {
    color: var(--dark-gray);
  }
`;

const ProductPrice = styled.p`
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: auto;
  color: var(--black);
`;

export default ProductCard;