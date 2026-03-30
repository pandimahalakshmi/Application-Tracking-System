import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  userName:    { type: String, default: '' },
  userEmail:   { type: String, default: '' },
  userPhone:   { type: String, default: '' },
  jobTitle:    { type: String, default: '' },
  company:     { type: String, default: '' },
  coverLetter: { type: String, default: '' },
  portfolioLink:{ type: String, default: '' },
  resumeFile:  { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending','Shortlisted','Interview Scheduled','Rejected','Selected'],
    default: 'Pending',
  },
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
