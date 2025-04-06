import { getHtmlFiles } from '../utils/fileUtils';
import FileGrid from '../components/FileGrid';

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
        <FileGrid files={htmlFiles} />
      )}
    </div>
  );
}