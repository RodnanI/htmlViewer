'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeProvider';

const LoginPopup = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { authenticate } = useAuth();
  const inputRef = useRef(null);
  const { theme } = useTheme();

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter a password');
      shake();
      return;
    }

    const isAuthenticated = authenticate(password);
    if (isAuthenticated) {
      setShowSuccess(true);
      // Success animation will trigger before the actual authentication takes effect
      setTimeout(() => {
        // Authentication is already handled by the authenticate function
      }, 1200);
    } else {
      setError('Incorrect password');
      setShowError(true);
      shake();
      
      // Reset error animation after a delay
      setTimeout(() => {
        setShowError(false);
      }, 1500);
      
      setPassword('');
    }
  };

  const shake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className={`login-popup bg-white dark:bg-dark-card rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-500 ${
          isShaking ? 'animate-shake' : ''
        } ${
          showSuccess ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
        }`}
        style={{
          animation: isShaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : '',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          borderColor: showSuccess ? '#10B981' : showError ? '#EF4444' : '',
          borderWidth: (showSuccess || showError) ? '2px' : '',
          boxShadow: showSuccess 
            ? '0 0 20px rgba(16, 185, 129, 0.7)' 
            : showError 
              ? '0 0 20px rgba(239, 68, 68, 0.7)' 
              : ''
        }}
      >
        <div className="text-center mb-4 relative">
          {/* Success animation overlay */}
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="success-animation">
                <svg 
                  className="checkmark" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 52 52"
                >
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
            </div>
          )}
          
          <div 
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-500 ${
              showSuccess ? 'bg-green-50 dark:bg-green-900/20' :
              showError ? 'bg-red-50 dark:bg-red-900/20' :
              'bg-blue-50 dark:bg-blue-900/20'
            }`}
          >
            {showSuccess ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : showError ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Password Required</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Please enter the password to access this site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-popup">
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              ref={inputRef}
              type="password"
              id="password"
              className={`w-full px-3 py-2 border transition-all duration-300 ${
                showSuccess ? 'border-green-300 dark:border-green-500 bg-green-50 dark:bg-green-900/20' :
                showError ? 'border-red-300 dark:border-red-500 bg-red-50 dark:bg-red-900/20' :
                error ? 'border-red-300 dark:border-red-500' : 
                'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
                if (showError) setShowError(false);
              }}
              placeholder="Enter password"
              disabled={showSuccess}
            />
            {error && (
              <p className={`mt-1 text-sm text-red-600 dark:text-red-400 transition-all duration-300 ${
                showError ? 'animate-pulse font-medium' : ''
              }`}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full btn transition-all duration-300 ${
              showSuccess ? 'btn-success bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' :
              showError ? 'btn-error bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' :
              'btn-primary'
            }`}
            disabled={showSuccess}
          >
            {showSuccess ? 'Accessing...' : 'Access Site'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;