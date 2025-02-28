const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Task = require("../models/Task");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

const sendReminderEmail = async (email, tasks) => {
  try {
    await transporter.sendMail({
      from: '"TaskManager" <no-reply@taskmanager.com>',
      to: email,
      subject: "Pending Tasks Reminder",
      html: `
        <h1>Pending Tasks Reminder</h1>
        <p>You have the following pending tasks for today:</p>
        <ul>
          ${tasks
            .map(
              (task) =>
                `<li>${task.title} (Deadline: ${new Date(
                  task.deadline
                ).toLocaleDateString()})</li>`
            )
            .join("")}
        </ul>
        <p>Please complete them as soon as possible.</p>
      `,
    });
    console.log(`Reminder email sent to ${email}`);
  } catch (err) {
    console.error(`Error sending reminder email to ${email}:`, err);
  }
};

const sendReminders = async () => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); 

    const users = await User.find();
    for (const user of users) {
      const pendingTasks = await Task.find({
        assignedTo: user._id,
        completed: false,
        deadline: {
          $gte: todayStart, 
          $lte: todayEnd, 
        },
      });

      if (pendingTasks.length > 0) {
        await sendReminderEmail(user.email, pendingTasks);
      }
    }
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
};

cron.schedule("20 10 * * *", () => {
  console.log("Sending morning reminders at 10:20 AM");
  sendReminders();
});

cron.schedule("0 18 * * *", () => {
  console.log("Sending evening reminders at 6:00 PM");
  sendReminders();
});

console.log("Reminder service started.");
