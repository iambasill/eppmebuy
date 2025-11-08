import path from 'path';
import { config } from '../config';

export const getFileUrl = (file: Express.Multer.File): string => {
 
  if (file.path && file.path.startsWith('http')) {
    return file.path;
  }
  
  // AWS S3: multer-s3 adds 'location' property
  if ((file as any).location) {
    return (file as any).location;
  }
  
  // LOCAL STORAGE: construct URL from filename
  if (file.filename) {
    const baseUrl = config.API_BASE_URL;
    return `${baseUrl}/attachment/${file.filename}`;
  }
  
  throw new Error('Unable to determine file URL');
};

/**
 * Get URLs for multiple files
 */
export const getFileUrls = (files: Express.Multer.File[]): string[] => {
  return files.map(file => getFileUrl(file));
};