# Beaulytis - Aplikasi E-commerce Kecantikan

## Fitur Autentikasi OTP dengan Firebase

Aplikasi ini menggunakan Firebase Authentication untuk implementasi autentikasi OTP melalui nomor telepon dan email.

### Konfigurasi Firebase

Sebelum menggunakan fitur autentikasi, pastikan Anda telah mengatur Firebase project dan menambahkan konfigurasi yang diperlukan:

1. Buat project di [Firebase Console](https://console.firebase.google.com/)
2. Aktifkan Authentication dan pilih metode sign-in:
   - Email/Password
   - Phone Number
   - Google (opsional)
3. Aktifkan Firestore Database untuk menyimpan data pengguna
4. Salin konfigurasi Firebase ke file `.env` dengan format berikut:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Fitur Autentikasi

1. **Login/Register dengan OTP via Nomor HP**
   - Pengguna memasukkan nomor HP
   - Verifikasi reCAPTCHA
   - Menerima kode OTP via SMS
   - Verifikasi kode OTP

2. **Login/Register dengan OTP via Email**
   - Pengguna memasukkan alamat email
   - Menerima link verifikasi via email
   - Klik link untuk verifikasi

3. **Reset Password via Email**
   - Pengguna memilih opsi "Lupa Password"
   - Memasukkan alamat email
   - Menerima link reset password
   - Mengatur password baru setelah verifikasi

### Penggunaan Komponen

#### AuthButton

Komponen ini menampilkan tombol untuk login, register, atau reset password dan membuka modal autentikasi.

```jsx
// Contoh penggunaan
import AuthButton from './components/auth/AuthButton';

// Tombol Login
<AuthButton mode="login" primary={true} text="Masuk" />

// Tombol Register
<AuthButton mode="register" primary={false} text="Daftar" />

// Tombol Reset Password
<AuthButton mode="reset-password" primary={false} text="Lupa Password?" />
```

#### AuthOTP

Komponen ini menampilkan halaman autentikasi lengkap dengan opsi login, register, dan reset password.

```jsx
// Contoh penggunaan
import AuthOTP from './components/auth/AuthOTP';

<AuthOTP />
```

### Mengakses User yang Terautentikasi

Gunakan hook `useAuth` untuk mengakses informasi user dan fungsi autentikasi:

```jsx
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (isAuthenticated) {
    return (
      <div>
        <p>Selamat datang, {user.displayName || 'Pengguna'}!</p>
        <p>User ID: {user.uid}</p>
        {user.email && <p>Email: {user.email}</p>}
        {user.phoneNumber && <p>Nomor Telepon: {user.phoneNumber}</p>}
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
  
  return <p>Silakan login untuk melanjutkan</p>;
}
```

### Integrasi dengan Firestore

Aplikasi ini secara otomatis menyimpan data pengguna di Firestore setelah autentikasi berhasil. Data disimpan dalam koleksi `users` dengan ID dokumen sama dengan `user.uid`.

#### Menyimpan Data Pengguna di Firestore

```jsx
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { auth } from './firebase/config';

// Inisialisasi Firestore
const db = getFirestore();

// Setelah autentikasi berhasil (misalnya dalam fungsi verifyOTP)
try {
  const userCredential = await confirmationResult.confirm(otpCode);
  const user = userCredential.user;
  
  // Simpan data pengguna di Firestore
  const userDocRef = doc(db, "users", user.uid);
  await setDoc(userDocRef, {
    phoneNumber: user.phoneNumber,
    email: user.email,
    createdAt: new Date(),
    lastLogin: new Date()
  }, { merge: true }); // merge: true agar tidak menimpa data yang sudah ada
  
  console.log("Data pengguna disimpan di Firestore:", user.uid);
} catch (error) {
  console.error("Error:", error);
}
```

#### Mengakses Data Pengguna dari Firestore

```jsx
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const db = getFirestore();
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    
    fetchUserData();
  }, [user]);
  
  if (!user) return <p>Silakan login terlebih dahulu</p>;
  
  return (
    <div>
      <h2>Profil Pengguna</h2>
      {userData && (
        <div>
          <p>Nomor Telepon: {userData.phoneNumber}</p>
          <p>Email: {userData.email}</p>
          <p>Bergabung pada: {userData.createdAt?.toDate().toLocaleDateString()}</p>
          <p>Login terakhir: {userData.lastLogin?.toDate().toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
```

## Menjalankan Aplikasi

1. Install dependencies:
   ```
   npm install
   ```

2. Jalankan server development:
   ```
   npm run dev
   ```

3. Buka aplikasi di browser:
   ```
   http://localhost:5173
   ```

## Catatan Penting

- Untuk autentikasi nomor telepon, pastikan Anda telah mengaktifkan Phone Authentication di Firebase Console.
- Untuk pengujian, Firebase menyediakan nomor telepon pengujian yang dapat digunakan.
- Pastikan domain aplikasi Anda terdaftar di Firebase Console untuk autentikasi email link.
- Jangan lupa untuk menambahkan file `.env` ke `.gitignore` untuk menjaga keamanan konfigurasi Firebase Anda.
- Pastikan Anda telah mengatur aturan keamanan Firestore yang sesuai untuk melindungi data pengguna.
