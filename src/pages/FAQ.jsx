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

const Question = styled.h3`
  color: var(--secondary);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Answer = styled.p`
  line-height: 1.8;
  color: var(--dark-gray);
  text-align: justify;
  margin-bottom: 1rem;
`;

const FAQ = () => {
  return (
    <PageContainer>
      <Title>Frequently Asked Questions</Title>
      
      <Question>What is your return policy?</Question>
      <Answer>
        Our return policy allows you to return products within 30 days of purchase. Please visit our Shipping & Returns page for more details.
      </Answer>

      <Question>How can I track my order?</Question>
      <Answer>
        You can track your order using the tracking link provided in your shipping confirmation email or by visiting the Track Order page on our website.
      </Answer>

      <Question>Do you ship internationally?</Question>
      <Answer>
        Currently, we only ship within [Your Country/Region]. We are working on expanding our shipping options in the future.
      </Answer>

      <Question>How can I contact customer support?</Question>
      <Answer>
        You can contact our customer support team through the Contact Us page, or by emailing us at support@example.com.
      </Answer>
    </PageContainer>
  );
};

export default FAQ;