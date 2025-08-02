import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

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
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--dark-gray);
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: var(--primary);
    outline: none;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid var(--medium-gray);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: var(--primary);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary);
  color: var(--black);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const SuccessMessage = styled.p`
  color: var(--success);
  text-align: center;
  margin-top: 1rem;
  font-weight: 500;
`;

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to a backend)
    setSubmitted(true);
  };

  return (
    <PageContainer>
      <Title>Contact Us</Title>
      {submitted ? (
        <SuccessMessage>Thank you for your message! We'll get back to you soon.</SuccessMessage>
      ) : (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" name="email" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="subject">Subject</Label>
            <Input type="text" id="subject" name="subject" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required />
          </FormGroup>
          <SubmitButton type="submit">
            Send Message <FaPaperPlane />
          </SubmitButton>
        </Form>
      )}
    </PageContainer>
  );
};

export default ContactUs;