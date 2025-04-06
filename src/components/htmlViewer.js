'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeProvider';

const HtmlViewer = ({ htmlContent }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();

  const preserveOriginalStyles = () => {
  };

  useEffect(() => {
    if (!iframeRef.current || !htmlContent) return;
    
    try {
      setLoading(true);
      
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
      
      iframe.onload = () => {
        resizeIframe();
        setLoading(false);
      };
      
      window.addEventListener('resize', resizeIframe);
      
      return () => {
        window.removeEventListener('resize', resizeIframe);
      };
    } catch (error) {
      console.error('Error rendering HTML content:', error);
      setError('Error rendering HTML content. Please check if the HTML is valid.');
      setLoading(false);
    }
  }, [htmlContent]);

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
          backgroundColor: 'white' 
        }}
        title="HTML Content"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default HtmlViewer;