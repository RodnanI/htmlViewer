import { getHtmlFiles } from '../utils/fileUtils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const htmlFiles = getHtmlFiles();
  
  // Format file sizes more readable
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Format date in a readable way
  const formatDate = (date) => {
    const now = new Date();
    const fileDate = new Date(date);
    
    // Reset time part for comparison
    const todayDate = new Date(now);
    todayDate.setHours(0, 0, 0, 0);
    
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    
    const fileDay = new Date(fileDate);
    fileDay.setHours(0, 0, 0, 0);
    
    if (fileDay.getTime() === todayDate.getTime()) {
      return `Today, ${fileDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (fileDay.getTime() === yesterdayDate.getTime()) {
      return `Yesterday, ${fileDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return fileDate.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header Section */}
      <header className="mb-12 pt-8">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100 mb-2">Nándor's HTML Viewer</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          A minimalist tool to view and manage your HTML files. {htmlFiles.length > 0 && 
            `Currently hosting ${htmlFiles.length} file${htmlFiles.length !== 1 ? 's' : ''}.`}
        </p>
      </header>
      
      {/* Empty State */}
      {htmlFiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-10 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">No files found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            To get started, add HTML files to the following directory:
          </p>
          
          <div className="inline-block bg-gray-50 dark:bg-gray-700 rounded px-3 py-2 font-mono text-sm text-gray-600 dark:text-gray-300 mb-8 overflow-x-auto max-w-full">
            /public/html-files/
          </div>
          
          <div className="border-t border-gray-100 dark:border-gray-700 pt-6 mt-2 text-left max-w-md mx-auto">
            <h3 className="text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">How it works</h3>
            <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-xs text-gray-500 dark:text-gray-400">1</span>
                <span>Place HTML files in the directory</span>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-xs text-gray-500 dark:text-gray-400">2</span>
                <span>Files appear automatically on this page</span>
              </li>
              <li className="flex">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 text-xs text-gray-500 dark:text-gray-400">3</span>
                <span>Click any file to view or download it</span>
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <>
          {/* File List - Responsive for mobile and desktop */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden">
            {/* Desktop Table (hidden on small screens) */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Added</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {htmlFiles.map((file) => (
                    <tr 
                      key={file.fileName}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer"
                    >
                      <Link
                        href={`/html-view/${file.slug}`}
                        className="contents"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {file.fileName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(file.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </td>
                      </Link>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile List View (shown only on small screens) */}
            <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
              {htmlFiles.map((file) => (
                <Link 
                  href={`/html-view/${file.slug}`}
                  key={file.fileName}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-750"
                >
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {file.fileName}
                    </div>
                  </div>
                  <div className="ml-7 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div>{formatDate(file.createdAt)}</div>
                    <div>{formatFileSize(file.size)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Info Card */}
          <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-6 flex items-start space-x-4 mb-20">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Password Protected</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Files can be downloaded after entering the correct password. View a file to see the download option.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
