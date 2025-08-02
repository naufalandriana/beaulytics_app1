import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaArrowLeft, FaCheck } from 'react-icons/fa';

// Import context (to be used later)
// import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  // Will use this when context is fully implemented
  // const { cart, getTotalPrice, clearCart } = useCart();
  
  // For demo purposes
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Indonesia'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  
  // Load cart from localStorage for demo
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Format price to Rupiah
  const formatToRupiah = (price) => {
    return `Rp ${(price).toLocaleString('id-ID',{ minimumFractionDigits: 0 })}`;
  };
  
  // Handle shipping form input changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle shipping form submission
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Redirect to payment page
    navigate('/payment');
  };
  
  // Handle order completion
  const handleCompleteOrder = () => {
    navigate('/');
  };
  
  // Render shipping form
  const renderShippingForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SectionTitle>Shipping Information</SectionTitle>
      <Form onSubmit={handleShippingSubmit}>
        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <FormInput
              type="text"
              id="firstName"
              name="firstName"
              value={shippingInfo.firstName}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <FormInput
              type="text"
              id="lastName"
              name="lastName"
              value={shippingInfo.lastName}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <FormInput
              type="tel"
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormGroup>
          <FormLabel htmlFor="address">Address</FormLabel>
          <FormInput
            type="text"
            id="address"
            name="address"
            value={shippingInfo.address}
            onChange={handleShippingChange}
            required
          />
        </FormGroup>
        
        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="city">City</FormLabel>
            <FormInput
              type="text"
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="state">State</FormLabel>
            <FormInput
              type="text"
              id="state"
              name="state"
              value={shippingInfo.state}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
        </FormRow>
        
        <FormRow>
          <FormGroup>
            <FormLabel htmlFor="zipCode">Zip Code</FormLabel>
            <FormInput
              type="text"
              id="zipCode"
              name="zipCode"
              value={shippingInfo.zipCode}
              onChange={handleShippingChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="country">Country</FormLabel>
            <FormSelect
              id="country"
              name="country"
              value={shippingInfo.country}
              onChange={handleShippingChange}
              required
            >
              <option value="United States">Indonesia</option>
              <option value="Canada">Malaysia</option>
              <option value="United Kingdom">Singapure</option>
              <option value="Australia">Australia</option>
            </FormSelect>
          </FormGroup>
        </FormRow>
        
        <SubmitButton type="submit">
          Continue to Payment
        </SubmitButton>
      </Form>
    </motion.div>
  );
  
  // Render payment form
  const renderPaymentForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <SectionTitle>Payment Method</SectionTitle>
      
      <PaymentMethods>
        <PaymentMethodOption 
          isSelected={paymentMethod === 'credit-card'}
          onClick={() => setPaymentMethod('credit-card')}
        >
          <FaCreditCard />
          <span>Credit Card</span>
        </PaymentMethodOption>
        
        <PaymentMethodOption 
          isSelected={paymentMethod === 'paypal'}
          onClick={() => setPaymentMethod('paypal')}
        >
          <FaPaypal />
          <span>PayPal</span>
        </PaymentMethodOption>
      </PaymentMethods>
      
      {paymentMethod === 'credit-card' && (
        <Form onSubmit={handlePaymentSubmit}>
          <FormGroup>
            <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
            <FormInput
              type="text"
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={handlePaymentChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="cardName">Name on Card</FormLabel>
            <FormInput
              type="text"
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={paymentInfo.cardName}
              onChange={handlePaymentChange}
              required
            />
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <FormLabel htmlFor="expiry">Expiry Date</FormLabel>
              <FormInput
                type="text"
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={paymentInfo.expiry}
                onChange={handlePaymentChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="cvv">CVV</FormLabel>
              <FormInput
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={handlePaymentChange}
                required
              />
            </FormGroup>
          </FormRow>
          
          <SecurePaymentNote>
            <FaLock /> Your payment information is secure and encrypted
          </SecurePaymentNote>
          
          <SubmitButton type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Complete Payment'}
          </SubmitButton>
          
          <BackButton type="button" onClick={() => setStep(1)}>
            <FaArrowLeft /> Back to Shipping
          </BackButton>
        </Form>
      )}
      
      {paymentMethod === 'paypal' && (
        <PaypalSection>
          <p>You will be redirected to PayPal to complete your payment.</p>
          <SubmitButton onClick={handlePaymentSubmit} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Continue to PayPal'}
          </SubmitButton>
          
          <BackButton type="button" onClick={() => setStep(1)}>
            <FaArrowLeft /> Back to Shipping
          </BackButton>
        </PaypalSection>
      )}
    </motion.div>
  );
  
  // Render confirmation
  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ConfirmationContainer>
        <ConfirmationIcon>
          <FaCheck />
        </ConfirmationIcon>
        <ConfirmationTitle>Order Confirmed!</ConfirmationTitle>
        <ConfirmationMessage>
          Thank you for your purchase. Your order has been received and is being processed.
        </ConfirmationMessage>
        <OrderDetails>
          <OrderDetailItem>
            <span>Order Number:</span>
            <strong>#{Math.floor(100000 + Math.random() * 900000)}</strong>
          </OrderDetailItem>
          <OrderDetailItem>
            <span>Shipping Address:</span>
            <strong>
              {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
            </strong>
          </OrderDetailItem>
          <OrderDetailItem>
            <span>Payment Method:</span>
            <strong>
              {paymentMethod === 'credit-card' ? 'Credit Card' : 'PayPal'}
            </strong>
          </OrderDetailItem>
        </OrderDetails>
        <SubmitButton onClick={handleCompleteOrder}>
          Continue Shopping
        </SubmitButton>
      </ConfirmationContainer>
    </motion.div>
  );
  
  return (
    <CheckoutContainer>
      <CheckoutContent>
        <CheckoutSteps>
          <CheckoutStep isActive={step === 1} isCompleted={step > 1}>
            <StepNumber>{step > 1 ? <FaCheck /> : 1}</StepNumber>
            <StepLabel>Shipping</StepLabel>
          </CheckoutStep>
          <StepConnector isActive={step > 1} />
          <CheckoutStep isActive={step === 2} isCompleted={step > 2}>
            <StepNumber>{step > 2 ? <FaCheck /> : 2}</StepNumber>
            <StepLabel>Payment</StepLabel>
          </CheckoutStep>
          <StepConnector isActive={step > 2} />
          <CheckoutStep isActive={step === 3}>
            <StepNumber>3</StepNumber>
            <StepLabel>Confirmation</StepLabel>
          </CheckoutStep>
        </CheckoutSteps>
        
        {step === 1 && renderShippingForm()}
        {step === 2 && renderPaymentForm()}
        {step === 3 && renderConfirmation()}
      </CheckoutContent>
      
      <OrderSummary>
        <SummaryTitle>Order Summary</SummaryTitle>
        
        {cart.length === 0 ? (
          <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
        ) : (
          <>
            <SummaryItems>
              {cart.map(item => (
                <SummaryItem key={item.id}>
                  <SummaryItemImage src={item.image || `/images/products/placeholder.jpg`} alt={item.name} />
                  <SummaryItemInfo>
                    <SummaryItemName>{item.name}</SummaryItemName>
                    <SummaryItemQuantity>Qty: {item.quantity}</SummaryItemQuantity>
                  </SummaryItemInfo>
                  <SummaryItemPrice>{formatToRupiah(item.price * item.quantity)}</SummaryItemPrice>
                </SummaryItem>
              ))}
            </SummaryItems>
            
            <SummaryDivider />
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>{formatToRupiah(getTotalPrice())}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Shipping</span>
              <span>Free</span>
            </SummaryRow>
            <SummaryRow>
              <span>Tax</span>
              <span>{formatToRupiah(getTotalPrice() * 0.1)}</span>
            </SummaryRow>
            
            <SummaryDivider />
            
            <SummaryTotal>
              <span>Total</span>
              <span>{formatToRupiah(getTotalPrice() * 1.1)}</span>
            </SummaryTotal>
          </>
        )}
      </OrderSummary>
    </CheckoutContainer>
  );
};

