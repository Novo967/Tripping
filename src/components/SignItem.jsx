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
    <SignUpContainer>
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
    </SignUpContainer>
  );
};

export default SignUp;

// Styled-components
const SignUpContainer = styled.div`
  min-height: 100vh;
  background: #f0f2f5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
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
  padding: 12px 16px;
  padding-right: 40px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
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
  padding: 12px;
  background-color: #6C63FF;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #574fd6;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
