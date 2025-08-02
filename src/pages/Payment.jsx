import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaLock, FaCreditCard, FaPaypal, FaCheck } from 'react-icons/fa';

// Import context
import { useCart } from '../context/CartContext';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCart();
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form states
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  
  // Format price to Rupiah
  const formatToRupiah = (price) => {
    return `Rp ${(price).toLocaleString('id-ID',{ minimumFractionDigits: 0 })}`;
  };
  
  // Handle payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      // Clear cart after successful payment
      clearCart();
      window.scrollTo(0, 0);
    }, 2000);
  };
  
  // Handle order completion
  const handleCompleteOrder = () => {
    navigate('/');
  };
  
  // If payment is complete, show confirmation
  if (isComplete) {
    return (
      <CheckoutContainer>
        <ConfirmationContainer
          as={motion.div}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ConfirmationIcon>
            <FaCheck />
          </ConfirmationIcon>
          <h2>Pembayaran Berhasil!</h2>
          <p>Terima kasih atas pesanan Anda. Kami telah mengirimkan email konfirmasi ke alamat email Anda.</p>
          <OrderNumber>Nomor Pesanan: #{Math.floor(Math.random() * 1000000)}</OrderNumber>
          <CompleteButton onClick={handleCompleteOrder}>
            Kembali ke Beranda
          </CompleteButton>
        </ConfirmationContainer>
      </CheckoutContainer>
    );
  }
  
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <h1>Pembayaran</h1>
        <p>Selesaikan pembayaran Anda</p>
      </CheckoutHeader>
      
      <CheckoutContent>
        <CheckoutMain>
          <PaymentSection>
            <SectionTitle>Metode Pembayaran</SectionTitle>
            <PaymentMethods>
              <PaymentMethodOption 
                isSelected={paymentMethod === 'credit-card'}
                onClick={() => setPaymentMethod('credit-card')}
              >
                <FaCreditCard />
                <span>Kartu Kredit/Debit</span>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                isSelected={paymentMethod === 'paypal'}
                onClick={() => setPaymentMethod('paypal')}
              >
                <FaPaypal />
                <span>PayPal</span>
              </PaymentMethodOption>
              
              <PaymentMethodOption 
                isSelected={paymentMethod === 'bank-transfer'}
                onClick={() => setPaymentMethod('bank-transfer')}
              >
                <span>Transfer Bank</span>
              </PaymentMethodOption>
            </PaymentMethods>
            
            {paymentMethod === 'credit-card' && (
              <Form onSubmit={handlePaymentSubmit}>
                <FormGroup>
                  <FormLabel htmlFor="cardName">Nama pada Kartu</FormLabel>
                  <FormInput
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={handlePaymentChange}
                    placeholder="Nama lengkap pada kartu"
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel htmlFor="cardNumber">Nomor Kartu</FormLabel>
                  <FormInput
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="expiry">Tanggal Kadaluarsa</FormLabel>
                    <FormInput
                      type="text"
                      id="expiry"
                      name="expiry"
                      value={paymentInfo.expiry}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="cvv">CVV</FormLabel>
                    <FormInput
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      required
                    />
                  </FormGroup>
                </FormRow>
                
                <SecurePaymentNote>
                  <FaLock /> Pembayaran aman & terenkripsi
                </SecurePaymentNote>
                
                <SubmitButton 
                  type="submit" 
                  disabled={isProcessing}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? 'Memproses...' : 'Bayar Sekarang'}
                </SubmitButton>
              </Form>
            )}
            
            {paymentMethod === 'paypal' && (
              <PayPalSection>
                <p>Anda akan diarahkan ke PayPal untuk menyelesaikan pembayaran.</p>
                <SubmitButton 
                  onClick={handlePaymentSubmit} 
                  disabled={isProcessing}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? 'Memproses...' : 'Lanjutkan ke PayPal'}
                </SubmitButton>
              </PayPalSection>
            )}
            
            {paymentMethod === 'bank-transfer' && (
              <BankTransferSection>
                <p>Silakan transfer ke rekening bank berikut:</p>
                <BankDetails>
                  <BankDetail>
                    <span>Bank:</span>
                    <strong>Bank Mandiri</strong>
                  </BankDetail>
                  <BankDetail>
                    <span>Nomor Rekening:</span>
                    <strong>1234-5678-9012-3456</strong>
                  </BankDetail>
                  <BankDetail>
                    <span>Atas Nama:</span>
                    <strong>PT Beaulytis Indonesia</strong>
                  </BankDetail>
                </BankDetails>
                <p>Setelah melakukan pembayaran, silakan klik tombol di bawah ini:</p>
                <SubmitButton 
                  onClick={handlePaymentSubmit} 
                  disabled={isProcessing}
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? 'Memproses...' : 'Konfirmasi Pembayaran'}
                </SubmitButton>
              </BankTransferSection>
            )}
          </PaymentSection>
        </CheckoutMain>
        
        <CheckoutSidebar>
          <OrderSummary>
            <SummaryTitle>Ringkasan Pesanan</SummaryTitle>
            
            <SummaryItems>
              {cart.map(item => (
                <SummaryItem key={item.id}>
                  <SummaryItemInfo>
                    <SummaryItemName>{item.name}</SummaryItemName>
                    <SummaryItemQuantity>Qty: {item.quantity}</SummaryItemQuantity>
                  </SummaryItemInfo>
                  <SummaryItemPrice>{formatToRupiah(item.price * item.quantity)}</SummaryItemPrice>
                </SummaryItem>
              ))}
            </SummaryItems>
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>{formatToRupiah(getTotalPrice())}</span>
            </SummaryRow>
            <SummaryRow>
              <span>Pengiriman</span>
              <span>Gratis</span>
            </SummaryRow>
            <SummaryRow>
              <span>Pajak</span>
              <span>{formatToRupiah(getTotalPrice() * 0.1)}</span>
            </SummaryRow>
            
            <SummaryDivider />
            
            <SummaryTotal>
              <span>Total</span>
              <span>{formatToRupiah(getTotalPrice() * 1.1)}</span>
            </SummaryTotal>
          </OrderSummary>
        </CheckoutSidebar>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