// Styled Components
const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutContent = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  padding: 2rem;
`;

const CheckoutSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const CheckoutStep = styled.div`
  display: flex;
  align-items: center;
  opacity: ${props => props.isActive || props.isCompleted ? 1 : 0.5};
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? 'var(--primary)' : props.isCompleted ? 'var(--success)' : 'var(--medium-gray)'};
  color: ${props => props.isCompleted ? 'white' : 'var(--black)'};
  font-weight: 600;
  margin-right: 0.5rem;
`;

const StepLabel = styled.span`
  font-weight: 500;
`;

const StepConnector = styled.div`
  flex: 1;
  height: 2px;
  background-color: ${props => props.isActive ? 'var(--primary)' : 'var(--medium-gray)'};
  margin: 0 1rem;
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 235, 59, 0.2);
    outline: none;
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(255, 235, 59, 0.2);
    outline: none;
  }
`;

const SubmitButton = styled.button`
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
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--dark-gray);
  font-weight: 500;
  padding: 0.75rem 0;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--black);
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PaymentMethodOption = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid ${props => props.isSelected ? 'var(--primary)' : 'var(--medium-gray)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isSelected ? 'rgba(255, 235, 59, 0.1)' : 'white'};
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.isSelected ? 'var(--black)' : 'var(--dark-gray)'};
  }
  
  span {
    font-weight: ${props => props.isSelected ? '600' : '500'};
  }
  
  &:hover {
    border-color: var(--primary);
  }
`;

const SecurePaymentNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--dark-gray);
  margin-top: -0.5rem;
  
  svg {
    color: var(--success);
  }
`;

const PaypalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  p {
    color: var(--dark-gray);
  }
`;

const OrderSummary = styled.div`
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

const EmptyCartMessage = styled.p`
  text-align: center;
  color: var(--dark-gray);
  padding: 2rem 0;
`;

const SummaryItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
`;

const SummaryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SummaryItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
`;

const SummaryItemInfo = styled.div`
  flex: 1;
`;

const SummaryItemName = styled.p`
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const SummaryItemQuantity = styled.p`
  font-size: 0.8rem;
  color: var(--dark-gray);
`;

const SummaryItemPrice = styled.p`
  font-weight: 600;
`;

const SummaryDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--light-gray);
  margin: 1rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
`;

const ConfirmationIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--success);
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const ConfirmationTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ConfirmationMessage = styled.p`
  color: var(--dark-gray);
  margin-bottom: 2rem;
  max-width: 500px;
`;

const OrderDetails = styled.div`
  background-color: var(--light-gray);
  border-radius: 10px;
  padding: 1.5rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const OrderDetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  span {
    color: var(--dark-gray);
  }
`;

export default Checkout;