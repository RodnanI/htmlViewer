import { getHtmlFiles } from '../utils/fileUtils';
import Link from 'next/link';
import { Inter } from 'next/font/google';

export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const htmlFiles = getHtmlFiles();
  
  // Group files by upload date (today, yesterday, older)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const groupedFiles = {
    today: [],
    yesterday: [],
    older: []
  };
  
  htmlFiles.forEach(file => {
    const fileDate = new Date(file.createdAt);
    fileDate.setHours(0, 0, 0, 0);
    
    if (fileDate.getTime() === today.getTime()) {
      groupedFiles.today.push(file);
    } else if (fileDate.getTime() === yesterday.getTime()) {
      groupedFiles.yesterday.push(file);
    } else {
      groupedFiles.older.push(file);
    }
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-800 mb-10">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.4))]" />
        <div className="absolute h-32 w-32 rounded-full bg-purple-400/40 -top-10 -right-10 blur-2xl" />
        <div className="absolute h-20 w-20 rounded-full bg-blue-400/40 bottom-10 left-10 blur-xl" />
        
        <div className="relative px-6 py-20 sm:px-10 sm:py-24 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            HTML File Viewer
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl">
            A simple and elegant way to view and download your HTML files.
          </p>
          
          <div className="mt-8 flex space-x-4">
            {htmlFiles.length > 0 && (
              <Link 
                href={`/html-view/${htmlFiles[0].slug}`}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-5 py-3 rounded-lg font-medium backdrop-blur-sm transition-all duration-200 flex items-center"
              >
                <span>View Latest File</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
            
            <a 
              href="/html-files" 
              className="bg-white text-blue-600 dark:text-blue-500 px-5 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Browse Files Directory
            </a>
          </div>
        </div>
      </div>
      
      {/* Status Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">HTML Files</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {htmlFiles.length > 0 
                  ? `You have ${htmlFiles.length} HTML file${htmlFiles.length !== 1 ? 's' : ''} available`
                  : 'No HTML files found'
                }
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{groupedFiles.today.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{groupedFiles.yesterday.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Older</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{groupedFiles.older.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* File Grid or Empty State */}
      {htmlFiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center text-center py-12">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-full mb-6 relative">
              <div className="absolute inset-0 animate-ping bg-blue-100 dark:bg-blue-800/20 rounded-full opacity-75"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 dark:text-blue-400 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No HTML files found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
              Get started by adding some HTML files to the directory:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 font-mono text-sm text-gray-700 dark:text-gray-300">
              /public/html-files/
            </div>
            
            <div className="mt-10 border-t border-gray-100 dark:border-gray-700 pt-6 w-full max-w-md">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Quick Help</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Place any .html files in the directory above</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Files will automatically appear on this page</span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">Refresh the page to see newly added files</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Your HTML Files</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {htmlFiles.map((file) => (
              <Link 
                href={`/html-view/${file.slug}`} 
                key={file.fileName}
                className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-100 dark:border-gray-700 flex items-center">
                  <div className="flex-shrink-0 bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {file.fileName}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        Added: {new Date(file.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <span>Size: {(file.size / 1024).toFixed(1)} KB</span>
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                    <span>View HTML Content</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Helpful tip section */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 flex items-start">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Did you know?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You can download any HTML file after entering the password. Check an individual file to see the download option.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
