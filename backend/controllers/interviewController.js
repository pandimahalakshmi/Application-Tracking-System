import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, interviewer, date, time, type, notes } = req.body;

    const app = await Application.findById(applicationId).populate('userId', 'name email');
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const interview = await Interview.create({
      applicationId,
      candidateName:  app.userId.name,
      candidateEmail: app.userId.email,
      jobTitle:  app.jobTitle,
      company:   app.company,
      interviewer, date, time, type, notes,
    });

    // Update application status
    await Application.findByIdAndUpdate(applicationId, { status: 'Interview Scheduled' });

    // In-app notification
    await Notification.create({
      recipientId:   app.userId._id,
      recipientRole: 'user',
      message:       `Interview scheduled for "${app.jobTitle}" on ${date} at ${time}`,
      type:          'status_update',
      relatedId:     interview._id.toString(),
    });

    // Email notification
    await mailer.sendMail({
      from: `"ATS System" <${process.env.EMAIL_USER}>`,
      to: app.userId.email,
      subject: `📅 Interview Scheduled — ${app.jobTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:linear-gradient(135deg,#6366F1,#8B5CF6);padding:32px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="color:#fff;margin:0;">Interview Scheduled!</h1>
          </div>
          <div style="padding:32px;background:#fff;border-radius:0 0 8px 8px;">
            <p>Hi <strong>${app.userId.name}</strong>,</p>
            <p>Your interview for <strong>${app.jobTitle}</strong> at <strong>${app.company}</strong> has been scheduled.</p>
            <div style="background:#f3f4f6;padding:16px;border-left:4px solid #6366F1;border-radius:4px;margin:16px 0;">
              <p style="margin:0;"><strong>Date:</strong> ${date}</p>
              <p style="margin:8px 0 0;"><strong>Time:</strong> ${time}</p>
              <p style="margin:8px 0 0;"><strong>Type:</strong> ${type}</p>
              ${interviewer ? `<p style="margin:8px 0 0;"><strong>Interviewer:</strong> ${interviewer}</p>` : ''}
              ${notes ? `<p style="margin:8px 0 0;"><strong>Notes:</strong> ${notes}</p>` : ''}
            </div>
            <p>Please be prepared and log in to your dashboard for more details.</p>
          </div>
        </div>`,
    }).catch(e => console.error('Email error:', e.message));

    res.status(201).json({ success: true, interview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ date: 1 });
    res.json({ success: true, interviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
