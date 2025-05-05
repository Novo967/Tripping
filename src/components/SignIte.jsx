import React, { useState } from 'react'; // Import React and useState hook
import './SignItem.css'; // Import the external CSS file for styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
 
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
    if (formData.password !== formData.confirmpassword) newErrors.confirmpassword = "passwords does not match."
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
    <div className="signup-container"> {/* Wrapper for the whole form */}
      <h2>Sign Up</h2>
      {submitted ? ( // If form is submitted
        <p className="success-message">Thanks for signing up {formData.name}!</p>
      ) : (
        <form onSubmit={handleSubmit} className="signup-form"> {/* Form element */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              value={formData.name}
              onChange={handleChange}
              className="signup-input"
            />
            {errors.name && <p className="error-message">{errors.name}</p>} {/* Show name error */}
          </div>
          <div>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              className="signup-input"
            />
            {errors.lastname && <p className="error-message">{errors.lastname}</p>} {/* Show name error */}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="signup-input"
            />
            {errors.email && <p className="error-message">{errors.email}</p>} {/* Show email error */}
          </div>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="signup-input"
            />
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye}
              className="toggle-icon" onClick={() => setShowPassword(prev => !prev)}
            />
            {errors.password && <p className="error-message">{errors.password}</p>} {/* Show password error */}
          </div>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              placeholder="confirm Password"
              value={formData.confirmpassword}
              onChange={handleChange}
              className="signup-input"             
            />
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye}
              className="toggle-icon" onClick={() => setShowConfirmPassword(prev => !prev)}
            />
            {errors.confirmpassword && <p className="error-message">{errors.confirmpassword}</p>} {/* Show password error */}
          </div>
          <button type="submit" className="signup-button">Sign Up</button> {/* Submit button */}
          <Link to='/login' className="login-link">
              Allready have an acount? log in!
          </Link>
            
        </form>
      )}
    </div>
  );
};

export default SignUp; // Export component for use in other parts of app
