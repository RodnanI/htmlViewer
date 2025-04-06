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
    <div className="w-full mx-auto">
      <div className="mb-4">
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
            <h1 className="text-xl font-semibold text-gray-800">{`${slug}.html`}</h1>
          </div>
        </div>
      </div>
      
      <div className="w-full overflow-hidden">
        <HtmlViewer htmlContent={htmlContent} />
      </div>
    </div>
  );
}