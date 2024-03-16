// const nodemailer = require('nodemailer');
const clgDev = require('./clgDev');

// const emailSender = async (toEmail, subject, body) => {
//   try {
//     // For real purpose 
//     const transporter = nodemailer.createTransport({
//       host: process.env.MAIL_HOST,
//       auth: {
//         user: process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS,
//       },
//     });

//     // // For testing / development purpose
//     // const transporter = nodemailer.createTransport({
//     //   host: process.env.SMTP_HOST,
//     //   port: process.env.SMTP_PORT,
//     //   auth: {
//     //     user: process.env.SMTP_EMAIL,
//     //     pass: process.env.SMTP_PASSWORD,
//     //   },
//     // });

//     // send mail
//     const info = await transporter.sendMail({
//       from: `${process.env.FROM_NAME} |  <${process.env.FROM_EMAIL}>`,
//       to: toEmail,
//       subject: subject,
//       html: body,
//     });

//     return info;
//   } catch (err) {
//     clgDev(err.message);
//     throw err;
//   }
// };

// module.exports = emailSender;

const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                host:process.env.MAIL_HOST,
                auth:{
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            })


            let info = await transporter.sendMail({
                from: 'StudyNotion || CodeHelp - by Babbar',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


module.exports = mailSender;