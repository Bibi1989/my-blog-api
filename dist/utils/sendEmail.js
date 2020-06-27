"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.sendEmail = (options) => {
    try {
        const { email, subject, message, resetUrl } = options;
        console.log({
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        });
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        let message_info = {
            from: "BibiBlog <blogbibi1989@gmail.com>",
            to: email,
            subject,
            html: `${message} <a href=${resetUrl}>Reset Password</a> Token Expire After 10 minute`,
        };
        transporter.sendMail(message_info, (err, data) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Email sent!!!");
            }
        });
    }
    catch (error) {
        return { status: "error", error: error.message };
    }
};
//# sourceMappingURL=sendEmail.js.map