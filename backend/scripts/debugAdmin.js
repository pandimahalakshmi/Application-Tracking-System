import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const debug = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Find admin
  const admin = await User.findOne({ email: 'recruithubadmin@gmail.com' });
  if (!admin) {
    console.log('❌ Admin NOT found in database');
    process.exit(1);
  }

  console.log('✅ Admin found:', admin.email, '| role:', admin.role);
  console.log('   Stored hash:', admin.password);

  // Test password
  const match = await bcrypt.compare('Admin@123', admin.password);
  console.log('   Password match for "Admin@123":', match);

  if (!match) {
    console.log('\n🔧 Fixing: deleting and recreating admin...');
    await User.deleteOne({ email: 'recruithubadmin@gmail.com' });

    const newAdmin = new User({
      name: 'Admin User',
      email: 'recruithubadmin@gmail.com',
      password: 'Admin@123',
      role: 'admin',
      phoneNumber: '0000000000',
      gender: 'male',
    });
    await newAdmin.save();

    // Verify
    const saved = await User.findOne({ email: 'recruithubadmin@gmail.com' });
    const verify = await bcrypt.compare('Admin@123', saved.password);
    console.log('✅ New admin created. Password match:', verify);
    console.log('   New hash:', saved.password);
  }

  process.exit(0);
};

debug().catch(err => { console.error(err); process.exit(1); });
