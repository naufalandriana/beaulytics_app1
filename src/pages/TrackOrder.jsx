import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 500px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: var(--primary);
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
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const OrderStatusContainer = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  background-color: var(--background-light);
`;

const StatusHeader = styled.h3`
  color: var(--secondary);
  margin-bottom: 1rem;
`;

const StatusInfo = styled.p`
  line-height: 1.6;
  color: var(--dark-gray);
  margin-bottom: 0.5rem;
`;

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID.');
      setOrderDetails(null);
      return;
    }
    setLoading(true);
    setError('');
    setOrderDetails(null);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (orderId === '12345') {
      setOrderDetails({
        id: '12345',
        status: 'Shipped',
        estimatedDelivery: 'October 25, 2023',
        currentLocation: 'In transit to local facility',
      });
    } else {
      setError('Order not found. Please check the ID and try again.');
    }
    setLoading(false);
  };

  return (
    <PageContainer>
      <Title>Track Your Order</Title>
      <Form onSubmit={handleTrackOrder}>
        <Input 
          type="text" 
          placeholder="Enter your order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Tracking...' : 'Track'} <FaSearch />
        </SubmitButton>
      </Form>
      {error && <p style={{color: 'var(--error)', marginBottom: '1rem'}}>{error}</p>}
      {orderDetails && (
        <OrderStatusContainer>
          <StatusHeader>Order Status for #{orderDetails.id}</StatusHeader>
          <StatusInfo><strong>Status:</strong> {orderDetails.status}</StatusInfo>
          <StatusInfo><strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}</StatusInfo>
          <StatusInfo><strong>Current Location:</strong> {orderDetails.currentLocation}</StatusInfo>
        </OrderStatusContainer>
      )}
    </PageContainer>
  );
};

export default TrackOrder;