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

const Press = () => {
  return (
    <PageContainer>
      <Title>Press</Title>
      <Content>
        Find our latest press releases, media mentions, and news updates here.
        We are excited to share our story and achievements with the public.
      </Content>
    </PageContainer>
  );
};

export default Press;