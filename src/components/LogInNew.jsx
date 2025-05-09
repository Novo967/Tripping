import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Container = styled.div`
  width: 100%;
  max-width: 420px;
  margin: 150px auto;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Title = styled.h2`
  color: #4C46B1;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
  letter-spacing: -0.5px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid #eaeaea;
  background-color: #ffffff;
  font-size: 15px;
  color: #1a1a1a;
  box-sizing: border-box;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #007AFF;
    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color:rgb(26, 44, 61);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background-color: #0066CC;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Error = styled.p`
  color: #FF3B30;
  font-size: 13px;
  margin: 4px 0 0 4px;
  font-weight: 500;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ToggleIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.2s ease;

  &:hover {
    color: #666;
  }
`;

const Success = styled.p`
  color: #34C759;
  font-size: 16px;
  margin-top: 20px;
  font-weight: 500;
`;

const HeroContainer = styled.section`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1);
    object-fit: cover;
    filter: none;
    z-index: -2;
  }
`;
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to top, black 0%, transparent 50%);
  z-index: -1;
`;
const LinkToSignIn = styled(Link)`
  text-align: center;
  margin-top: 12px;
  color: #6C63FF;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const LogingIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUsername } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.email.includes('@')) newErrors.email = "Invalid email.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === 'User not found') {
          setErrors({ email: 'Email not found.' });
        } else if (data.error === 'Invalid password') {
          setErrors({ password: 'Incorrect password.' });
        } else {
          setErrors({ form: data.error || 'Something went wrong.' });
        }
        return;
      }

      setSubmitted(true);
      localStorage.setItem('name', data.name);
      localStorage.setItem('userEmail', data.email);
      setFormData({ email: '', password: '' });
      setTimeout(() => {
        navigate('/');
      }, 0);
      setUsername(data.name);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrors({ form: 'Failed to connect to server.' });
    }
  };

  return (
    <HeroContainer>
      <video src="/videos/video-5.mp4" autoPlay loop muted />
      <Overlay />
      <BottomGradient />
    <Container>
      <Title>Log In</Title>
      {submitted ? (
        <Success>Thanks for logging in {formData.name}!</Success>
      ) : (
        <Form onSubmit={handleSubmit}>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <Error>{errors.email}</Error>}
          </div>
          <PasswordWrapper>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <ToggleIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(prev => !prev)}
            />
            {errors.password && <Error>{errors.password}</Error>}
          </PasswordWrapper>
          {errors.form && <Error>{errors.form}</Error>}
          <Button type="submit">Log in</Button>
          <LinkToSignIn to="/sign-up">Doesn't have an account? Sign up</LinkToSignIn>
        </Form>
      )}
    </Container>
    </HeroContainer>
  );
};

export default LogingIn;