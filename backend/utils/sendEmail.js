const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent,attachmentPath= null) => {
  try {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
    });

   
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: htmlContent,
    };

    if (attachmentPath) {
      mailOptions.attachments = [
        {
          filename: "invoice.pdf",
          path: attachmentPath,
          contentType: "application/pdf",
        },
      ];
    }

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Email sending error:", error);
  }
};

module.exports = sendEmail;
