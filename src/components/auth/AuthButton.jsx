import React, { useState } from 'react';

import { useAuth } from '../../context/AuthContext';
import AuthModal from './AuthModal';


const AuthButton = ({ mode = 'login', primary = true, text }) => {
  const { user, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Jika user sudah login dan ini bukan tombol reset password, jangan tampilkan apa-apa
  if (isAuthenticated && mode !== 'reset-password') {
    return null;
  }

  // Tentukan teks tombol berdasarkan mode
  const getButtonText = () => {
    if (text) return text;
    
    switch (mode) {
      case 'register':
        return 'Daftar';
      case 'reset-password':
        return 'Lupa Password?';
      default:
        return 'Masuk';
    }
  };

  // Handler untuk membuka modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handler untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handler ketika autentikasi berhasil
  const handleAuthSuccess = (user) => {
    console.log('Autentikasi berhasil:', user);
    // Anda bisa menambahkan logika tambahan di sini jika diperlukan
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2
          ${primary
            ? 'bg-yellow-400 text-white border-none hover:bg-yellow-300'
            : 'bg-transparent text-yellow-400 border border-yellow-400 hover:bg-yellow-50'}
        `}
      >
        {getButtonText()}
      </button>
      
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        mode={mode} 
        onSuccess={handleAuthSuccess} 
      />
    </>
  );
};

export default AuthButton;