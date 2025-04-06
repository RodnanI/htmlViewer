export const metadata = {
    title: 'HTML File Viewer',
    description: 'View your HTML files easily',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </body>
      </html>
    );
  }