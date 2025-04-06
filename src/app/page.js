import Link from 'next/link';
import { getHtmlFiles } from '../utils/fileUtils';

export const dynamic = 'force-dynamic'; // Force dynamic rendering to detect new files

export default function Home() {
  const htmlFiles = getHtmlFiles();

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-6">HTML File Viewer</h1>
      
      {htmlFiles.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded-md">
          <p>No HTML files found. Add some .html files to the <code>/public/html-files</code> directory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {htmlFiles.map((file) => (
            <Link 
              href={`/html-view/${file.slug}`} 
              key={file.fileName}
              className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-medium">{file.fileName}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Added: {new Date(file.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h2 className="text-xl font-semibold mb-2">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Add .html files to the <code>/public/html-files</code> directory</li>
          <li>They will automatically appear on this homepage</li>
          <li>Click on any file to view it</li>
        </ol>
      </div>
    </div>
  );
}