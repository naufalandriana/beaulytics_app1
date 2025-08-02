import React, { useState } from 'react';
import styled from 'styled-components';
import { auth } from '../../firebase/config';
import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink,
  fetchSignInMethodsForEmail,
  updatePassword
} from 'firebase/auth';
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

const EmailAuth = ({ onSuccess, isPasswordReset = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Inisialisasi Firestore
  const db = getFirestore();

  // Cek apakah URL saat ini adalah link masuk email
  React.useEffect(() => {
    const checkEmailLink = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Ambil email dari localStorage jika ada
        let email = localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // Jika tidak ada email di localStorage, minta user memasukkan email
          email = window.prompt('Masukkan email Anda untuk konfirmasi');
        }
        
        if (email) {
          setLoading(true);
          try {
            // Coba masuk dengan link email
            const result = await signInWithEmailLink(auth, email, window.location.href);
            // Hapus email dari localStorage
            localStorage.removeItem('emailForSignIn');
            
            // Dapatkan objek User dari result
            const user = result.user;
            
            // Simpan data user untuk ditampilkan
            setUserData({
              uid: user.uid,
              email: user.email
            });
            
            // Simpan data pengguna di Firestore
            try {
              const userDocRef = doc(db, "users", user.uid);
              await setDoc(userDocRef, {
                email: user.email,
                createdAt: new Date(),
                lastLogin: new Date()
              }, { merge: true });
              
              console.log("Data pengguna disimpan/diupdate di Firestore:", user.uid);
            } catch (firestoreErr) {
              console.error("Error menyimpan data pengguna:", firestoreErr);
            }
            
            // Jika ini adalah reset password, tampilkan form password baru
            if (isPasswordReset) {
              setShowPasswordFields(true);
              setMessage('Silakan buat password baru Anda');
            } else {
              // Jika bukan reset password, panggil callback onSuccess
              if (onSuccess) {
                onSuccess(user);
              }
            }
          } catch (err) {
            console.error('Error signing in with email link:', err);
            setError(`Gagal masuk: ${err.message}`);
          } finally {
            setLoading(false);
          }
        }
      }
    };
    
    checkEmailLink();
  }, [onSuccess, isPasswordReset]);

  // Fungsi untuk mengirim link OTP ke email
  const sendEmailLink = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Masukkan alamat email yang valid');
      setLoading(false);
      return;
    }

    try {
      // Cek apakah email sudah terdaftar (untuk kasus login)
      if (!isPasswordReset) {
        const methods = await fetchSignInMethodsForEmail(auth, email);
        // Jika email belum terdaftar dan ini bukan reset password, beri tahu user
        if (methods.length === 0) {
          setMessage('Email belum terdaftar. Akun baru akan dibuat setelah verifikasi.');
        }
      }

      // Konfigurasi untuk link masuk email
      const actionCodeSettings = {
        // URL yang akan dibuka setelah user mengklik link di email
        // Harus domain yang sama dengan yang terdaftar di Firebase Console
        url: window.location.origin + (isPasswordReset ? '/reset-password' : '/login'),
        handleCodeInApp: true,
      };

      // Kirim link masuk ke email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Simpan email di localStorage untuk digunakan nanti
      localStorage.setItem('emailForSignIn', email);
      
      setMessage(`Link verifikasi telah dikirim ke ${email}. Silakan cek kotak masuk atau folder spam Anda.`);
    } catch (err) {
      console.error('Error sending email link:', err);
      setError(`Gagal mengirim link: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mengatur password baru (untuk reset password)
  const setNewPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!password || password.length < 6) {
      setError('Password harus minimal 6 karakter');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      // Dapatkan user saat ini
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Tidak ada user yang terautentikasi');
      }

      // Update password
      await updatePassword(user, password);
      
      // Simpan data user untuk ditampilkan
      setUserData({
        uid: user.uid,
        email: user.email
      });
      
      // Update data pengguna di Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          passwordUpdatedAt: new Date(),
          lastLogin: new Date()
        }, { merge: true });
        
        console.log("Data password pengguna diupdate di Firestore:", user.uid);
      } catch (firestoreErr) {
        console.error("Error menyimpan data password pengguna:", firestoreErr);
      }
      
      setMessage('Password berhasil diperbarui');
      
      // Panggil callback onSuccess
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err) {
      console.error('Error updating password:', err);
      setError(`Gagal memperbarui password: ${err.message}`);
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
          <p>Email: {userData.email}</p>
        </div>
      ) : showPasswordFields ? (
        // Form untuk mengatur password baru
        <>
          <Input
            type="password"
            placeholder="Password baru"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Konfirmasi password baru"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <Button onClick={setNewPassword} disabled={loading}>
            {loading ? 'Memproses...' : 'Simpan Password Baru'}
          </Button>
        </>
      ) : (
        // Form untuk mengirim link OTP ke email
        <>
          <Input
            type="email"
            placeholder="Alamat Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button onClick={sendEmailLink} disabled={loading}>
            {loading ? 'Mengirim...' : isPasswordReset ? 'Kirim Link Reset Password' : 'Kirim Link Verifikasi'}
          </Button>
        </>
      )}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {message && <SuccessMessage>{message}</SuccessMessage>}
    </Container>
  );
};

export default EmailAuth;