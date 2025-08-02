import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 2rem auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-height: 60vh;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.secondary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Content = styled.p`
  line-height: 1.8;
  color: ${props => props.theme.colors.darkGray};
  text-align: justify;
  margin-bottom: 1rem;
`;

const PrivacyPolicy = () => {
  return (
    <PageContainer>
      <Title>Privacy Policy</Title>
      <SectionTitle>Introduction</SectionTitle>
      <Content>
        Your privacy is important to us. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
      </Content>
      <SectionTitle>Information We Collect</SectionTitle>
      <Content>
        We may collect information about you in a variety of ways. The information we may collect on the Site includes personal data, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
      </Content>
      <SectionTitle>Use of Your Information</SectionTitle>
      <Content>
        We use information collected about you via the Site to:
        <ul>
          <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
          <li>Email you regarding your account or order.</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
        </ul>
      </Content>
      <SectionTitle>Security of Your Information</SectionTitle>
      <Content>
        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
      </Content>
      <SectionTitle>Contact Us</SectionTitle>
      <Content>
        If you have questions or comments about this Privacy Policy, please contact us at support@beaulytis.com.
      </Content>
    </PageContainer>
  );
};

export default PrivacyPolicy;