// Styled Components
const CheckoutContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const CheckoutHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CheckoutSidebar = styled.div`
  @media (max-width: 992px) {
    order: -1;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
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
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const PaymentSection = styled.section`
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: var(--shadow-sm);
`;

const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PaymentMethodOption = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid ${props => props.isSelected ? 'var(--primary)' : 'var(--light-gray)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.isSelected ? 'var(--primary-light)' : 'white'};
  
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
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const SummaryTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
`;

const SummaryItems = styled.div`
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--light-gray);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SummaryItemInfo = styled.div`
  flex: 1;
`;

const SummaryItemName = styled.p`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SummaryItemQuantity = styled.p`
  font-size: 0.9rem;
  color: var(--dark-gray);
`;

const SummaryItemPrice = styled.p`
  font-weight: 600;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  
  &:last-of-type {
    margin-bottom: 1rem;
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
  font-weight: 700;
  font-size: 1.1rem;
`;

const PayPalSection = styled.div`
  text-align: center;
  padding: 2rem 0;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const BankTransferSection = styled.div`
  padding: 1rem 0;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const BankDetails = styled.div`
  background-color: var(--light-bg);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const BankDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ConfirmationContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 3rem 2rem;
  box-shadow: var(--shadow-md);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  
  h2 {
    font-size: 2rem;
    margin: 1.5rem 0 1rem;
  }
  
  p {
    color: var(--dark-gray);
    margin-bottom: 2rem;
  }
`;

const ConfirmationIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: var(--success);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto;
`;

const OrderNumber = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  background-color: var(--light-bg);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const CompleteButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

export default Payment;