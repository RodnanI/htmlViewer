import fs from 'fs';
import path from 'path';

// Get all HTML files from the public/html-files directory
export function getHtmlFiles() {
  try {
    const htmlDirectory = path.join(process.cwd(), 'public/html-files');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(htmlDirectory)) {
      fs.mkdirSync(htmlDirectory, { recursive: true });
      return [];
    }
    
    // Read all files in the directory
    const fileNames = fs.readdirSync(htmlDirectory);
    
    // Filter for HTML files only
    return fileNames
      .filter(file => file.endsWith('.html'))
      .map(fileName => {
        const filePath = path.join(htmlDirectory, fileName);
        let stats;
        
        try {
          stats = fs.statSync(filePath);
        } catch (error) {
          console.error(`Error getting stats for ${fileName}:`, error);
          // Provide fallback values if stats can't be read
          return {
            fileName,
            slug: fileName.replace(/\.html$/, ''),
            path: `/html-files/${fileName}`,
            createdAt: new Date(),
            size: 0
          };
        }
        
        return {
          fileName,
          slug: fileName.replace(/\.html$/, ''),
          path: `/html-files/${fileName}`,
          createdAt: stats.ctime,
          size: stats.size // Add file size in bytes
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by creation date (newest first)
  } catch (error) {
    console.error('Error reading HTML files directory:', error);
    return [];
  }
}

// Get a specific HTML file's path by slug
export function getHtmlFilePath(slug) {
  try {
    const htmlDirectory = path.join(process.cwd(), 'public/html-files');
    const fileName = `${slug}.html`;
    const filePath = path.join(htmlDirectory, fileName);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return `/html-files/${fileName}`;
  } catch (error) {
    console.error(`Error getting file path for ${slug}:`, error);
    return null;
  }
}

// Get HTML content for server-side rendering
export function getHtmlContent(slug) {
  try {
    const htmlDirectory = path.join(process.cwd(), 'public/html-files');
    const fileName = `${slug}.html`;
    const filePath = path.join(htmlDirectory, fileName);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading HTML content for ${slug}:`, error);
    return null;
  }
}