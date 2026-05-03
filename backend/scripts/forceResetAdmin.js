import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  // Delete any existing admin
  const deleted = await User.deleteMany({ email: 'recruithubadmin@gmail.com' });
  console.log(`🗑  Deleted ${deleted.deletedCount} existing admin record(s)`);

  // Hash password manually so we can verify
  const plainPassword = 'Admin@123';
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log('🔑 New hash:', hash);

  // Verify hash before saving
  const preCheck = await bcrypt.compare(plainPassword, hash);
  console.log('✅ Pre-save bcrypt verify:', preCheck);

  // Create fresh admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'recruithubadmin@gmail.com',
    password: plainPassword,   // model pre-save hook will hash this
    role: 'admin',
    phoneNumber: '0000000000',
    gender: 'male',
  });

  // Fetch back and verify
  const saved = await User.findById(admin._id);
  const postCheck = await bcrypt.compare(plainPassword, saved.password);
  console.log('✅ Post-save bcrypt verify:', postCheck);
  console.log('📧 Email:', saved.email);
  console.log('🔐 Role:', saved.role);
  console.log('🔒 Stored hash:', saved.password);

  if (!postCheck) {
    console.error('❌ HASH MISMATCH — double-hashing detected!');
    // Fix: store pre-hashed password directly
    await User.updateOne({ _id: saved._id }, { $set: { password: hash } });
    const fixed = await User.findById(saved._id);
    const fixCheck = await bcrypt.compare(plainPassword, fixed.password);
    console.log('🔧 After direct hash fix, verify:', fixCheck);
  }

  console.log('\n🎉 Admin ready:');
  console.log('   Email:    recruithubadmin@gmail.com');
  console.log('   Password: Admin@123');
  process.exit(0);
};

run().catch(err => { console.error('❌', err.message); process.exit(1); });
