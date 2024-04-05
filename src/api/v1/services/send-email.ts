import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async function (
  email: string,
  subject: string,
  message: string
) {
  const options: SMTPTransport.Options = {
    host: process.env.SMTP_HOST,
    port: +(process.env.SMTP_PORT || 587),
    secure: false, // true for port 465, false for others
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  let transporter = nodemailer.createTransport(options);

  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL,
    to: email,
    subject: subject,
    html: message,
  });
};
