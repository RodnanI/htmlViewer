import Link from 'next/link';
import { getHtmlFiles } from '../utils/fileUtils';

export const dynamic = 'force-dynamic';

export default function Home() {
  const htmlFiles = getHtmlFiles();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Nándor's HTML Viewer</h2>
        <p className="text-gray-600 dark:text-gray-400">Easily view and download HTML files.</p>
      </div>
      
      {htmlFiles.length === 0 ? (
        <div className="card p-6 mb-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No HTML files found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add some .html files to the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                /public/html-files
              </code> directory to get started.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Your HTML Files</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{htmlFiles.length} file{htmlFiles.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {htmlFiles.map((file) => (
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Added: {new Date(file.createdAt).toLocaleDateString()} · {new Date(file.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  View File
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}