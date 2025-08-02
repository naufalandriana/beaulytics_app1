import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 60vh;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: var(--secondary);
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Content = styled.p`
  line-height: 1.8;
  color: var(--dark-gray);
  text-align: justify;
  margin-bottom: 1rem;
`;

const ShippingReturns = () => {
  return (
    <PageContainer>
      <Title>Shipping & Returns</Title>
      
      <SectionTitle>Shipping Policy</SectionTitle>
      <Content>
        We offer standard shipping on all orders. Orders are typically processed within 1-2 business days.
        Shipping times vary depending on your location, but most orders arrive within 5-7 business days.
        You will receive a shipping confirmation email with a tracking number once your order has shipped.
      </Content>

      <SectionTitle>Return Policy</SectionTitle>
      <Content>
        We want you to be completely satisfied with your purchase. If you are not happy with your order, you can return it within 30 days of receipt for a full refund or exchange.
        Products must be returned in their original condition and packaging.
        To initiate a return, please contact our customer service team through the Contact Us page.
      </Content>
      <Content>
        Please note that some items, such as sale items or personalized products, may not be eligible for return. Check the product description for specific return information.
      </Content>
    </PageContainer>
  );
};

export default ShippingReturns;