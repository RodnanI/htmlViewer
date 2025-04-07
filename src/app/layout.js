import './global.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../context/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';
import ConditionalFooter from '../components/ConditionalFooter';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Nándor's HTML Viewer",
  description: "View your HTML files easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#f6f8fa" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-light-bg dark:bg-dark-bg pb-16">
            <header className="bg-white dark:bg-dark-card border-b border-light-border dark:border-dark-border sticky top-0 z-10">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">HTML Viewer</h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="w-full px-4 py-6">
              {children}
            </main>
            <ConditionalFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}