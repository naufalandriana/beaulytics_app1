import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

// Import context
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isCartOpen, toggleCart } = useCart();
  
  // Close cart sidebar when navigating to cart page
  useEffect(() => {
    if (isCartOpen) {
      toggleCart();
    }
  }, [isCartOpen, toggleCart]);
  
  return (
    <CartContainer>
      <CartHeader>
        <h1>Your Shopping Cart</h1>
        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
      </CartHeader>
      
      {cart.length === 0 ? (
        <EmptyCartMessage>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any products to your cart yet.</p>
          <ShopButton as={Link} to="/products">
            Browse Products <FaArrowRight />
          </ShopButton>
        </EmptyCartMessage>
      ) : (
        <CartContent>
          <CartItems>
            <CartItemsHeader>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </CartItemsHeader>
            
            <AnimatePresence>
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  as={motion.div}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ItemInfo>
                    <ItemImage src={item.image || `/images/products/placeholder.jpg`} alt={item.name} />
                    <ItemDetails>
                      <ItemName>{item.name}</ItemName>
                      <ItemCategory>{item.category}</ItemCategory>
                    </ItemDetails>
                  </ItemInfo>
                  
                  <ItemPrice>Rp {item.price.toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</ItemPrice>
                  
                  <QuantityControl>
                    <QuantityButton 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </QuantityButton>
                    <QuantityInput 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                    <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      +
                    </QuantityButton>
                  </QuantityControl>
                  
                  <ItemTotal>Rp {(item.price * item.quantity).toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</ItemTotal>
                  
                  <RemoveButton onClick={() => removeFromCart(item.id)}>
                    <FaTrash />
                  </RemoveButton>
                </CartItem>
              ))}
            </AnimatePresence>
          </CartItems>
          
          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>Rp {(getTotalPrice()).toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Shipping</span>
              <span>Free</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Tax (10%)</span>
              <span>Rp {(getTotalPrice() * 0.1).toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</span>
            </SummaryRow>
            
            <SummaryDivider />
            
            <SummaryTotal>
              <span>Total</span>
              <span>Rp {(getTotalPrice() * 1.1).toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</span>
            </SummaryTotal>
            
            <CheckoutButton 
              as={Link} 
              to="/checkout"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Proceed to Checkout
            </CheckoutButton>
            
            <ContinueShoppingButton as={Link} to="/products">
              <FaArrowLeft /> Continue Shopping
            </ContinueShoppingButton>
          </CartSummary>
        </CartContent>
      )}
    </CartContainer>
  );
};

// Styled Components
const CartContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CartHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--dark-gray);
    margin-bottom: 2rem;
  }
`;

const ShopButton = styled(motion.button)`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  overflow: hidden;
`;

const CartItemsHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
  font-weight: 600;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--light-gray);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    position: relative;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border: 1px solid var(--light-gray);
    border-radius: 8px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemCategory = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    
    &:before {
      content: 'Price:';
      color: var(--dark-gray);
    }
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    &:before {
      content: 'Quantity:';
      color: var(--dark-gray);
      margin-right: auto;
    }
  }
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 30px;
  text-align: center;
  border: 1px solid var(--medium-gray);
  border-radius: 4px;
  margin: 0 0.5rem;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const ItemTotal = styled.div`
  font-weight: 600;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    
    &:before {
      content: 'Total:';
      color: var(--dark-gray);
    }
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--dark-gray);
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  justify-content: center;
  
  &:hover {
    color: var(--error);
  }
  
  @media (max-width: 768px) {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

const CartSummary = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  align-self: flex-start;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  &:last-of-type {
    margin-bottom: 0;
  }
`;

const SummaryDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--light-gray);
  margin: 1rem 0;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const ContinueShoppingButton = styled.button`
  width: 100%;
  background: none;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

export default Cart;