import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthPage.css';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location.pathname]);

  const handleToggle = () => {
    navigate(isSignUp ? '/signin' : '/signup');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p>{isSignUp ? 'Sign up to get started' : 'Sign in to continue'}</p>
        </div>
        
        <form className="auth-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">
                <FaUser /> Full Name
              </label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your full name"
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope /> Email
            </label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock /> Password
            </label>
            <div className="password-input">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirm-password">
                <FaLock /> Confirm Password
              </label>
              <div className="password-input">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="confirm-password" 
                  placeholder="Confirm your password"
                  required
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}
          
          {!isSignUp && (
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>
          )}
          
          <button type="submit" className="auth-submit">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button className="toggle-form" onClick={handleToggle}>
              {isSignUp ? ' Sign In' : ' Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
