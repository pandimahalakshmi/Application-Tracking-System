import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Make sure MongoDB is running or update MONGO_URI in .env to use MongoDB Atlas');
    // Don't exit — let server stay up so frontend gets a proper error response
  }
};

export default connectDB;
