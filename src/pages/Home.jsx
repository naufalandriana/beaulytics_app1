import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowRight, FaStar } from 'react-icons/fa';

// Import Supabase client
import { productService } from '../lib/supabaseClient';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use Supabase service
        const products = await productService.getFeaturedProducts();
        setFeaturedProducts(products);

      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError(err.message);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const categoryImages = {
    cleanser: '/assets/images/page/home/category/cleanser.jpg',
    serum: '/assets/images/page/home/category/serum.jpg',
    moisturizer: '/assets/images/page/home/category/moisturizer.jpg',
    sunscreen: '/assets/images/page/home/category/sunscreen.jpg',
  };

  return (
    <HomeContainer>
      {/* Hero Section */}
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HeroContent>
            <HeroTitle>Discover Your Perfect Skincare Routine</HeroTitle>
            <HeroSubtitle>Science-backed formulations for radiant, healthy skin</HeroSubtitle>
            <ButtonGroup>
              <PrimaryButton as={Link} to="/products">
                Shop Now <FaArrowRight style={{ marginLeft: '8px' }} />
              </PrimaryButton>
              <SecondaryButton as={Link} to="/compare">
                Compare Products
              </SecondaryButton>
            </ButtonGroup>
          </HeroContent>
        </motion.div>
        <HeroImageContainer>
          <motion.img 
            src="/assets/images/page/home/section-hero.jpg" 
            alt="Skincare" 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </HeroImageContainer>
      </HeroSection>

      {/* Featured Products Section */}
      <SectionTitle>Featured Products</SectionTitle>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading featured products...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <h3>Failed to load products</h3>
          <p>Error: {error}</p>
          <RetryButton onClick={() => window.location.reload()}>
            Try Again
          </RetryButton>
        </ErrorContainer>
      ) : featuredProducts.length === 0 ? (
        <NoProductsMessage>
          <h3>No featured products available</h3>
          <p>Check back later for featured products.</p>
        </NoProductsMessage>
      ) : (
        <ProductGrid>
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              as={motion.div}
              whileHover={{ y: -10, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.3 }}
            >
              <ProductImageContainer>
                <ProductImage 
                  src={product.image || `../src/assets/images/products/placeholder.jpg`} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = `../src/assets/images/products/placeholder.jpg`;
                  }}
                />
              </ProductImageContainer>
              <ProductInfo>
                <ProductCategory>{product.category}</ProductCategory>
                <ProductName>{product.name}</ProductName>
                <ProductRating>
                  <FaStar color="#FFEB3B" />
                  <span>{product.rating || 4.5} ({product.reviews || 0} reviews)</span>
                </ProductRating>
                <ProductPrice>
                  Rp {(product.price || 0).toLocaleString('id-ID', { minimumFractionDigits: 0 })}
                </ProductPrice>
                <ProductActions>
                  <AddToCartButton>Add to Cart</AddToCartButton>
                  <CompareButton>Compare</CompareButton>
                </ProductActions>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}

      {/* Compare Tool Promo */}
      <ComparePromoSection>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ComparePromoContent>
            <SectionTitle style={{ color: 'white', textAlign: 'center' }}>Find Your Perfect Match</SectionTitle>
            <ComparePromoText>
              Compare up to 3 products side by side to find the perfect skincare solution for your needs.
              Analyze ingredients, benefits, and reviews to make informed decisions.
            </ComparePromoText>
            <PrimaryButton as={Link} to="/compare" style={{ alignSelf: 'flex-start' }}>
              Try Compare Tool
            </PrimaryButton>
          </ComparePromoContent>
        </motion.div>
      </ComparePromoSection>

      {/* Categories Section */}
      <SectionTitle>Shop by Category</SectionTitle>
      <CategoryGrid>
        {['cleanser', 'serum', 'moisturizer', 'sunscreen'].map((category) => (
          <CategoryCard 
            key={category}
            as={motion.div}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${categoryImages[category]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '12px',
              color: '#fff',
              padding: '20px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CategoryName>{category.charAt(0).toUpperCase() + category.slice(1)}</CategoryName>
            <CategoryLink as={Link} to={`/products?category=${category}`} style={{ color: '#fff', textDecoration: 'underline' }}>
              Shop Now <FaArrowRight style={{ marginLeft: '8px' }} />
            </CategoryLink>
          </CategoryCard>
        ))}
      </CategoryGrid>

      {/* Newsletter Section */}
      <NewsletterSection>
        <NewsletterContent>
          <SectionTitle>Join Our Newsletter</SectionTitle>
          <NewsletterText>
            Subscribe to get special offers, free giveaways, and skincare tips.
          </NewsletterText>
          <NewsletterForm>
            <NewsletterInput type="email" placeholder="Your email address" />
            <SubscribeButton>Subscribe</SubscribeButton>
          </NewsletterForm>
        </NewsletterContent>
      </NewsletterSection>
    </HomeContainer>
  );
};

// Styled Components
const HomeContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  min-height: 80vh;
  padding: 2rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    min-height: auto;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  padding-right: 2rem;
  
  @media (max-width: 768px) {
    padding-right: 0;
    margin-bottom: 2rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: var(--dark-gray);
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PrimaryButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: 2px solid var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary);
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: var(--shadow-lg);
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 3rem 0 1.5rem;
  text-align: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 4px;
    background-color: var(--primary);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--light-gray);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: var(--light-gray);
  border-radius: 10px;
  margin: 2rem 0;
  
  h3 {
    color: var(--error);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--dark-gray);
    margin-bottom: 1.5rem;
  }
`;

const RetryButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const NoProductsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--light-gray);
  border-radius: 10px;
  margin: 2rem 0;
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-gray);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
`;

const ProductImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${ProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductCategory = styled.span`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--dark-gray);
  letter-spacing: 1px;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0.5rem 0;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  span {
    font-size: 0.875rem;
    color: var(--dark-gray);
  }
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const AddToCartButton = styled.button`
  flex: 2;
  background-color: var(--primary);
  color: var(--black);
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #FFD600;
  }
`;

const CompareButton = styled.button`
  flex: 1;
  background-color: var(--light-gray);
  color: var(--black);
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--medium-gray);
  }
`;

const ComparePromoSection = styled.section`
  display: flex;
  align-items: center;
  background-color: var(--black);
  border-radius: 10px;
  overflow: hidden;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ComparePromoContent = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const ComparePromoText = styled.p`
  color: var(--light-gray);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
`;

const CategoryCard = styled.div`
  position: relative;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--light-gray);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
`;

const CategoryName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const CategoryLink = styled.a`
  display: flex;
  align-items: center;
  color: var(--black);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const NewsletterSection = styled.section`
  background-color: var(--secondary);
  border-radius: 10px;
  padding: 3rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const NewsletterContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const NewsletterText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 50px;
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: var(--primary);
  }
`;

const SubscribeButton = styled.button`
  background-color: var(--black);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--dark-gray);
    transform: translateY(-3px);
  }
`;

export default Home;