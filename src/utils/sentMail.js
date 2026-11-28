const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASS || '').replace(/\s/g, '')
    }
});

const sendEmail = async(options) =>{
 await transporter.sendMail({
    from: `"Rojgaar Support" <${process.env.EMAIL_USER}>`,
    to : options.to,
    subject: options.subject,
    html: options.html
 })
}
module.exports = sendEmail;
