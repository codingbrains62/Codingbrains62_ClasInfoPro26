module.exports.email = {

  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },

  templateDir: "views/emailTemplates",

  // from: '"ClasInfo Pro" <codingbrains123@gmail.com>',

  testMode: false,

  ssl: true

};