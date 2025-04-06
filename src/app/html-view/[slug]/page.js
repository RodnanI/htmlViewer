import Link from 'next/link';
import { notFound } from 'next/navigation';
import HtmlViewer from '../../../components/htmlViewer';
import { getHtmlContent, getHtmlFilePath } from '../../../utils/fileUtils';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default function HtmlViewPage({ params }) {
  const { slug } = params;
  const htmlContent = getHtmlContent(slug);
  const filePath = getHtmlFilePath(slug);
  
  if (!htmlContent || !filePath) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-800">{`${slug}.html`}</h1>
          </div>
        </div>
      </div>
      
      <div className="card p-1 overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-xs text-gray-500 font-mono">{filePath}</div>
        </div>
        <div className="overflow-auto">
          <HtmlViewer htmlContent={htmlContent} />
        </div>
      </div>
    </div>
  );
}