import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
	res.render('index'); // Render the 'index.ejs' file located in the 'views' directory
});
// transporter

// Create a transporter using Gmail SMTP
let transporter = nodemailer.createTransport({
	host: 'live.smtp.mailtrap.io', // Use the correct SMTP host
	port: 2525, // Change to 2525, or 465/587 based on your Mailtrap settings
	secure: false, // Use true if you're using port 465
	auth: {
		user: 'smtp@mailtrap.io', // Replace with your Mailtrap username
		pass: '83a6a895db451bf7dedf4500c708a8fa', // Replace with your Mailtrap password
	},
});

// verify transpoter

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
		from: 'info@demomailtrap.com',
		to: 'susanmariealessio@gmail.com',
		subject: 'Form Submission',
		html: `<h5> Full Name : ${fullname} </h5><h5> Email : ${email} </h5><h5> Phnoe Number : ${phone} </h5><h5> subject : ${subject} </h5> <h5> Country : ${country} </h5> <h5> Message : ${message} </h5>`,
	};

	// Send the email
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
	res.sendFile(path.join(__dirname, 'views', 'sitemap.xml'));
});

app.listen(PORT, () => {
	console.log(`app is connected to  port ${PORT}`);
});
