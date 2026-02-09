'use strict';

const nodemailer = require('nodemailer');
const { log } = require('../middlewares/loggers/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.google.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.PASSWORD,
  },
});

/**
 * Sends a password reset email to the user.
 * @param {{ userEmail: string, resetPasswordLink: string }} opts
 * @returns {Promise<void>}
 */
async function sendEmail({ userEmail, resetPasswordLink }) {
  log.debug('sendEmail called for', userEmail);
  try {
    const info = await transporter.sendMail({
      from: '"maebrie-commerce" <maebrice@ethereal.email>',
      to: userEmail,
      subject: 'FORGOT PASSWORD',
      text: `Hello! kindly click on the following link to reset your password: ${resetPasswordLink}`,
    });
    log.info('Email sent:', info.messageId);
  } catch (error) {
    log.error('Email send error:', error.message);
    throw error;
  }
}

module.exports = sendEmail;
