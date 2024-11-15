const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider (e.g., Gmail, Yahoo, Outlook)
    auth: {
        user: 'concernedauthority58@gmail.com', // Your email
        pass: 'iamauthority'    // Your email password
    }
});

// Email options
const mailOptions = {
    from: 'concernedauthority58@gmail.com',       // Sender address
    to: '7shrinesigdel7@gmail.com',          // Receiver's email address
    subject: 'Hello from Nodemailer!',    // Subject line
    text: 'This is a plain text email',   // Email body in plain text
    html: '<h1>This is an HTML email</h1>' // Optional: Email body in HTML
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});