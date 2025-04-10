'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Check if we're on the client side
  const isClient = typeof window !== 'undefined';
  
  // Initialize auth state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!isClient) return false; // Default for SSR
    
    // Check localStorage for authentication status
    const auth = localStorage.getItem('authenticated');
    return auth === 'true';
  });
  
  const authenticate = (password) => {
    if (password === 'csicsi') {
      setIsAuthenticated(true);
      if (isClient) {
        localStorage.setItem('authenticated', 'true');
      }
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    if (isClient) {
      localStorage.removeItem('authenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Check if we're on the client side
  const isClient = typeof window !== 'undefined';
  
  // Initialize auth state from localStorage if available
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!isClient) return false; // Default for SSR
    
    // Check localStorage for authentication status
    const auth = localStorage.getItem('authenticated');
    return auth === 'true';
  });
  
  const authenticate = (password) => {
    if (password === 'csicsi') {
      setIsAuthenticated(true);
      if (isClient) {
        localStorage.setItem('authenticated', 'true');
      }
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    if (isClient) {
      localStorage.removeItem('authenticated');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}