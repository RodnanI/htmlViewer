'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeProvider';

const HtmlViewer = ({ htmlContent }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  // We're not injecting theme styles to keep original HTML content appearance
  const preserveOriginalStyles = () => {
    // This is intentionally empty as we want to preserve the original HTML content styling
  };

  useEffect(() => {
    if (!iframeRef.current || !htmlContent) return;
    
    try {
      setLoading(true);
      
      // Get the iframe document
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Write the complete HTML content to the iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Not injecting theme styles to preserve original content
      
      // Adjust iframe height based on content
      const resizeIframe = () => {
        try {
          const viewportHeight = window.innerHeight;
          const navHeight = 120; // Approximate height of navigation and header
          const minHeight = viewportHeight - navHeight;
          
          // Get content height, but use at least the viewport height
          const contentHeight = Math.max(iframeDoc.body.scrollHeight, minHeight);
          iframe.style.height = `${contentHeight}px`;
        } catch (e) {
          console.error('Error resizing iframe:', e);
          setError('Error resizing content. Try refreshing the page.');
        }
      };
      
      // Resize initially and on window resize
      iframe.onload = () => {
        resizeIframe();
        setLoading(false);
      };
      
      window.addEventListener('resize', resizeIframe);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', resizeIframe);
      };
    } catch (error) {
      console.error('Error rendering HTML content:', error);
      setError('Error rendering HTML content. Please check if the HTML is valid.');
      setLoading(false);
    }
  }, [htmlContent]);
  
  // We're not updating theme in iframe when it changes to preserve original content
  // This effect has been removed intentionally

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
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
      )}
      <iframe 
        ref={iframeRef}
        className="html-content-iframe rounded-lg border border-light-border dark:border-dark-border"
        style={{
          width: '100%',
          minHeight: '80vh',
          border: 'none',
          overflow: 'auto',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          backgroundColor: 'white' // Always keep iframe background white regardless of theme
        }}
        title="HTML Content"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default HtmlViewer;