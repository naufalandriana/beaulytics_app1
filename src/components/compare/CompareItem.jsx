import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const CompareItem = ({ product, onRemove }) => {
  if (!product) {
    return null;
  }

  return (
    <ProductCard
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <RemoveButton onClick={() => onRemove(product.id)}>
        <FaTimes />
      </RemoveButton>
      
      <ProductImage src={product.image || `/images/products/placeholder.jpg`} alt={product.name} />
      <ProductName>{product.name}</ProductName>
      <ProductCategory>{product.category}</ProductCategory>
      <ProductPrice>Rp {product.price .toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</ProductPrice>
      <ProductRating>
        <RatingValue>{product.rating}</RatingValue>
        <RatingCount>({product.reviews} reviews)</RatingCount>
      </ProductRating>
    </ProductCard>
  );
};

// Styled Components
const ProductCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  height: 100%;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1rem;
  color: var(--dark-gray);
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--error);
  }
`;

const ProductImage = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--black);
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: var(--black);
`;

const RatingCount = styled.span`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

export default CompareItem;