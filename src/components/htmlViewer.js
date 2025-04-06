'use client';

import { useEffect, useRef, useState } from 'react';

const HtmlViewer = ({ htmlContent }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      // Adjust iframe height based on content
      const resizeIframe = () => {
        try {
          const height = iframeDoc.body.scrollHeight;
          iframe.style.height = `${height + 30}px`; // Add some padding
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

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <p className="font-medium">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="html-viewer-container" style={{ width: '100%' }}>
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <iframe 
        ref={iframeRef}
        className="html-content-iframe"
        style={{
          width: '100%',
          minHeight: '500px',
          border: 'none',
          overflow: 'auto',
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
        title="HTML Content"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default HtmlViewer;