import React, { useState } from 'react';
import './LoginPopup.css';

const LoginPopup = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'csicsi') {
      onAuthenticate();
      setError('');
    } else {
      setError('Incorrect password');
    }
  };
  
  return (
    <div className="login-popup-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="login-popup">
        <h2>Password Required</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
