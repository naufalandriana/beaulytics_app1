import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import AuthButton from './AuthButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  }
  
  span {
    padding: 0 1rem;
    color: ${props => props.theme.colors.darkGray};
    font-size: 0.875rem;
  }
`;

const UserInfo = styled.div`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const UserName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 0.5rem;
`;

const UserPhone = styled.p`
  color: ${props => props.theme.colors.darkGray};
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background-color: transparent;
  color: ${props => props.theme.colors.error || 'red'};
  font-weight: 600;
  border: 1px solid ${props => props.theme.colors.error || 'red'};
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.error || 'red'};
    color: white;
  }
`;

const AuthOTP = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Title>{isAuthenticated ? 'Profil Anda' : 'Autentikasi'}</Title>
      
      {isAuthenticated ? (
        // Tampilkan informasi user jika sudah login
        <>
          <UserInfo>
            <UserName>{user.displayName || 'Pengguna'}</UserName>
            {user.email && <UserEmail>Email: {user.email}</UserEmail>}
            {user.phoneNumber && <UserPhone>Telepon: {user.phoneNumber}</UserPhone>}
          </UserInfo>
          
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </>
      ) : (
        // Tampilkan opsi login/register jika belum login
        <>
          <ButtonGroup>
            <AuthButton mode="login" primary={true} text="Masuk" />
            <AuthButton mode="register" primary={false} text="Daftar" />
          </ButtonGroup>
          
          <Divider>
            <span>atau</span>
          </Divider>
          
          <AuthButton mode="reset-password" primary={false} text="Lupa Password?" />
        </>
      )}
    </Container>
  );
};

export default AuthOTP;