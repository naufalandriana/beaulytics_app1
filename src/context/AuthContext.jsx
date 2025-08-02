import { createContext, useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { auth } from '../firebase/config';
import {
  onAuthStateChanged,
  signOut,
  updateProfile,
  updatePassword,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Google Client ID dari environment variable
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  // Inisialisasi Firestore
  const db = getFirestore();
  
  // State untuk user, loading, dan error
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk menyimpan data pengguna di Firestore
  const saveUserToFirestore = async (currentUser) => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      
      // Data dasar yang akan disimpan
      const userData = {
        lastLogin: new Date(),
      };
      
      // Tambahkan data lain jika tersedia
      if (currentUser.email) userData.email = currentUser.email;
      if (currentUser.phoneNumber) userData.phoneNumber = currentUser.phoneNumber;
      if (currentUser.displayName) userData.displayName = currentUser.displayName;
      if (currentUser.photoURL) userData.photoURL = currentUser.photoURL;
      
      await setDoc(userDocRef, userData, { merge: true });
      console.log("Data pengguna berhasil disimpan di Firestore:", currentUser.uid);
    } catch (err) {
      console.error("Error menyimpan data pengguna di Firestore:", err);
    }
  };

  // Listener untuk perubahan status autentikasi
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Simpan data pengguna di Firestore jika login
      if (currentUser) {
        saveUserToFirestore(currentUser);
      }
      
      setIsLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  // Fungsi untuk login dengan Google via access token
  const loginWithGoogle = async (tokenResponse) => {
    setIsLoading(true);
    setError(null);
    try {
      const accessToken = tokenResponse.access_token;
      if (!accessToken) {
        throw new Error('No access token returned from Google auth');
      }
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const profile = await res.json();
      const userObj = {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        provider: 'google'
      };
      setUser(userObj);
      return userObj;
    } catch (err) {
      setError('Google login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(`Logout failed: ${err.message}`);
      throw err;
    }
  };

  // Fungsi untuk update profil user
  const updateUserProfile = async (displayName, photoURL) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
      
      // Update local user state
      setUser({ ...auth.currentUser });
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  // Fungsi untuk update email
  const updateUserEmail = async (newEmail, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      
      // Re-authenticate user before changing email
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      
      // Update local user state
      setUser({ ...auth.currentUser });
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to update email: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  // Fungsi untuk update password
  const updateUserPassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user');
      }
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      setIsLoading(false);
    } catch (err) {
      setError(`Failed to update password: ${err.message}`);
      setIsLoading(false);
      throw err;
    }
  };

  // Context value
  const value = {
    user,
    isLoading,
    error,
    loginWithGoogle,
    logout,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    isAuthenticated: !!user,
    saveUserToFirestore // Tambahkan fungsi ini ke context value
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthContext.Provider value={value}>
        {children}
        
        {/* Error notification */}
        {error && (
          <motion.div 
            className="auth-error"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              backgroundColor: 'var(--error)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              zIndex: 1000,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {error}
          </motion.div>
        )}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default AuthContext;