// LogIn.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 300px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  padding-right: 40px;
  margin: 8px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
  &:hover {
    background-color: #45a049;
  }
`;

const Error = styled.p`
  color: red;
  font-size: 12px;
  margin: 0;
`;

const Success = styled.p`
  color: green;
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const ToggleIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #888;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
`;

const LogingIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "email is required.";
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
      const response = await fetch('https://reactwebsite-2.onrender.com/signin', {
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
      navigate('/');
    } catch (err) {
      console.error('Fetch error:', err);
      setErrors({ form: 'Failed to connect to server.' });
    }
  };

  return (
    <Container>
      <h2>Log In</h2>
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
        </Form>
      )}
    </Container>
  );
};

export default LogingIn;
