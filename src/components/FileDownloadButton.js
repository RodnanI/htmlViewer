'use client';

import { useState } from 'react';
import PasswordModal from './PasswordModal';

const FileDownloadButton = ({ filePath, fileName }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadStarting, setDownloadStarting] = useState(false);

  const handleDownload = () => {
    setIsPasswordModalOpen(true);
    setDownloadError(null);
  };

  const handlePasswordSubmit = (password) => {
    // Check password
    if (password === 'rodnan') {
      // Password is correct, start download
      setDownloadStarting(true);
      setIsPasswordModalOpen(false);
      
      // Trigger download using file path
      try {
        // Create anchor and trigger download
        const a = document.createElement('a');
        a.href = filePath; // This is already the public URL
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          setDownloadStarting(false);
        }, 100);
      } catch (err) {
        console.error('Download failed:', err);
        setDownloadError('Failed to download file. Please try again.');
        setDownloadStarting(false);
      }
    } else {
      // Incorrect password
      setDownloadError('Incorrect password. Please try again.');
      setTimeout(() => setDownloadError(null), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleDownload}
        disabled={downloadStarting}
        className="btn btn-primary flex items-center space-x-1"
        aria-label="Download HTML file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>{downloadStarting ? 'Downloading...' : 'Download'}</span>
      </button>
      
      {downloadError && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded shadow-md z-10">
          {downloadError}
        </div>
      )}
      
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordSubmit={handlePasswordSubmit}
        fileName={fileName}
      />
    </div>
  );
};

export default FileDownloadButton;
