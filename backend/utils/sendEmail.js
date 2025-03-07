const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent,attachmentPath) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
    });

   

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: htmlContent,
      attachments: [
        {
            filename: "invoice.pdf",
            path: attachmentPath,
            contentType: "application/pdf",
        },
    ],
    });

    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

module.exports = sendEmail;
