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
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-2xl font-bold">{`${slug}.html`}</h1>
      </div>
      
      <div className="bg-white border rounded-lg shadow-sm p-4 overflow-auto">
        <HtmlViewer htmlContent={htmlContent} />
      </div>
    </div>
  );
}