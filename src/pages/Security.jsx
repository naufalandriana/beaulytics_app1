import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaKey, FaShieldAlt, FaBell, FaCheck, FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import { MdDevices } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

// Styled Components
const PageContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  font-size: 1.8rem;
`;

const SecurityContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SecurityOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SecurityStatusCard = styled.div`
  background-color: ${props => props.theme.colors.lightBg || '#f8f9fa'};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 1.5rem;
`;

const SecurityOption = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.lightGray};
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.25rem;
  }
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    font-size: 0.875rem;
    color: ${props => props.theme.colors.darkGray};
  }
`;

const OptionContent = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.lightGray};
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.status === 'secure' ? props.theme.colors.success : props.theme.colors.warning};
  color: white;
`;

const ActivityContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.lightGray};
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h2 {
    font-size: 1.25rem;
    margin: 0;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.darkGray};
    margin: 0.25rem 0 0 0;
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.lightBg || '#f8f9fa'};
  
  &:nth-child(even) {
    background-color: white;
    border: 1px solid ${props => props.theme.colors.lightGray};
  }
`;

const DeviceIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  margin-right: 1rem;
  
  svg {
    font-size: 1.25rem;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0;
    font-size: 0.9rem;
  }
  
  p {
    margin: 0.25rem 0 0 0;
    font-size: 0.8rem;
    color: ${props => props.theme.colors.darkGray};
  }
`;

const ActivityStatus = styled.div`
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => {
    switch(props.status) {
      case 'active': return props.theme.colors.primary;
      case 'success': return props.theme.colors.success;
      case 'failed': return props.theme.colors.error;
      default: return props.theme.colors.lightGray;
    }
  }};
  color: white;
`;

const ViewAllButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.lightBg || '#f8f9fa'};
  }
`;

