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

const Content = styled.p`
  line-height: 1.8;
  color: var(--dark-gray);
  text-align: justify;
`;

const Sustainability = () => {
  return (
    <PageContainer>
      <Title>Sustainability</Title>
      <Content>
        Learn about our commitment to sustainability. We strive to make a positive impact on the environment and our community through responsible practices.
        Our efforts include ethical sourcing, eco-friendly packaging, and reducing our carbon footprint.
      </Content>
    </PageContainer>
  );
};

export default Sustainability;