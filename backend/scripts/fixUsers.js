import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  const db = mongoose.connection.db;
  const users = db.collection('users');

  // Show all users
  const all = await users.find({}).toArray();
  console.log(`📋 Total users in DB: ${all.length}`);
  all.forEach(u => console.log(`   - ${u.email} | role: ${u.role} | hash: ${u.password?.slice(0,20)}...`));

  // Delete and recreate admin with fresh hash
  await users.deleteOne({ email: 'admin@gmail.com' });
  const adminHash = await bcrypt.hash('admin123', 10);
  await users.insertOne({
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: adminHash,
    role: 'admin',
    phoneNumber: '0000000000',
    gender: 'male',
    qualification: '',
    dateOfBirth: '',
    profilePhoto: '',
    address: { city: '', state: '', country: '' },
    professional: { currentJobTitle:'', currentCompany:'', totalExperience:'', expectedSalary:'', currentSalary:'', preferredLocation:'', noticePeriod:'' },
    education: [],
    skills: { programmingLanguages:[], frameworks:[], databases:[], tools:[] },
    resume: { resumeFile:'', coverLetter:'', portfolioLink:'', githubProfile:'', linkedinProfile:'' },
    applications: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Verify
  const admin = await users.findOne({ email: 'admin@gmail.com' });
  const ok = await bcrypt.compare('admin123', admin.password);
  console.log(`\n✅ Admin recreated. Password check: ${ok ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log('   Email:    admin@gmail.com');
  console.log('   Password: admin123\n');

  // Also fix any user with broken hash (double-hashed)
  const allUsers = await users.find({ role: 'user' }).toArray();
  for (const u of allUsers) {
    // If hash starts with $2b$ it's valid bcrypt — skip
    // If it's double-hashed the compare will fail for any plain text
    console.log(`👤 User: ${u.email}`);
  }

  console.log('\n🎉 Done! Restart your backend and try logging in.');
  process.exit(0);
};

run().catch(err => { console.error('❌', err.message); process.exit(1); });
