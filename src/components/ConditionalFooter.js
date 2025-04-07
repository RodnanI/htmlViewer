'use client';

import { usePathname } from 'next/navigation';

const ConditionalFooter = () => {
  const pathname = usePathname();
  
  // Hide footer on HTML viewer pages
  if (pathname.startsWith('/html-view/')) {
    return null;
  }
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-card py-4 z-10">
      <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Nándor Koch // {new Date().getFullYear()}
      </div>
    </footer>
  );
};

export default ConditionalFooter;