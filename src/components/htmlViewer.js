'use client';

import { useEffect, useRef, useState } from 'react';

const HtmlViewer = ({ htmlContent, slug }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
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

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
        <p className="font-medium">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="html-viewer-container" style={{ width: '100%' }}>
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
