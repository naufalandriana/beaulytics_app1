import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes, FaSignOutAlt, FaShieldAlt } from 'react-icons/fa';
import { MdCompare } from 'react-icons/md';

// Import contexts
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use context hooks
  const { getTotalItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { compareList } = useCompare();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setIsSearchOpen(false);
      setSearchTerm('');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };
  
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <LogoContainer>
          <Link to="/">
            <Logo>Beaulytics.</Logo>
          </Link>
        </LogoContainer>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        
        <NavContainer $isOpen={isMenuOpen}>
          <NavLinks>
            <NavItem $isActive={location.pathname === '/'}>
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
            </NavItem>
            <NavItem $isActive={location.pathname === '/products'}>
              <Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
            </NavItem>
            <NavItem $isActive={location.pathname === '/compare'}>
              <Link to="/compare" onClick={() => setIsMenuOpen(false)}>Compare</Link>
            </NavItem>
          </NavLinks>
          
          <NavIcons>
            <IconButton onClick={toggleSearch} data-label="Search">
              <FaSearch />
            </IconButton>
            {isAuthenticated ? (
              <>
                <IconButton as={Link} to="/profile" onClick={() => setIsMenuOpen(false)} data-label="My Profile">
                  <FaUser />
                </IconButton>
                <IconButton as={Link} to="/security" onClick={() => setIsMenuOpen(false)} data-label="Security">
                  <FaShieldAlt />
                </IconButton>
                <IconButton as={Link} to="/orders" onClick={() => setIsMenuOpen(false)} data-label="My Orders">
                  <FaUser />
                </IconButton>
                <IconButton onClick={handleLogout} data-label="Logout">
                  <FaSignOutAlt />
                </IconButton>
              </>
            ) : (
              <IconButton as={Link} to="/login" onClick={() => setIsMenuOpen(false)} data-label="Login">
                <FaUser />
              </IconButton>
            )}
            {/* <IconButton as={Link} to="/compare" onClick={() => setIsMenuOpen(false)} data-label="Compare">
              <MdCompare />
              {compareList.length > 0 && <IconBadge>{compareList.length}</IconBadge>}
            </IconButton> */}
            <IconButton onClick={() => { toggleCart(); setIsMenuOpen(false); }} data-label="Cart">
              <FaShoppingCart />
              {getTotalItems() > 0 && <IconBadge>{getTotalItems()}</IconBadge>}
            </IconButton>
          </NavIcons>
        </NavContainer>
      </HeaderWrapper>
      
      <AnimatePresence>
        {isSearchOpen && (
          <SearchContainer
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            as="form"
            onSubmit={handleSearch}
          >
            <SearchInput 
              placeholder="Search for products..."
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
            <CloseButton type="button" onClick={toggleSearch}>
              <FaTimes />
            </CloseButton>
          </SearchContainer>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};

// Styled Components
const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  
  @media (max-width: 768px) {
    position: relative;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LogoContainer = styled.div`
  z-index: 1001;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--black);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: var(--primary);
    transform: scaleX(0.7);
    transform-origin: left;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  color: var(--black);
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ onClick }) => onClick ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 998;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    flex-direction: column;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    border-top: 1px solid var(--light-gray);
    transform: ${({ $isOpen }) => $isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${({ $isOpen }) => $isOpen ? '1' : '0'};
    visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
    z-index: 999;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-right: 0;
    width: 100%;
    margin-bottom: 0;
    padding: 1rem 0;
  }
`;

const NavItem = styled.li`
  margin: 0 1rem;
  position: relative;
  
  a {
    color: var(--black);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0;
    position: relative;
    display: block;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary);
      transform: scaleX(${({ $isActive }) => $isActive ? 1 : 0});
      transition: transform 0.3s ease;
    }
    
    &:hover:after {
      transform: scaleX(1);
    }
  }
  
  @media (max-width: 768px) {
    margin: 0;
    width: 100%;
    
    a {
      display: block;
      padding: 1rem 2rem;
      border-bottom: 1px solid var(--light-gray);
      font-size: 1.1rem;
      
      &:after {
        display: none;
      }
      
      &:hover {
        background-color: var(--light-gray);
      }
    }
  }
`;

const NavIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    padding: 0 0 1rem 0;
    gap: 0;
    border-top: 1px solid var(--light-gray);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  color: var(--black);
  transition: color 0.3s ease;
  border-radius: 50%;
  
  &:hover {
    color: var(--primary);
    background-color: var(--light-gray);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    font-size: 1rem;
    padding: 1rem 2rem;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--light-gray);
    
    &:last-child {
      border-bottom: none;
    }
    
    &:after {
      content: attr(data-label);
      font-size: 1rem;
      font-weight: 500;
    }
    
    &:hover {
      background-color: var(--light-gray);
      border-radius: 0;
    }
  }
`;

const IconBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--primary);
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: static;
    margin-left: auto;
    width: 24px;
    height: 24px;
    font-size: 0.8rem;
  }
`;

// User dropdown menu styles
const UserMenu = styled.div`
  position: relative;
  
  &:hover > div:last-child {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s ease;
  z-index: 10;
  margin-top: 0.5rem;
  
  @media (max-width: 768px) {
    position: static;
    width: 100%;
    opacity: 1;
    visibility: visible;
    transform: none;
    margin-top: 1rem;
    box-shadow: none;
    border: 1px solid var(--light-gray);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  
  strong {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  small {
    color: var(--dark-gray);
    font-size: 0.8rem;
  }
`;

const DropdownDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--light-gray);
  margin: 0.5rem 0;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  text-align: left;
  padding: 0.75rem;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--black);
  
  &:hover {
    background-color: var(--light-gray);
  }
  
  svg {
    color: var(--dark-gray);
  }
`;

const SearchContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem;
  background-color: var(--light-gray);
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  padding: 0.5rem;
  font-size: 1rem;
  outline: none;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--black);
  
  &:hover {
    color: var(--primary);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--black);
  margin-left: 0.5rem;
  
  &:hover {
    color: var(--primary);
  }
`;

export default Header;
