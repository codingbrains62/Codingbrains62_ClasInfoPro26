const nodemailer = require('nodemailer');

module.exports = {

  sendMail: async function (finalHtml, obj) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"ClasInfo Pro" <${process.env.EMAIL_USER}>`,
      to: obj.to,
      subject: obj.subject,
      html: finalHtml,
      replyTo: obj.replyTo || undefined
    });
  }

};