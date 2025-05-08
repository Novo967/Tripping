import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "First name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Last name is required.";
    if (!formData.email.includes('@')) newErrors.email = "Invalid email.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmpassword) newErrors.confirmpassword = "Passwords do not match.";
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
      const response = await fetch(`${SERVER_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: data.error });
        } else {
          setErrors({ form: data.error || 'Something went wrong.' });
        }
        return;
      }

      setSubmitted(true);
      localStorage.setItem('name', data.name);
      localStorage.setItem('userEmail', data.email);
      navigate('/');
      setFormData({ name: '', lastname: '', email: '', password: '', confirmpassword: '' });
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
      <Card>
        <Title>Create an Account</Title>
        {submitted ? (
          <SuccessMessage>Thanks for signing up {formData.name}!</SuccessMessage>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div>
              <Input
                type="text"
                name="name"
                placeholder="First Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
            </div>
            <div>
              <Input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={formData.lastname}
                onChange={handleChange}
              />
              {errors.lastname && <ErrorMessage>{errors.lastname}</ErrorMessage>}
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </div>
            <PasswordWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(prev => !prev)}
                style={toggleIcon}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </PasswordWrapper>
            <PasswordWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                onClick={() => setShowConfirmPassword(prev => !prev)}
                style={toggleIcon}
              />
              {errors.confirmpassword && <ErrorMessage>{errors.confirmpassword}</ErrorMessage>}
            </PasswordWrapper>
            {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
            <SubmitButton type="submit">Sign Up</SubmitButton>
            <LinkToLogin to="/login">Already have an account? Log in</LinkToLogin>
          </Form>
        )}
      </Card>
      </HeroContainer>
  );
};

export default SignUp;

// Styled-components
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

const Card = styled.div`
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  margin: 150px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
   &:hover {
    transform: translateY(-2px);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #4C46B1;
  margin-bottom: 24px;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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

const PasswordWrapper = styled.div`
  position: relative;
`;

const toggleIcon = {
  position: 'absolute',
  top: '50%',
  right: '14px',
  transform: 'translateY(-50%)',
  color: '#999',
  cursor: 'pointer',
  fontSize: '18px',
};

const SubmitButton = styled.button`
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

const LinkToLogin = styled(Link)`
  text-align: center;
  margin-top: 12px;
  color: #6C63FF;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin: 4px 0 0 4px;
`;

const SuccessMessage = styled.p`
  color: green;
  text-align: center;
  font-weight: bold;
`;