const Security = () => {
  const { user, isAuthenticated, updateUserPassword } = useAuth();
  const navigate = useNavigate();
  const [expandedOption, setExpandedOption] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Dummy login activity data
  const [loginActivities, setLoginActivities] = useState([
    {
      id: 1,
      device: 'Chrome - Windows',
      ip: '103.xxx.xxx.1',
      location: 'Jakarta, Indonesia',
      date: '2024-01-15 14:30:25',
      status: 'active'
    },
    {
      id: 2,
      device: 'Safari - iPhone',
      ip: '103.xxx.xxx.1',
      location: 'Jakarta, Indonesia',
      date: '2024-01-14 09:15:42',
      status: 'success'
    },
    {
      id: 3,
      device: 'Chrome - Android',
      ip: '114.xxx.xxx.5',
      location: 'Surabaya, Indonesia',
      date: '2024-01-13 22:45:18',
      status: 'failed'
    },
    {
      id: 4,
      device: 'Firefox - Windows',
      ip: '125.xxx.xxx.2',
      location: 'Bandung, Indonesia',
      date: '2024-01-12 16:20:33',
      status: 'success'
    }
  ]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const toggleOption = (option) => {
    if (expandedOption === option) {
      setExpandedOption(null);
    } else {
      setExpandedOption(option);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validasi password
    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password baru harus minimal 8 karakter');
      return;
    }
    
    try {
      await updateUserPassword(currentPassword, newPassword);
      setPasswordSuccess('Password berhasil diperbarui');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(`Gagal memperbarui password: ${error.message}`);
    }
  };
  
  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // Implementasi nyata akan memanggil API untuk mengaktifkan/menonaktifkan 2FA
  };
  
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <PageTitle>Kelola pengaturan keamanan dan privasi akun Anda</PageTitle>
      
      <SecurityContainer>
        <SecurityOptionsContainer>
          <SecurityStatusCard>
            <OptionTitle>
              <StatusIcon status="secure">
                <FaCheck size={12} />
              </StatusIcon>
              <div>
                <h3>Akun Anda Aman</h3>
                <p>Tidak ada aktivitas mencurigakan yang terdeteksi. Terus jaga keamanan akun Anda dengan mengaktifkan 2FA.</p>
              </div>
            </OptionTitle>
          </SecurityStatusCard>
          
          <SecurityOption onClick={() => toggleOption('password')}>
            <OptionHeader>
              <OptionTitle>
                <FaKey />
                <div>
                  <h3>Ubah Password</h3>
                  <p>Perbarui password untuk keamanan yang lebih baik</p>
                </div>
              </OptionTitle>
              <FaChevronDown style={{ transform: expandedOption === 'password' ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </OptionHeader>
            
            {expandedOption === 'password' && (
              <OptionContent
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handlePasswordChange}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="currentPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password Saat Ini</label>
                    <input 
                      type="password" 
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        border: '1px solid #ddd',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="newPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password Baru</label>
                    <input 
                      type="password" 
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        border: '1px solid #ddd',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Konfirmasi Password Baru</label>
                    <input 
                      type="password" 
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        border: '1px solid #ddd',
                        fontSize: '0.875rem'
                      }}
                      required
                    />
                  </div>
                  
                  {passwordError && <p style={{ color: 'red', fontSize: '0.875rem', marginBottom: '1rem' }}>{passwordError}</p>}
                  {passwordSuccess && <p style={{ color: 'green', fontSize: '0.875rem', marginBottom: '1rem' }}>{passwordSuccess}</p>}
                  
                  <button 
                    type="submit"
                    style={{ 
                      backgroundColor: '#4CAF50', 
                      color: 'white', 
                      padding: '0.75rem 1rem', 
                      borderRadius: '8px', 
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    Perbarui Password
                  </button>
                </form>
              </OptionContent>
            )}
          </SecurityOption>
          
          <SecurityOption onClick={() => toggleOption('2fa')}>
            <OptionHeader>
              <OptionTitle>
                <FaShieldAlt />
                <div>
                  <h3>Two-Factor Authentication (2FA)</h3>
                  <p>Lapisan keamanan tambahan untuk akun Anda</p>
                </div>
              </OptionTitle>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: twoFactorEnabled ? 'green' : 'gray' }}>
                  {twoFactorEnabled ? 'Aktif' : 'Nonaktif'}
                </span>
                <FaChevronDown style={{ transform: expandedOption === '2fa' ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
              </div>
            </OptionHeader>
            
            {expandedOption === '2fa' && (
              <OptionContent
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Two-Factor Authentication menambahkan lapisan keamanan ekstra pada akun Anda dengan meminta kode verifikasi selain password saat login.
                </p>
                
                <button 
                  onClick={toggleTwoFactor}
                  style={{ 
                    backgroundColor: twoFactorEnabled ? '#f44336' : '#4CAF50', 
                    color: 'white', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}
                >
                  {twoFactorEnabled ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA'}
                </button>
              </OptionContent>
            )}
          </SecurityOption>
          
          <SecurityOption onClick={() => toggleOption('notifications')}>
            <OptionHeader>
              <OptionTitle>
                <FaBell />
                <div>
                  <h3>Notifikasi Keamanan</h3>
                  <p>Atur pemberitahuan aktivitas akun</p>
                </div>
              </OptionTitle>
              <FaChevronDown style={{ transform: expandedOption === 'notifications' ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </OptionHeader>
            
            {expandedOption === 'notifications' && (
              <OptionContent
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0', fontSize: '0.875rem' }}>Login Baru</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>Dapatkan notifikasi saat ada login baru ke akun Anda</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0', fontSize: '0.875rem' }}>Perubahan Password</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>Dapatkan notifikasi saat password Anda diubah</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0', fontSize: '0.875rem' }}>Aktivitas Mencurigakan</h4>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#666' }}>Dapatkan notifikasi saat ada aktivitas mencurigakan terdeteksi</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </OptionContent>
            )}
          </SecurityOption>
        </SecurityOptionsContainer>
        
        <ActivityContainer>
          <ActivityHeader>
            <div>
              <h2>Aktivitas Login Terbaru</h2>
              <p>Pantau aktivitas masuk ke akun Anda</p>
            </div>
          </ActivityHeader>
          
          <ActivityList>
            {loginActivities.map(activity => (
              <ActivityItem key={activity.id}>
                <DeviceIcon>
                  <MdDevices />
                </DeviceIcon>
                
                <ActivityInfo>
                  <h4>{activity.device}</h4>
                  <p>{activity.ip}</p>
                  <p>{activity.location}</p>
                  <p>{activity.date}</p>
                </ActivityInfo>
                
                <ActivityStatus status={activity.status}>
                  {activity.status === 'active' ? 'Sesi Aktif' : 
                   activity.status === 'success' ? 'Berhasil' : 'Gagal'}
                </ActivityStatus>
              </ActivityItem>
            ))}
          </ActivityList>
          
          <ViewAllButton>Lihat Semua Aktivitas</ViewAllButton>
        </ActivityContainer>
      </SecurityContainer>
      
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #4CAF50;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #4CAF50;
        }
        
        input:checked + .slider:before {
          transform: translateX(16px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </PageContainer>
  );
};

export default Security;