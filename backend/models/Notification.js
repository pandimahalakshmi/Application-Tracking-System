import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientRole: { type: String, enum: ['user','admin'], required: true },
  message:       { type: String, required: true },
  type:          { type: String, enum: ['application','status_update','job_posted'], default: 'application' },
  relatedId:     { type: String, default: '' }, // applicationId or jobId
  read:          { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
