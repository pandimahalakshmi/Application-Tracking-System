import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  company:      { type: String, required: true, trim: true },
  location:     { type: String, default: '' },
  type:         { type: String, enum: ['Full-time','Part-time','Contract','Internship'], default: 'Full-time' },
  salary:       { type: String, default: '' },
  description:  { type: String, required: true },
  requirements: { type: String, default: '' },
  tags:         [String],
  skills:       [String],
  status:       { type: String, enum: ['active','closed'], default: 'active' },
  postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applications: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
