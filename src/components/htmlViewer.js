'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeProvider';

const HtmlViewer = ({ htmlContent, slug }) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();
  
  // Handle client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Main content loading effect
  useEffect(() => {
    if (!iframeRef.current || !htmlContent || !isClient) return;
    
    try {
      setLoading(true);
      
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();
      
      // Helper to resize iframe to fit all content with no scrollbar
      const resizeIframe = () => {
        try {
          // Wait a moment for all content to render
          setTimeout(() => {
            if (!iframeDoc.body) return;
            
            // Get the full height of the content
            const contentHeight = Math.max(
              iframeDoc.documentElement.scrollHeight,
              iframeDoc.body.scrollHeight,
              iframeDoc.documentElement.offsetHeight,
              iframeDoc.body.offsetHeight
            );
            
            // Set iframe height to match content exactly
            iframe.style.height = `${contentHeight}px`;
            
            // Ensure container has no height constraints
            if (containerRef.current) {
              containerRef.current.style.height = 'auto';
              containerRef.current.style.minHeight = 'auto';
            }
            
            setLoading(false);
          }, 100);
        } catch (e) {
          console.error('Error resizing iframe:', e);
          setError('Error resizing content. Try refreshing the page.');
        }
      };
      
      // Apply resize when iframe loads and when window resizes
      iframe.onload = resizeIframe;
      window.addEventListener('resize', resizeIframe);
      
      // Also resize after a short timeout in case onload doesn't trigger properly
      setTimeout(resizeIframe, 1000);
      
      return () => {
        window.removeEventListener('resize', resizeIframe);
      };
    } catch (error) {
      console.error('Error rendering HTML content:', error);
      setError('Error rendering HTML content. Please check if the HTML is valid.');
      setLoading(false);
    }
  }, [htmlContent, isClient]);

  // Add styles to make body scrollable by disabling overflow on iframe
  useEffect(() => {
    if (!isClient) return;
    
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        height: 100%;
        width: 100%;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Ensure any fixed elements have proper positioning */
      .html-content-iframe {
        width: 100% !important;
        overflow: visible !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [isClient]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md">
        <p className="font-medium">Error</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="html-viewer-container w-full"
      style={{ 
        width: '100%',
        position: 'relative',
        height: 'auto'
      }}
    >
      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 dark:bg-gray-900 dark:bg-opacity-80 z-10">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      )}
      
      {/* Content iframe with simplified styling */}
      <div className="relative w-full rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
        <iframe 
          ref={iframeRef}
          className="html-content-iframe w-full"
          style={{
            width: '100%',
            border: 'none',
            overflow: 'visible', // Critical change: from 'auto' to 'visible'
            backgroundColor: 'white',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
          }}
          title="HTML Content"
          sandbox="allow-same-origin allow-scripts allow-forms"
          scrolling="no" // Explicitly disable iframe scrolling
        />
      </div>
    </div>
  );
};

export default HtmlViewer;
