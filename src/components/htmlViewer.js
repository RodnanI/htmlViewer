'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeProvider';
import PasswordModal from './PasswordModal';

const HtmlViewer = ({ htmlContent, slug }) => {
  const iframeRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [processedKB, setProcessedKB] = useState(0);
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
    
    const timer = setInterval(() => {
      if (loading) {
        setElapsedTime(prev => prev + 0.1);
        setProcessedKB(Math.round(progress * 10.24));
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, [loading, progress]);

  // Canvas animation for the loading screen
  useEffect(() => {
    if (!loading || !canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let startTime = Date.now();

    // Ensure canvas is sized correctly
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation constants
    const gridSize = 20;
    const dotSize = 1;
    const waveSpeed = 0.002;
    const waveHeight = 5;

    // Draw frame function
    const drawFrame = () => {
      const elapsed = Date.now() - startTime;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Calculate center points for wave origin
      const centerX = width / 2;
      const centerY = height / 2;

      // Calculate max radius for progress circle
      const maxRadius = (progress / 100) * Math.min(width, height) * 0.4;
      
      // Draw grid of dots
      for (let x = gridSize; x < width - gridSize; x += gridSize) {
        for (let y = gridSize; y < height - gridSize; y += gridSize) {
          // Calculate distance from center
          const dx = x - centerX;
          const dy = y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Calculate wave effect
          const wave = Math.sin(distance * 0.05 - elapsed * waveSpeed);
          const waveOffset = wave * waveHeight * (progress / 100);
          
          // Calculate dot size based on wave and progress
          const pulseFactor = 1 + wave * 0.3 * (progress / 100);
          const currentDotSize = dotSize * pulseFactor;
          
          // Calculate color based on distance and progress
          const hue = (distance + elapsed * 0.05) % 360;
          const alpha = 0.7 - distance / (width * 0.7);
          
          // Only draw if we're within the circular progress area
          if (distance < maxRadius) {
            ctx.beginPath();
            ctx.arc(
              x + waveOffset * dx / distance * 0.5, 
              y + waveOffset * dy / distance * 0.5, 
              currentDotSize, 0, Math.PI * 2
            );
            
            // Draw with different styles depending on theme
            if (theme === 'dark') {
              ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            } else {
              ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${alpha})`;
            }
            ctx.fill();
          }
        }
      }

      // Draw progress circle outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Perpetuate animation
      if (loading) {
        animationFrame = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [loading, progress, theme, isClient]);

  // Main content loading effect
  useEffect(() => {
    if (!iframeRef.current || !htmlContent || !isClient) return;
    
    try {
      setLoading(true);
      setProgress(0);
      setElapsedTime(0);
      setProcessedKB(0);
      
      // Simulate progress with slight acceleration
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const remaining = 100 - prev;
          const increment = Math.max(0.2, remaining * 0.05);
          return Math.min(99, prev + increment);
        });
      }, 50);
      
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
        setProgress(100);
        setTimeout(() => {
          resizeIframe();
          setLoading(false);
        }, 800);
        clearInterval(progressInterval);
      };
      
      window.addEventListener('resize', resizeIframe);
      
      return () => {
        window.removeEventListener('resize', resizeIframe);
        clearInterval(progressInterval);
      };
    } catch (error) {
      console.error('Error rendering HTML content:', error);
      setError('Error rendering HTML content. Please check if the HTML is valid.');
      setLoading(false);
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

  const loadingStatusText = 
    progress < 30 ? "Parsing" : 
    progress < 60 ? "Rendering" : 
    progress < 90 ? "Optimizing" : 
    "Finalizing";

  return (
    <div className="html-viewer-container relative" style={{ width: '100%' }}>
      {/* Download Button */}
      {!loading && isClient && (
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
      
      {/* Advanced loading overlay - only rendered client-side */}
      {loading && isClient && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 backdrop-blur-sm transition-all duration-700 ease-out">
          {/* Canvas for the dot grid animation */}
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.9 }}
          />
          
          {/* Floating progress indicator */}
          <div className="relative z-10">
            <div 
              className="text-3xl font-bold tracking-tight text-center mb-2"
              style={{ 
                color: theme === 'dark' ? 'white' : 'black',
                opacity: 0.9,
                textShadow: theme === 'dark' 
                  ? '0 0 15px rgba(255,255,255,0.3)' 
                  : '0 0 15px rgba(0,0,0,0.1)'
              }}
            >
              {Math.round(progress)}%
            </div>
            
            <div 
              className="text-sm text-center font-mono uppercase tracking-widest"
              style={{
                color: theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                opacity: progress / 100,
                transform: `translateY(${20 - (progress / 5)}px)`,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            >
              {loadingStatusText}
            </div>
          </div>
          
          {/* Technical details footer */}
          <div 
            className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono opacity-60"
            style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
          >
            <div className="flex justify-center space-x-4">
              <span>{processedKB} KB processed</span>
              <span>•</span>
              <span>{elapsedTime.toFixed(1)} sec</span>
              <span>•</span>
              <span>v2.4.3</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Simple loading placeholder for server-side rendering */}
      {loading && !isClient && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      )}
      
      {/* Content iframe with refined transitions */}
      <div className="relative rounded-lg overflow-hidden border border-light-border dark:border-dark-border">
        <iframe 
          ref={iframeRef}
          className="html-content-iframe w-full"
          style={{
            minHeight: '80vh',
            border: 'none',
            overflow: 'auto',
            backgroundColor: 'white',
            opacity: loading ? 0 : 1,
            transform: loading ? 'scale(0.98)' : 'scale(1)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: loading ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.05)'
          }}
          title="HTML Content"
          sandbox="allow-same-origin allow-scripts allow-forms"
        />
        
        {/* High-tech top line progress bar - only rendered client-side */}
        {isClient && (
          <div className="absolute top-0 left-0 right-0 flex h-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={{ 
                width: `${progress}%`,
                opacity: loading ? 1 : 0,
                transition: 'width 0.3s ease-out, opacity 0.6s ease-out',
                boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HtmlViewer;