import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await User.deleteOne({ email: 'recruithubadmin@gmail.com' });

  const admin = new User({
    name: 'Admin User',
    email: 'recruithubadmin@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    phoneNumber: '0000000000',
    gender: 'male',
  });

  await admin.save();

  console.log('✅ Admin created!');
  console.log('   Email:    recruithubadmin@gmail.com');
  console.log('   Password: Admin@123');
  console.log('   Role:     admin');
  process.exit(0);
};

createAdmin().catch(err => { console.error(err); process.exit(1); });
