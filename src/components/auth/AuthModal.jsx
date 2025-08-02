import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import PhoneAuth from './PhoneAuth';
import EmailAuth from './EmailAuth';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.theme.colors.darkGray};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  border: none;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.darkGray};
  border-bottom: 2px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const AuthModal = ({ isOpen, onClose, mode = 'login', onSuccess }) => {
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' atau 'email'
  
  // Judul modal berdasarkan mode
  const getTitle = () => {
    switch (mode) {
      case 'register':
        return 'Daftar Akun';
      case 'reset-password':
        return 'Reset Password';
      default:
        return 'Masuk ke Akun';
    }
  };

  // Handler ketika autentikasi berhasil
  const handleAuthSuccess = (user) => {
    if (onSuccess) {
      onSuccess(user);
    }
    onClose();
  };

  // Animasi untuk modal
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={overlayVariants}
      onClick={onClose}
    >
      <ModalContent
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>×</CloseButton>
        
        <Title>{getTitle()}</Title>
        
        {/* Tab untuk memilih metode autentikasi */}
        {mode !== 'reset-password' && (
          <TabContainer>
            <Tab 
              active={authMethod === 'phone'} 
              onClick={() => setAuthMethod('phone')}
            >
              Via Nomor HP
            </Tab>
            <Tab 
              active={authMethod === 'email'} 
              onClick={() => setAuthMethod('email')}
            >
              Via Email
            </Tab>
          </TabContainer>
        )}
        
        {/* Komponen autentikasi berdasarkan metode yang dipilih */}
        {mode === 'reset-password' || authMethod === 'email' ? (
          <EmailAuth 
            onSuccess={handleAuthSuccess} 
            isPasswordReset={mode === 'reset-password'} 
          />
        ) : (
          <PhoneAuth onSuccess={handleAuthSuccess} />
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal;