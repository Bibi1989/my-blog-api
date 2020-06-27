import nodemailer from "nodemailer";

interface SendMailInterface {
  email: string;
  subject: string;
  message: string;
  resetUrl: string;
}

export const sendEmail = (options: SendMailInterface) => {
  try {
    const { email, subject, message, resetUrl } = options;
    console.log({
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let message_info = {
      from: "BibiBlog <blogbibi1989@gmail.com>", // sender address
      to: email,
      subject,
      html: `${message} <a href=${resetUrl}>Reset Password</a>`,
    };

    transporter.sendMail(message_info, (err: Error, data: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent!!!");
      }
    });
  } catch (error) {
    return { status: "error", error: error.message };
  }
};
