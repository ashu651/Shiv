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

export async function uploadToCloudinary(buffer, filename, folder = config.cloudinary.folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}