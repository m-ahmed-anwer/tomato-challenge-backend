const nodemailer = require("nodemailer");
const { transporter } = require("../utils/nodemailer");

const sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
    console.log("Email sent successfully");
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
};

module.exports = {
  sendEmail,
};
