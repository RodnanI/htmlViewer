import { notFound } from 'next/navigation';
import HtmlViewer from '../../../components/htmlViewer';
import HomeButton from '../../../components/HomeButton';
import FileDownloadButton from '../../../components/FileDownloadButton';
import { getHtmlContent, getHtmlFilePath } from '../../../utils/fileUtils';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export default function HtmlViewPage({ params }) {
  const { slug } = params;
  const htmlContent = getHtmlContent(slug);
  const filePath = getHtmlFilePath(slug);
  const fileName = `${slug}.html`;
  
  if (!htmlContent || !filePath) {
    notFound();
  }

  return (
    <div className="w-full mx-auto">
      <HomeButton />
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{fileName}</h1>
          <FileDownloadButton filePath={filePath} fileName={fileName} />
        </div>
      </div>
      
      <div className="w-full overflow-hidden">
        <HtmlViewer htmlContent={htmlContent} slug={slug} />
      </div>
    </div>
  );
}
