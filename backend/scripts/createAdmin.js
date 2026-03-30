import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Remove existing admin
  await User.deleteOne({ email: 'admin@gmail.com' });

  // Create fresh — model's pre('save') will hash the password
  const admin = new User({
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    phoneNumber: '0000000000',
    gender: 'male',
  });

  await admin.save();

  console.log('✅ Admin created!');
  console.log('   Email:    admin@gmail.com');
  console.log('   Password: admin123');
  console.log('   Role:     admin');
  process.exit(0);
};

createAdmin().catch(err => { console.error(err); process.exit(1); });
