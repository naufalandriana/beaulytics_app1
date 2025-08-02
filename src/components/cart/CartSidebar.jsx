import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTrash, FaArrowRight } from 'react-icons/fa';

// Import context
import { useCart } from '../../context/CartContext';

const CartSidebar = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, isCartOpen, toggleCart } = useCart();
  const sidebarRef = useRef(null);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCartOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleCart();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);
  
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCartOpen]);
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <Overlay 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <Sidebar
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <SidebarHeader>
              <h3>Your Cart ({cart.length})</h3>
              <CloseButton onClick={toggleCart}>
                <FaTimes />
              </CloseButton>
            </SidebarHeader>
            
            {cart.length === 0 ? (
              <EmptyCart>
                <p>Your cart is empty</p>
                <ShopButton as={Link} to="/products" onClick={toggleCart}>
                  Shop Now
                </ShopButton>
              </EmptyCart>
            ) : (
              <>
                <CartItems>
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
                        <ItemImage src={item.image || `/images/products/placeholder.jpg`} alt={item.name} />
                        
                        <ItemInfo>
                          <ItemName>{item.name}</ItemName>
                          <ItemCategory>{item.category}</ItemCategory>
                          <ItemPrice>Rp {item.price.toLocaleString('id-ID',{ minimumFractionDigits: 0 })}</ItemPrice>
                          
                          <QuantityControl>
                            <QuantityButton 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </QuantityButton>
                            <QuantityDisplay>{item.quantity}</QuantityDisplay>
                            <QuantityButton onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              +
                            </QuantityButton>
                          </QuantityControl>
                        </ItemInfo>
                        
                        <RemoveButton onClick={() => removeFromCart(item.id)}>
                          <FaTrash />
                        </RemoveButton>
                      </CartItem>
                    ))}
                  </AnimatePresence>
                </CartItems>
                
                <CartFooter>
                  <Subtotal>
                    <span>Subtotal:</span>
                    <span>Rp {getTotalPrice().toLocaleString('id-ID', { minimumFractionDigits: 0 })}</span>
                  </Subtotal>
                  
                  <CheckoutButton as={Link} to="/checkout" onClick={toggleCart}>
                    Checkout <FaArrowRight />
                  </CheckoutButton>
                  
                  <ViewCartButton as={Link} to="/cart" onClick={toggleCart}>
                    View Cart
                  </ViewCartButton>
                </CartFooter>
              </>
            )}
          </Sidebar>
        </>
      )}
    </AnimatePresence>
  );
};

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Sidebar = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background-color: white;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
  
  h3 {
    font-size: 1.2rem;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--dark-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: var(--black);
  }
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  flex: 1;
  
  p {
    color: var(--dark-gray);
    margin-bottom: 1.5rem;
  }
`;

const ShopButton = styled.button`
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

const CartItems = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--light-gray);
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
`;

const ItemCategory = styled.p`
  font-size: 0.8rem;
  color: var(--dark-gray);
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
`;

const ItemPrice = styled.p`
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-gray);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  margin: 0 0.5rem;
  font-size: 0.9rem;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--dark-gray);
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
  
  &:hover {
    color: var(--error);
  }
`;

const CartFooter = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--light-gray);
`;

const Subtotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const ViewCartButton = styled.button`
  width: 100%;
  background: none;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--light-gray);
  }
`;

export default CartSidebar;