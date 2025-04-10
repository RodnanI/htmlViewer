import React, { useState, useEffect } from 'react';
import LoginPopup from './LoginPopup';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user was previously authenticated
  useEffect(() => {
    const auth = localStorage.getItem('authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Prevent any interaction with the page when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const preventNavigation = (e) => {
        e.preventDefault();
        return false;
      };
      
      // Capture all click events at the document level
      document.addEventListener('click', preventNavigation, true);
      
      return () => {
        document.removeEventListener('click', preventNavigation, true);
      };
    }
  }, [isAuthenticated]);
  
  const handleAuthentication = () => {
    setIsAuthenticated(true);
    localStorage.setItem('authenticated', 'true');
  };

  return (
    <div className="app">
      {!isAuthenticated && <LoginPopup onAuthenticate={handleAuthentication} />}
      <div className={`content ${!isAuthenticated ? 'blurred' : ''}`}>
        {/* Your website content here */}
        <h1>Welcome to My Website</h1>
        <p>This content is protected by a password.</p>
        <nav>
          <ul>
            <li><a href="#section1">Section 1</a></li>
            <li><a href="#section2">Section 2</a></li>
            <li><a href="https://example.com">External Link</a></li>
          </ul>
        </nav>
        <div id="section1">
          <h2>Section 1</h2>
          <p>This is some content for section 1.</p>
        </div>
        <div id="section2">
          <h2>Section 2</h2>
          <p>This is some content for section 2.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
