import fs from 'fs';
import path from 'path';

// Get all HTML files from the public/html-files directory
export function getHtmlFiles() {
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
    .map(fileName => ({
      fileName,
      slug: fileName.replace(/\.html$/, ''),
      path: `/html-files/${fileName}`,
      createdAt: fs.statSync(path.join(htmlDirectory, fileName)).ctime,
    }))
    .sort((a, b) => b.createdAt - a.createdAt); // Sort by creation date (newest first)
}

// Get a specific HTML file's path by slug
export function getHtmlFilePath(slug) {
  const htmlDirectory = path.join(process.cwd(), 'public/html-files');
  const fileName = `${slug}.html`;
  const filePath = path.join(htmlDirectory, fileName);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return `/html-files/${fileName}`;
}

// Get HTML content for server-side rendering
export function getHtmlContent(slug) {
  const htmlDirectory = path.join(process.cwd(), 'public/html-files');
  const fileName = `${slug}.html`;
  const filePath = path.join(htmlDirectory, fileName);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return fs.readFileSync(filePath, 'utf8');
}