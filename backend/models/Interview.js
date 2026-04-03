import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  candidateName:  { type: String, required: true },
  candidateEmail: { type: String, required: true },
  jobTitle:       { type: String, required: true },
  company:        { type: String, required: true },
  interviewer:    { type: String, default: '' },
  date:           { type: String, required: true },
  time:           { type: String, required: true },
  type:           { type: String, enum: ['Phone','Video','In-person'], default: 'Video' },
  notes:          { type: String, default: '' },
  status:         { type: String, enum: ['Scheduled','Completed','Cancelled'], default: 'Scheduled' },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
