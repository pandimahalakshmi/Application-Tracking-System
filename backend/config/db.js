import mongoose from 'mongoose';

const connectDB = async (retries = 5, delay = 3000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`\n ✅ MongoDB Connected: ${conn.connection.host}`);

      mongoose.connection.on('disconnected', () => {
        console.warn(' ⚠️  MongoDB disconnected. Attempting to reconnect...');
        setTimeout(() => connectDB(3, 2000), 2000);
      });

      return; // success — exit
    } catch (error) {
      console.error(` ❌ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        console.log(` 🔄 Retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
      } else {
        console.error('\n MongoDB failed to connect after all retries.');
        console.error(' Make sure MongoDB is running or check your MONGO_URI in .env\n');
        process.exit(1); // exit so the process manager can restart
      }
    }
  }
};

export default connectDB;
