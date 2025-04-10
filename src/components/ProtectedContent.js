'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import LoginPopup from './LoginPopup';

export default function ProtectedContent({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Prevent any interaction with the page when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const preventClick = (e) => {
        // Don't prevent clicks inside the login popup
        if (e.target.closest('.login-popup') || e.target.closest('form')) return;
        
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // Block all click events
      document.addEventListener('click', preventClick, true);
      document.addEventListener('mousedown', preventClick, true);
      document.addEventListener('mouseup', preventClick, true);
      
      return () => {
        document.removeEventListener('click', preventClick, true);
        document.removeEventListener('mousedown', preventClick, true);
        document.removeEventListener('mouseup', preventClick, true);
      };
    }
  }, [isAuthenticated]);
  
  return (
    <>
      {!isAuthenticated && <LoginPopup />}
      <div className={!isAuthenticated ? 'pointer-events-none select-none filter blur-md transition-all duration-300' : ''}>
        {children}
      </div>
    </>
  );
}