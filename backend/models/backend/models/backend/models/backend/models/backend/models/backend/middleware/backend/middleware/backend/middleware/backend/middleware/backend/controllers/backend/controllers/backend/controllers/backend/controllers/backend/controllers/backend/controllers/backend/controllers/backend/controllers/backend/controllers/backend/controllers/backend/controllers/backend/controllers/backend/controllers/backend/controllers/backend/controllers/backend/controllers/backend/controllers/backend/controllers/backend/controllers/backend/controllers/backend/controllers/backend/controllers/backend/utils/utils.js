const nodemailer = require('nodemailer');
const Alert = require('../models/Alert');
const ChatMessage = require('../models/ChatMessage');

// =====================
// Email Service Utility
// =====================
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Scam Shield Awareness" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error.message);
  }
};

// =====================
// Alert / Notification Utility
// =====================
const triggerAlert = async ({ title, message, type = 'info', targetUsers = [] }) => {
  try {
    const alert = await Alert.create({ title, message, type, targetUsers });
    return alert;
  } catch (error) {
    console.error('Alert creation failed:', error.message);
    return null;
  }
};

// =====================
// AI Moderation Check Utility
// =====================
const checkMessageForScam = async (messageContent) => {
  try {
    // Placeholder AI logic, integrate ML/NLP later
    const scamKeywords = ['lottery', 'win', 'transfer', 'send money', 'bank account'];
    const lowerContent = messageContent.toLowerCase();

    const isScam = scamKeywords.some((word) => lowerContent.includes(word));
    return isScam;
  } catch (error) {
    console.error('AI moderation check failed:', error.message);
    return false;
  }
};

// =====================
// Flag message utility
// =====================
const flagMessageIfScam = async (chatMessageId) => {
  try {
    const chatMessage = await ChatMessage.findById(chatMessageId);
    if (!chatMessage) return false;

    const isScam = await checkMessageForScam(chatMessage.message);
    if (isScam) {
      chatMessage.isFlagged = true;
      chatMessage.flaggedAt = Date.now();
      await chatMessage.save();
    }
    return isScam;
  } catch (error) {
    console.error('Flagging message failed:', error.message);
    return false;
  }
};

module.exports = {
  sendEmail,
  triggerAlert,
  checkMessageForScam,
  flagMessageIfScam,
};
