'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';

const LoginPopup = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const { authenticate } = useAuth();
  const inputRef = useRef(null);

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
    if (!isAuthenticated) {
      setError('Incorrect password');
      shake();
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
        className={`bg-white dark:bg-dark-card rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-300 ${
          isShaking ? 'animate-shake' : ''
        }`}
      >
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-blue-50 dark:bg-blue-900/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Password Required</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Please enter the password to access this site
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              ref={inputRef}
              type="password"
              id="password"
              className={`w-full px-3 py-2 border transition-all duration-300 ${
                error ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter password"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
          >
            Access Site
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;