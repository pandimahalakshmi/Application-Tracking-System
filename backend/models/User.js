import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  city:    { type: String, default: '' },
  state:   { type: String, default: '' },
  country: { type: String, default: '' },
}, { _id: false });

const professionalSchema = new mongoose.Schema({
  currentJobTitle:  { type: String, default: '' },
  currentCompany:   { type: String, default: '' },
  totalExperience:  { type: String, default: '' },
  expectedSalary:   { type: String, default: '' },
  currentSalary:    { type: String, default: '' },
  preferredLocation:{ type: String, default: '' },
  noticePeriod:     { type: String, default: '' },
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree:        { type: String, default: '' },
  college:       { type: String, default: '' },
  specialization:{ type: String, default: '' },
  yearOfPassing: { type: String, default: '' },
  percentage:    { type: String, default: '' },
}, { _id: false });

const skillsSchema = new mongoose.Schema({
  programmingLanguages: [String],
  frameworks:           [String],
  databases:            [String],
  tools:                [String],
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  resumeFile:      { type: String, default: '' },
  coverLetter:     { type: String, default: '' },
  portfolioLink:   { type: String, default: '' },
  githubProfile:   { type: String, default: '' },
  linkedinProfile: { type: String, default: '' },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true },
  role:          { type: String, enum: ['user', 'admin'], default: 'user' },
  phoneNumber:   { type: String, default: '' },
  qualification: { type: String, default: '' },
  gender:        { type: String, default: '' },
  dateOfBirth:   { type: String, default: '' },
  profilePhoto:  { type: String, default: '' },
  address:       { type: addressSchema,      default: () => ({}) },
  professional:  { type: professionalSchema, default: () => ({}) },
  education:     { type: [educationSchema],  default: [] },
  skills:        { type: skillsSchema,       default: () => ({ programmingLanguages: [], frameworks: [], databases: [], tools: [] }) },
  resume:        { type: resumeSchema,       default: () => ({}) },
  applications:  [{
    jobId:       { type: String, default: '' },
    jobTitle:    { type: String, default: '' },
    company:     { type: String, default: '' },
    status:      { type: String, default: 'Applied' },
    appliedDate: { type: String, default: '' },
  }],
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
