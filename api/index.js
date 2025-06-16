// api/index.js
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

const transporter = nodemailer.createTransport({
  host: 'live.smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'smtp@mailtrap.io',
    pass: '15a92777d0cd7c09f11e6bf6d5ba0ab0',
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error(error);
  } else {
    console.log('success, ready for message');
  }
});

app.post('/send', (req, res) => {
  const { fullname, email, phone, subject, country, message } = req.body;

  const mailOptions = {
    from: 'hi@susanmariealessio.online',
    // to: 'michealpeter040@gmail.com',
    to: 'susanmariealessio@gmail.com',
    subject: 'Form Submission',
    html: `<h5> Full Name : ${fullname} </h5><h5> Email : ${email} </h5><h5> Phone Number : ${phone} </h5><h5> Subject : ${subject} </h5><h5> Country : ${country} </h5><h5> Message : ${message} </h5>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).send('Error sending email');
    } else {
      return res.render('success');
    }
  });
});

app.get('/sitemap', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'sitemap.xml'));
});

export default app;
