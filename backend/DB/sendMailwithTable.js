

import nodemailer from 'nodemailer';
import mongoose from 'mongoose';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    auth: {
      user: 'vigneshsobalamurugan2005@gmail.com',
      pass: 'fsum hfnq rlns oyms',
    },
  });
  
  // Function to send email with a table of payments
  export const sendMailWithTable = async (payments) => {
    // Format data in an HTML table
    const rows = payments.map(payment => `
      <tr>
        <td>${payment.title}</td>
        <td>${payment.amount}</td>
        <td>${payment.category}</td>
        <td>${payment.platform}</td>
        <td>${new Date(payment.date).toLocaleDateString()}</td>
      </tr>
    `).join('');
  
    const htmlContent = `
      <h2>Requiring Payments</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Platform</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  
    // Set up mail options
    const mailOptions = {
      from: 'vigneshsobalamurugan2005@gmail.com',
      to: 'vigneshsobalamurugan2005@gmail.com',
      subject: 'Requiring Payments Summary',
      html: htmlContent,
    };
  
    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };