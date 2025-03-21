const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    await transporter.sendMail({
      from: '"TaskManager" <no-reply@taskmanager.com>',
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Verify Your Email</h1>
        <p>Your verification code is: <strong>${verificationToken}</strong></p>
        <p>This code will expire in 24 hours.</p>
      `,
    });
  } catch (err) {
    console.error("Error sending verification email:", err);
  }
};
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: `"TaskManager" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
    console.log("Password reset email sent successfully.");
  } catch (err) {
    console.error("Error sending password reset email:", err);
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };