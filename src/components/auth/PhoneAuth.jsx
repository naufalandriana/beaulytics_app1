import React, { useState } from 'react';
import styled from 'styled-components';
import { auth } from '../../firebase/config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.lightGray};
  font-size: 1rem;
  width: 100%;
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.lightGray};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error || 'red'};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SuccessMessage = styled.p`
  color: ${props => props.theme.colors.success || 'green'};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const PhoneAuth = ({ onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Inisialisasi Firestore
  const db = getFirestore();
  
  // Fungsi untuk menginisialisasi reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          setMessage('reCAPTCHA terverifikasi');
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          setError('reCAPTCHA kedaluwarsa. Silakan coba lagi.');
        }
      });
    }
  };

  // Fungsi untuk mengirim OTP
  const sendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Masukkan nomor telepon yang valid');
      setLoading(false);
      return;
    }

    try {
      setupRecaptcha();
      
      // Format nomor telepon dengan kode negara jika belum ada
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+62${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;
      
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      
      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      setMessage('Kode OTP telah dikirim ke nomor telepon Anda');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(`Gagal mengirim OTP: ${err.message}`);
      // Reset reCAPTCHA jika terjadi kesalahan
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk memverifikasi OTP
  const verifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!verificationCode || verificationCode.length !== 6) {
      setError('Masukkan kode OTP 6 digit');
      setLoading(false);
      return;
    }

    try {
      // Verifikasi OTP dan dapatkan userCredential
      const userCredential = await window.confirmationResult.confirm(verificationCode);
      
      // Dapatkan objek User dari userCredential
      const user = userCredential.user;
      
      // Simpan data user untuk ditampilkan
      setUserData({
        uid: user.uid,
        phoneNumber: user.phoneNumber
      });
      
      // Simpan data pengguna di Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          phoneNumber: user.phoneNumber,
          createdAt: new Date(),
          lastLogin: new Date()
        }, { merge: true });
        
        console.log("Data pengguna disimpan/diupdate di Firestore:", user.uid);
      } catch (firestoreErr) {
        console.error("Error menyimpan data pengguna:", firestoreErr);
      }
      
      setMessage('Verifikasi berhasil!');
      
      // Panggil callback onSuccess dengan data user
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(`Verifikasi gagal: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {userData ? (
        // Tampilkan informasi user setelah berhasil login
        <div>
          <SuccessMessage>Login berhasil!</SuccessMessage>
          <p>User ID (UID): {userData.uid}</p>
          <p>Nomor Telepon: {userData.phoneNumber}</p>
        </div>
      ) : !verificationId ? (
        // Step 1: Input nomor telepon dan kirim OTP
        <>
          <Input
            type="tel"
            placeholder="Nomor Telepon (contoh: 08123456789)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          <div id="recaptcha-container"></div>
          <Button onClick={sendOTP} disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
          </Button>
        </>
      ) : (
        // Step 2: Input kode OTP dan verifikasi
        <>
          <Input
            type="text"
            placeholder="Masukkan kode OTP 6 digit"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={6}
            disabled={loading}
          />
          <Button onClick={verifyOTP} disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Verifikasi OTP'}
          </Button>
          <Button 
            onClick={() => setVerificationId('')} 
            style={{ backgroundColor: 'transparent', color: '#333', border: '1px solid #ccc' }}
          >
            Kembali
          </Button>
        </>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {message && <SuccessMessage>{message}</SuccessMessage>}
    </Container>
  );
};

export default PhoneAuth;