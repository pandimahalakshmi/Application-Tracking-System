import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  // Remove existing admin to recreate cleanly
  await User.deleteOne({ email: 'admin@gmail.com' });

  // Let the model's pre('save') hook hash the password
  await User.create({
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    phoneNumber: '0000000000',
    gender: 'male',
  });

  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@gmail.com');
  console.log('   Password: admin123');
  process.exit(0);
};

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
