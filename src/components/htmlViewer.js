'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeProvider';
import PasswordModal from './PasswordModal';

const HtmlViewer = ({ htmlContent, slug }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false); // Initialize as false to disable loading animation
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  
  // Download related states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadStarting, setDownloadStarting] = useState(false);
  
  // Correctly format file name
  const fileName = slug ? `${slug}.html` : 'file.html';

  // Handle client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Main content loading effect
  useEffect(() => {
    if (!iframeRef.current || !htmlContent || !isClient) return;
    
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      const resizeIframe = () => {
        try {
          const viewportHeight = window.innerHeight;
          const navHeight = 120;
          const minHeight = viewportHeight - navHeight;
          
          const contentHeight = Math.max(iframeDoc.body.scrollHeight, minHeight);
          iframe.style.height = `${contentHeight}px`;
        } catch (e) {
          console.error('Error resizing iframe:', e);
          setError('Error resizing content. Try refreshing the page.');
        }
      };
      
      // Apply resize immediately and on load
      iframe.onload = resizeIframe;
      resizeIframe();
      
      window.addEventListener('resize', resizeIframe);
      
      return () => {
        window.removeEventListener('resize', resizeIframe);
      };
    } catch (error) {
      console.error('Error rendering HTML content:', error);
      setError('Error rendering HTML content. Please check if the HTML is valid.');
    }
  }, [htmlContent, isClient]);

  // Handle download with password
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
      
      // Create blob and download
      try {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
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

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
        <p className="font-medium">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="html-viewer-container relative" style={{ width: '100%' }}>
      {/* Download Button */}
      {isClient && (
        <div className="absolute top-4 right-4 z-20">
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
            <div className="absolute top-full right-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded shadow-md">
              {downloadError}
            </div>
          )}
        </div>
      )}
      
      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onPasswordSubmit={handlePasswordSubmit}
        fileName={fileName}
      />
      
      {/* Content iframe with simplified styling */}
      <div className="relative rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
        <iframe 
          ref={iframeRef}
          className="html-content-iframe w-full"
          style={{
            minHeight: '80vh',
            border: 'none',
            overflow: 'auto',
            backgroundColor: 'white',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
          }}
          title="HTML Content"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
      </div>
    </div>
  );
};

export default HtmlViewer;
