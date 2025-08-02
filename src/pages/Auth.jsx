import React from 'react';
import styled from 'styled-components';
import AuthOTP from '../components/auth/AuthOTP';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background};
`;

const Auth = () => {
  return (
    <PageContainer>
      <AuthOTP />
    </PageContainer>
  );
};

export default Auth;