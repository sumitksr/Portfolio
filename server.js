const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the current directory
app.use(express.static('./'));

// Handle form submissions
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Log the form data
    console.log('Form submission received:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Create a transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or another service like 'outlook', 'yahoo', etc.
      auth: {
        user: process.env.EMAIL_USER, // Your email address (use environment variables)
        pass: process.env.EMAIL_PASS  // Your email password or app password (use environment variables)
      }
    });
    
    // Email to yourself
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER, // Where you want to receive the messages
      subject: `New Contact Form: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>
        <h2>Message:</h2>
        <p>${message}</p>
      `
    };
    
    // Send the email
    await transporter.sendMail(mailOptions);
    
    // Optional: Send a confirmation email to the user
    const confirmationOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <h1>Thank you for your message, ${name}!</h1>
        <p>I've received your message and will get back to you as soon as possible.</p>
        <p>Have a great day!</p>
        <br>
        <p>Best regards,</p>
        <p>Sumit Kumar</p>
      `
    };
    
    await transporter.sendMail(confirmationOptions);
    
    // Check if this is an AJAX request or a direct form submission
    const isAjax = req.xhr || req.headers.accept.indexOf('json') > -1;
    
    if (isAjax) {
      // Return JSON for AJAX requests
      res.status(200).json({ 
        success: true,
        message: 'Form submission successful! Thank you for your message.',
        redirect: '/thank-you.html'
      });
    } else {
      // Direct redirect for regular form submissions
      res.redirect('/thank-you.html');
    }
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Check if this is an AJAX request or a direct form submission
    const isAjax = req.xhr || req.headers.accept.indexOf('json') > -1;
    
    if (isAjax) {
      res.status(500).json({ 
        success: false, 
        message: 'There was an error submitting the form. Please try again later.' 
      });
    } else {
      res.status(500).send('There was an error submitting the form. Please try again later.');
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 