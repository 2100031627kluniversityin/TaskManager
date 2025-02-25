const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Use environment variables
    pass: process.env.EMAIL_PASSWORD, // Use environment variables
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

module.exports = { sendVerificationEmail };
