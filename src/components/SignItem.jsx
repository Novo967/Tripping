import React, { useState } from 'react'; // Import React and useState hook
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; // Import styled-components

// Main SignUp component
const SignUp = () => {
  // Define form data state for name, email, and password
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  // State for form validation errors
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  // State to show success message after submission
  const [submitted, setSubmitted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Handle input field changes
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev, // keep existing values
      [e.target.name]: e.target.value // update the field that changed
    }));
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.lastname.trim()) newErrors.lastname = "Last Name is required.";
    if (!formData.email.includes('@')) newErrors.email = "Invalid email.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmpassword) newErrors.confirmpassword = "Passwords do not match."
    return newErrors; // return any found validation issues
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetch('https://reactwebsite-2.onrender.com/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
  
      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: data.error }); // Email already exists
        } else {
          setErrors({ form: data.error || 'Something went wrong.' });
        }
        return;
      }
  
      // If all good
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

  // JSX output
  return (
    <SignUpContainer>
      <h2>Sign Up</h2>
      {submitted ? ( // If form is submitted
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
          <SubmitButton type="submit">Sign Up</SubmitButton>
          <LinkToLogin to='/login'>
            Already have an account? Log in!
          </LinkToLogin>
        </Form>
      )}
    </SignUpContainer>
  );
};

// Styled-components
const SignUpContainer = styled.div`
  width: 300px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
`;

const SuccessMessage = styled.p`
  color: green;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin: 0;
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

const PasswordWrapper = styled.div`
  position: relative;
`;

const toggleIcon = {
  position: 'absolute',
  top: '50%',
  right: '10px',
  transform: 'translateY(-50%)',
  color: '#888',
  cursor: 'pointer',
  fontSize: '18px',
};

const SubmitButton = styled.button`
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

const LinkToLogin = styled(Link)`
  text-decoration: none;
  color: #4CAF50;
  text-align: center;
  margin-top: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export default SignUp;
