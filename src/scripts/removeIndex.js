import mongoose from 'mongoose';
import User from '../model/User.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function removeIndex() {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL environment variable is not set');
        }

        // Connect to your MongoDB database using the environment variable
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB...');
        
        // Get the collection
        const collection = User.collection;
        
        // List all indexes first
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes);
        
        // Drop the index
        await collection.dropIndex('number_1');
        
        console.log('Successfully dropped the number_1 index');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

removeIndex(); 