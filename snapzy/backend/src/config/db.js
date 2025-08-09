import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, {
      autoIndex: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}