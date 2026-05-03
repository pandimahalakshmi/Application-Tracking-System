import nodemailer from 'nodemailer';

// Create transporter — uses Gmail SMTP directly for reliability on Vercel
const createTransporter = () => {
  const pass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass,
    },
  });
};

// ── Status update email ───────────────────────────────────────────────────
const statusMessages = {
  Pending:              { subject: 'Application Received',           body: (j, c) => `Your application for <strong>${j}</strong> at <strong>${c}</strong> is under review.` },
  Shortlisted:          { subject: '🎉 You Have Been Shortlisted!',  body: (j, c) => `Congratulations! You have been <strong>shortlisted</strong> for <strong>${j}</strong> at <strong>${c}</strong>.` },
  'Interview Scheduled':{ subject: '📅 Interview Scheduled',         body: (j, c) => `Your interview for <strong>${j}</strong> at <strong>${c}</strong> has been scheduled. Check your dashboard for details.` },
  Selected:             { subject: '🏆 You Are Selected!',           body: (j, c) => `You have been <strong>selected</strong> for <strong>${j}</strong> at <strong>${c}</strong>. Welcome aboard!` },
  Rejected:             { subject: 'Application Update',             body: (j, c) => `Thank you for applying for <strong>${j}</strong> at <strong>${c}</strong>. We have decided to move forward with other candidates.` },
};

const emailWrapper = (content) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f9fa;border-radius:8px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#6366F1,#8B5CF6);padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">ATS System</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Applicant Tracking System</p>
    </div>
    <div style="padding:32px 24px;background:#fff;">${content}</div>
    <div style="padding:16px 24px;background:#f3f4f6;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2024 ATS System. All rights reserved.</p>
    </div>
  </div>`;

export const sendStatusEmail = async ({ toEmail, toName, jobTitle, company, status }) => {
  const template = statusMessages[status];
  if (!template) return;

  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.warn(' ⚠️  Email not configured — skipping status email');
    return;
  }

  try {
    await createTransporter().sendMail({
      from: `"ATS System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: template.subject,
      html: emailWrapper(`
        <p style="color:#374151;">Hi <strong>${toName}</strong>,</p>
        <p style="color:#374151;line-height:1.7;">${template.body(jobTitle, company)}</p>
        <div style="margin:20px 0;padding:16px;background:#f3f4f6;border-left:4px solid #6366F1;border-radius:4px;">
          <p style="margin:0;color:#374151;"><strong>Position:</strong> ${jobTitle}</p>
          <p style="margin:8px 0 0;color:#374151;"><strong>Company:</strong> ${company}</p>
          <p style="margin:8px 0 0;color:#374151;"><strong>Status:</strong> <span style="color:#6366F1;font-weight:bold;">${status}</span></p>
        </div>
        <p style="color:#6b7280;font-size:13px;">Log in to your dashboard to view more details.</p>`),
    });
    console.log(` 📧 Status email sent to ${toEmail} [${status}]`);
  } catch (err) {
    console.error(` ❌ Status email failed: ${err.message}`);
  }
};

// ── Forgot password email ─────────────────────────────────────────────────
export const sendPasswordResetEmail = async ({ toEmail, toName, resetUrl }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = (process.env.EMAIL_PASS || '').replace(/\s/g, '');

  console.log('📧 EMAIL_USER:', emailUser ? `${emailUser.substring(0,5)}...` : 'NOT SET');
  console.log('📧 EMAIL_PASS:', emailPass ? 'SET (length:' + emailPass.length + ')' : 'NOT SET');

  if (!emailUser || emailUser === 'your_gmail@gmail.com' || !emailPass) {
    console.warn(' ⚠️  Email not configured. Reset URL:', resetUrl);
    return { success: false, error: 'Email service not configured. Please set EMAIL_USER and EMAIL_PASS in Vercel environment variables.' };
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `"RecruitHub" <${emailUser}>`,
      to: toEmail,
      subject: 'Password Reset Request — RecruitHub',
      html: emailWrapper(`
        <p style="color:#374151;">Hi <strong>${toName}</strong>,</p>
        <p style="color:#374151;line-height:1.7;">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>24 hours</strong>.</p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#5B5BD6,#7C3AED);color:#fff;text-decoration:none;border-radius:50px;font-weight:bold;font-size:15px;letter-spacing:0.3px;">
            Reset Password
          </a>
        </div>
        <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
        <p style="color:#9ca3af;font-size:12px;margin-top:16px;">Or copy this link:<br/><a href="${resetUrl}" style="color:#5B5BD6;word-break:break-all;">${resetUrl}</a></p>`),
    });
    console.log(` 📧 Password reset email sent to ${toEmail}`);
    return { success: true };
  } catch (err) {
    console.error(` ❌ Password reset email failed: ${err.message}`);
    return { success: false, error: err.message };
  }
};
