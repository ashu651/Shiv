import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/env.js';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export function ensureUploadDir() {
  if (!config.useCloudinary) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const uploadPath = path.resolve(__dirname, '../../', config.uploadDir);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
  }
}