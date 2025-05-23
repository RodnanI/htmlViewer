'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';

export default function FileGrid({ files: initialFiles }) {
  // Sort states cycling order: date-desc, date-asc, name-asc, name-desc, size-desc, size-asc
  const [sortIndex, setSortIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const gridRef = useRef(null);
  
  // Sort configurations
  const sortConfigs = [
    { id: 'date-desc', label: 'Date', icon: '↓' },
    { id: 'date-asc', label: 'Date', icon: '↑' },
    { id: 'name-asc', label: 'Name', icon: '↑' },
    { id: 'name-desc', label: 'Name', icon: '↓' },
    { id: 'size-desc', label: 'Size', icon: '↓' },
    { id: 'size-asc', label: 'Size', icon: '↑' },
  ];
  
  // Get currently sorted files
  const getSortedFiles = () => {
    const config = sortConfigs[sortIndex].id;
    
    return [...initialFiles].sort((a, b) => {
      if (config === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
      if (config === 'date-asc') return new Date(a.createdAt) - new Date(b.createdAt);
      if (config === 'name-asc') return a.fileName.localeCompare(b.fileName);
      if (config === 'name-desc') return b.fileName.localeCompare(a.fileName);
      if (config === 'size-desc') return b.size - a.size;
      if (config === 'size-asc') return a.size - b.size;
      return 0;
    });
  };
  
  // Cycle sort options with animation
  const cycleSortOption = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Fade out
    if (gridRef.current) {
      gridRef.current.style.opacity = '0';
      gridRef.current.style.transform = 'translateY(10px)';
    }
    
    // Update sort state after animation out
    setTimeout(() => {
      setSortIndex((prev) => (prev + 1) % sortConfigs.length);
      
      // Fade back in
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.style.opacity = '1';
          gridRef.current.style.transform = 'translateY(0)';
        }
        setTimeout(() => setIsAnimating(false), 300);
      }, 50);
    }, 300);
  };
  
  const currentSort = sortConfigs[sortIndex];
  const sortedFiles = getSortedFiles();
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Your HTML Files</h3>
        <div className="flex items-center">
          <button 
            onClick={cycleSortOption}
            disabled={isAnimating}
            className="sort-btn px-2.5 py-1.5 rounded-md bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      shadow-sm hover:shadow
                      flex items-center space-x-1.5
                      transition-all duration-200 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Sort by ${currentSort.label} ${currentSort.icon === '↑' ? 'ascending' : 'descending'}`}
            title={`Sort by ${currentSort.label} ${currentSort.icon === '↑' ? 'ascending' : 'descending'}`}
          >
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              {currentSort.label}
            </span>
            <span className={`transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`}>
              {currentSort.icon}
            </span>
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-4">{sortedFiles.length} file{sortedFiles.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <div 
        ref={gridRef} 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        style={{ 
          transition: 'opacity 300ms ease, transform 300ms ease',
          opacity: 1,
          transform: 'translateY(0)'
        }}
      >
        {sortedFiles.map((file) => (
          <Link 
            href={`/html-view/${file.slug}`} 
            key={file.fileName}
            className="card p-4 hover:border-blue-300 dark:hover:border-blue-500 flex flex-col"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">{file.fileName}</h4>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <p>Added: {new Date(file.createdAt).toLocaleDateString()} · {new Date(file.createdAt).toLocaleTimeString()}</p>
                  <p>Size: {(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-blue-600 dark:text-blue-400 font-medium">
              View File
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}