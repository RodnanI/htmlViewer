import './global.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HTML File Viewer',
  description: 'View your HTML files easily',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-xl font-semibold text-gray-800">HTML Viewer</h1>
            </div>
          </header>
          <main className="w-full px-4 py-6">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white py-4">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
              HTML File Viewer &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}