import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Load .env from monorepo root (two levels up from apps/frontend)
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
// Also try loading from current working directory
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goal-tracker';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI);
        isConnected = db.connections[0].readyState === 1;
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't crash the server — allow retries on next request
    }
};
