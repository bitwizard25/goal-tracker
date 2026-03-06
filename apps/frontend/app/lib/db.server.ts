import mongoose from 'mongoose';

// Only load dotenv in development
if (process.env.NODE_ENV !== 'production') {
    const dotenv = await import('dotenv');
    const path = await import('path');
    // Load .env from monorepo root
    dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
    dotenv.config();
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goal-tracker';

// Set up connection pooling for Serverless/Vercel
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB Connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('MongoDB connection error:', error);
            cached.promise = null;
            throw error; // Let the caller know there was an error
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};
