'use client';

import { useEffect, useRef } from 'react';

const HtmlViewer = ({ htmlContent }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current || !htmlContent) return;
    
    try {
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
          iframe.style.height = `${height + 20}px`; // Add some padding
        } catch (e) {
          console.error('Error resizing iframe:', e);
        }
      };
      
      // Resize initially and on window resize
      iframe.onload = resizeIframe;
      window.addEventListener('resize', resizeIframe);
      
      // Clean up
      return () => {
        window.removeEventListener('resize', resizeIframe);
      };
    } catch (error) {
      console.error('Error rendering HTML content:', error);
    }
  }, [htmlContent]);

  return (
    <div className="html-viewer-container" style={{ width: '100%' }}>
      <iframe 
        ref={iframeRef}
        className="html-content-iframe"
        style={{
          width: '100%',
          minHeight: '500px',
          border: 'none',
          overflow: 'auto'
        }}
        title="HTML Content"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default HtmlViewer;