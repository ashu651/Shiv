import { v2 as cloudinary } from 'cloudinary';
import { config } from './env.js';

export function initCloudinary() {
  if (!config.useCloudinary) return;
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
}

export async function uploadToCloudinary(buffer, filename, folder = config.cloudinary.folder, resourceType = 'auto') {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export function cloudinaryThumbnailFromUrl(url, options = {}) {
  if (!url) return '';
  // Insert simple transformation; for images use c_fill,w_600; for videos pick first second so_1
  if (url.includes('/image/upload/')) {
    return url.replace('/image/upload/', '/image/upload/c_fill,w_600/');
  }
  if (url.includes('/video/upload/')) {
    return url.replace('/video/upload/', '/video/upload/so_1/');
  }
  return url;
}