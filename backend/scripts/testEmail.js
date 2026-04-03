import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const test = async () => {
  console.log('Testing email with:');
  console.log('  USER:', process.env.EMAIL_USER);
  console.log('  PASS:', process.env.EMAIL_PASS ? '✓ set' : '✗ missing');

  if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your_')) {
    console.error('\n❌ EMAIL_USER is still a placeholder. Update your .env file.');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.verify();
    console.log('\n✅ SMTP connection verified successfully!');

    await transporter.sendMail({
      from: `"ATS System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself
      subject: 'ATS Email Test ✓',
      html: '<h2>Email is working!</h2><p>Your Nodemailer setup is correct.</p>',
    });

    console.log('✅ Test email sent to:', process.env.EMAIL_USER);
    console.log('\nCheck your inbox (and spam folder).');
  } catch (err) {
    console.error('\n❌ Email failed:', err.message);
    console.error('\nCommon fixes:');
    console.error('  1. Make sure 2-Step Verification is ON in Google Account');
    console.error('  2. Use App Password (not your real Gmail password)');
    console.error('  3. App Password: myaccount.google.com/apppasswords');
    console.error('  4. Remove spaces from App Password in .env if needed');
  }

  process.exit(0);
};

test();
