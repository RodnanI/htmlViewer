'use client';

import { useAuth } from '../context/AuthProvider';

const LogoutButton = () => {
  const { logout } = useAuth();
  
  return (
    <button
      onClick={logout}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-red-400 
                transition-colors duration-200 ease-in-out 
                hover:bg-gray-200 dark:hover:bg-gray-600"
      aria-label="Logout"
      title="Logout"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
  );
};

export default LogoutButton;