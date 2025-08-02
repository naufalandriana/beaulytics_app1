import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterLogo>Beaulytics</FooterLogo>
          <FooterDescription>
            Your destination for premium skincare products that are scientifically formulated 
            to give you the best results for your skin type and concerns.
          </FooterDescription>
          <SocialIcons>
            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </SocialIcon>
            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </SocialIcon>
            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
              <FaPinterest />
            </SocialIcon>
            <SocialIcon href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </SocialIcon>
          </SocialIcons>
        </FooterSection>
        
        <FooterLinksContainer>
          <FooterLinkSection>
            <FooterLinkTitle>Shop</FooterLinkTitle>
            <FooterLink to="/products?category=cleanser">Cleansers</FooterLink>
            <FooterLink to="/products?category=serum">Serums</FooterLink>
            <FooterLink to="/products?category=moisturizer">Moisturizers</FooterLink>
            <FooterLink to="/products?category=sunscreen">Sunscreens</FooterLink>
            <FooterLink to="/products?category=mask">Masks</FooterLink>
          </FooterLinkSection>
          
          <FooterLinkSection>
            <FooterLinkTitle>About</FooterLinkTitle>
            <FooterLink to="/our-story">Our Story</FooterLink>
            <FooterLink to="/ingredients">Ingredients</FooterLink>
            <FooterLink to="/sustainability">Sustainability</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
            <FooterLink to="/press">Press</FooterLink>
          </FooterLinkSection>
          
          <FooterLinkSection>
            <FooterLinkTitle>Help</FooterLinkTitle>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/shipping-returns">Shipping & Returns</FooterLink>
            <FooterLink to="/contact-us">Contact Us</FooterLink>
            <FooterLink to="/track-order">Track Order</FooterLink>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
          </FooterLinkSection>
        </FooterLinksContainer>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>© {currentYear} Beaulytics. All rights reserved.</Copyright>
        <PaymentMethods>
          <span>Payment Methods:</span>
          <img src="/images/payment-methods.png" alt="Payment methods" />
        </PaymentMethods>
      </FooterBottom>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled.footer`
  background-color: var(--light-gray);
  padding-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0 1rem;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 250px;
`;

const FooterLogo = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 70%;
    height: 4px;
    background-color: var(--primary);
  }
`;

const FooterDescription = styled.p`
  color: var(--dark-gray);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--white);
  color: var(--black);
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
    transform: translateY(-3px);
  }
`;

const FooterLinksContainer = styled.div`
  display: flex;
  flex: 2;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const FooterLinkSection = styled.div`
  min-width: 150px;
`;

const FooterLinkTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FooterLink = styled(Link)`
  display: block;
  color: var(--dark-gray);
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const FooterBottom = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--medium-gray);
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem 1rem;
  }
`;

const Copyright = styled.p`
  color: var(--dark-gray);
  font-size: 0.9rem;
`;

const PaymentMethods = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  span {
    font-size: 0.9rem;
    color: var(--dark-gray);
  }
  
  img {
    height: 24px;
  }
`;

export default Footer;