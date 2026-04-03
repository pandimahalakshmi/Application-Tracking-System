import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const result = await mongoose.connection.db.collection('users').deleteOne({ email: 'admin@gmail.com' });
  console.log(result.deletedCount ? '✅ Admin deleted. Now sign up fresh from the website.' : '⚠️  Admin not found.');
  process.exit(0);
};
run().catch(e => { console.error(e.message); process.exit(1); });
