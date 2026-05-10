import mongoose from 'mongoose';
import dotenv from 'dotenv';

//Connect to MongoDB using Mongoose

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;