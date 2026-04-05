import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendPasswordResetEmail } from '../utils/sendEmail.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const safeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  obj.id = obj._id.toString();
  return obj;
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phoneNumber, gender } = req.body;
    if (!name || !email || !password || !confirmPassword || !phoneNumber || !gender)
      return res.status(400).json({ error: 'All fields are required' });
    if (password !== confirmPassword)
      return res.status(400).json({ error: 'Passwords do not match' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    // Auto-assign admin role for admin email
    const role = email === 'admin@gmail.com' ? 'admin' : 'user';

    const user = await User.create({ name, email, password, phoneNumber, gender, role });
    res.status(201).json({ success: true, message: 'Signup successful', user: safeUser(user), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ error: 'Password is wrong' });
    res.json({ success: true, message: 'Login successful', user: safeUser(user), token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { password, role, _id, id, __v, createdAt, updatedAt, applications, ...updates } = req.body;
    const setObj = {};
    const simple = ['name','email','phoneNumber','qualification','gender','dateOfBirth','profilePhoto'];
    simple.forEach(f => { if (updates[f] !== undefined) setObj[f] = updates[f]; });
    if (updates.address)      Object.keys(updates.address).forEach(k      => { setObj[`address.${k}`]      = updates.address[k]; });
    if (updates.professional) Object.keys(updates.professional).forEach(k => { setObj[`professional.${k}`] = updates.professional[k]; });
    if (updates.skills)       Object.keys(updates.skills).forEach(k       => { setObj[`skills.${k}`]       = updates.skills[k]; });
    if (updates.resume)       Object.keys(updates.resume).forEach(k       => { setObj[`resume.${k}`]       = updates.resume[k]; });
    if (updates.education !== undefined) setObj['education'] = updates.education;
    const user = await User.findByIdAndUpdate(req.params.id, { $set: setObj }, { returnDocument: 'after', runValidators: false });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, message: 'Profile updated successfully', user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobTitle, company, jobId } = req.body;
    if (!jobTitle || !company) return res.status(400).json({ error: 'Job details required' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const alreadyApplied = user.applications?.some(a => a.jobId === jobId);
    if (alreadyApplied) return res.status(400).json({ error: 'Already applied for this job' });
    user.applications.push({ jobId: jobId || String(Date.now()), jobTitle, company, status: 'Applied', appliedDate: new Date().toISOString().split('T')[0] });
    await user.save();
    res.json({ success: true, message: 'Application submitted!', user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'No account found with that email address' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;

    const result = await sendPasswordResetEmail({
      toEmail: user.email,
      toName:  user.name,
      resetUrl,
    });

    if (!result.success) {
      // Email failed — still return the URL in dev mode for testing
      if (process.env.NODE_ENV === 'development') {
        console.log(` 🔗 Dev reset URL: ${resetUrl}`);
        return res.status(500).json({
          error: `Email sending failed: ${result.error}. Check EMAIL_USER and EMAIL_PASS in .env`,
          devResetUrl: resetUrl,
        });
      }
      return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
    }

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error('forgotPassword error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
