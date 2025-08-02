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
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Content = styled.p`
  line-height: 1.8;
  color: ${props => props.theme.colors.darkGray};
  text-align: justify;
`;

const OurStory = () => {
  return (
    <PageContainer>
      <Title>Our Story</Title>
      <Content>
        Welcome to the Our Story page. Here, we share our journey, mission, and the values that drive us.
        Our commitment is to provide the best products and services to our customers.
        Learn more about how we started and what we aim to achieve.
      </Content>
    </PageContainer>
  );
};

export default OurStory;