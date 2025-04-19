const nodemailer = require("nodemailer");
const mailSender = async (email, title, body) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.MAIL_HOST,
			auth: {
				user: process.env.MAIL_USER,
				pass: process.env.MAIL_PASS
			}
		})

		const mail = transporter.sendMail({
			from: "shivam singh",
			to: email,
			subject: title,
			html: body
		})

		return mail;

	} catch (error) {
		console.log("error while sending mail", error.message)
	}
}

module.exports = mailSender;