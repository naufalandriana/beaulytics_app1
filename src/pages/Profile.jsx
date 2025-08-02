import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Edit3, Lock, Shield, Bell, Check, LogOut, X, Eye, EyeOff, Smartphone, MapPin, CreditCard, Package, Heart, Star, Settings, ChevronRight } from 'lucide-react';


const EcommerceProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const { user, logout } = useAuth();
const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logout();
    navigate('/login');
  } catch (err) {
    console.error('Logout failed', err);
  }
};
  const [userData, setUserData] = useState({ // initial static data
  name: user?.name || '',
  email: user?.email || '',
  phone: '0812-3456-7890',
  address: 'Jl. Sudirman No. 123, Jakarta Selatan',
  bio: 'Fashion enthusiast dan beauty lover. Suka belanja produk skincare dan fashion terkini.',
  birthDate: '1995-08-15',
  gender: 'Perempuan'
});

  
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const [editData, setEditData] = useState(userData);

  const getInitials = (name) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase();
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'orders', label: 'Pesanan', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Keamanan', icon: Shield },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
  ];

  const recentOrders = [
    { id: '001', status: 'Dikirim', total: 'Rp 450.000', date: '20 Jul 2025', items: 3 },
    { id: '002', status: 'Selesai', total: 'Rp 280.000', date: '15 Jul 2025', items: 2 },
    { id: '003', status: 'Dibatalkan', total: 'Rp 150.000', date: '10 Jul 2025', items: 1 },
  ];

  const wishlistItems = [
    { id: 1, name: 'Serum Vitamin C Premium', price: 'Rp 250.000', rating: 4.8, image: '/api/placeholder/80/80' },
    { id: 2, name: 'Moisturizer Anti-Aging', price: 'Rp 180.000', rating: 4.6, image: '/api/placeholder/80/80' },
    { id: 3, name: 'Sunscreen SPF 50+', price: 'Rp 120.000', rating: 4.9, image: '/api/placeholder/80/80' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold">{getInitials(userData.name)}</span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{userData.name}</h1>
                  <p className="text-white/80 mb-4">{userData.email}</p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-lg font-bold">23</div>
                      <div className="text-xs text-white/80">Pesanan</div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-lg font-bold">8</div>
                      <div className="text-xs text-white/80">Wishlist</div>
                    </div>
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-lg font-bold">4.8</div>
                      <div className="text-xs text-white/80">Rating</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-yellow-300/40 backdrop-blur-sm border border-white/30 hover:border-yellow-300/50 rounded-xl px-6 py-3 flex items-center gap-2 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Batal' : 'Edit Profil'}
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Informasi Pribadi</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                      <input
                        type="date"
                        value={editData.birthDate}
                        onChange={(e) => setEditData({...editData, birthDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                      <textarea
                        value={editData.address}
                        onChange={(e) => setEditData({...editData, address: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={editData.bio}
                        onChange={(e) => setEditData({...editData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-200/50 transition-all flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Simpan
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-yellow-100 hover:text-yellow-700 transition-all flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Batal
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Nama Lengkap</label>
                        <div className="text-gray-800 font-medium">{userData.name}</div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Email</label>
                        <div className="text-gray-800">{userData.email}</div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Nomor Telepon</label>
                        <div className="text-gray-800">{userData.phone}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Tanggal Lahir</label>
                        <div className="text-gray-800">{new Date(userData.birthDate).toLocaleDateString('id-ID')}</div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Jenis Kelamin</label>
                        <div className="text-gray-800">{userData.gender}</div>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Alamat</label>
                        <div className="text-gray-800">{userData.address}</div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-500 mb-1 block">Bio</label>
                        <div className="text-gray-800">{userData.bio}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Pesanan Terbaru</h2>
              
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">Order #{order.id}</div>
                          <div className="text-sm text-gray-500">{order.date} • {order.items} item</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-gray-800">{order.total}</div>
                          <div className={`text-sm px-3 py-1 rounded-full ${
                            order.status === 'Dikirim' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl transition-all">
                Lihat Semua Pesanan
              </button>
            </div>
          </div>
        );

      case 'wishlist':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Produk Favorit</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                        <Heart className="w-12 h-12 text-pink-400" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-yellow-600">{item.price}</span>
                      <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-yellow-200/50 transition-all">
                        Beli
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Keamanan Akun</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Ubah Password</div>
                        <div className="text-sm text-gray-500">Terakhir diubah 30 hari yang lalu</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Verifikasi 2 Langkah</div>
                        <div className="text-sm text-green-600">Aktif</div>
                      </div>
                    </div>
                    <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-yellow-600" />
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-semibold text-gray-800">Aktivitas Login</div>
                        <div className="text-sm text-gray-500">Pantau aktivitas masuk akun</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Pengaturan Notifikasi</h2>
              
              <div className="space-y-4">
                {[
                  { title: 'Email Promosi', desc: 'Dapatkan info promo dan diskon terbaru', enabled: true },
                  { title: 'Update Pesanan', desc: 'Notifikasi status pengiriman', enabled: true },
                  { title: 'Produk Baru', desc: 'Info produk terbaru sesuai minat', enabled: false },
                  { title: 'Ulasan Produk', desc: 'Pengingat untuk memberikan ulasan', enabled: true },
                ].map((notif, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-800">{notif.title}</div>
                      <div className="text-sm text-gray-500">{notif.desc}</div>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${notif.enabled ? 'bg-yellow-500' : 'bg-gray-300'} relative cursor-pointer transition-all`}>
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${notif.enabled ? 'left-6' : 'left-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Mobile Header */}
        <div className="md:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
              {getInitials(userData.name)}
            </div>
            <div>
              <div className="font-semibold text-gray-800">{userData.name}</div>
              <div className="text-sm text-gray-500">{userData.email}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="hidden md:block mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">
                    {getInitials(userData.name)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{userData.name}</div>
                    <div className="text-sm text-gray-500">Premium Member</div>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold shadow-lg'
                          : 'text-gray-600 hover:bg-yellow-50 hover:text-yellow-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceProfile;
