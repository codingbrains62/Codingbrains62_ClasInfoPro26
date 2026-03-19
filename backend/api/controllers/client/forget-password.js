/**
 * Forget password
 * @description :: Server-side logic for handling forget password requests.
 * @author      :: Coding Brains
 * 
 * @param {string} email - The email address of the user requesting a password reset.
 * @returns {json} - A JSON response indicating success or failure of the password reset request.
 
**/

const crypto = require('crypto');

module.exports = {

  friendlyName: 'Forget password',

  fn: async function () {
    const { req, res } = this;

    try {
      const email = req.param('email');
      if (!email) {
        return res.json({ status: 'error', message: 'Email required' });
      }

      const user = await Client.findOne({ emailAddress: email });
      if (!user) {
        return res.json({ status: 'error', message: 'Email not found' });
      }

      // disable old tokens
      await ForgetPassword.update({
        userid: user.id,
        tokan_status: 1
      }).set({ tokan_status: 0 });

      const token = crypto.randomBytes(32).toString('hex');
      const ONE_HOUR = 60 * 60 * 1000;

      await ForgetPassword.create({
        userid: user.id,
        tokan: token,
        tokan_status: 1,
        browser: req.headers.host,
        // expiresAt: new Date(Date.now() + ONE_HOUR)
        expiresAt: Date.now() + ONE_HOUR
      });
      // Send email with reset link 
      const html = await sails.helpers.sendTemplateEmail.with({
        template: 'forgot-password',
        templateData: {
            name: user.fullName,
            accessToken: token,
            baseUrl: sails.config.custom.baseUrl,
            subject: 'Reset Password'
          }
      });

      await Mailer.sendMail(html, {
        to: user.emailAddress,
        subject: 'Reset your password'
      });

      return res.json({
        status: 'success',
        message: 'Password reset link sent'
      });

    } catch (err) {
      sails.log.error(err);
      return res.serverError();
    }
  }
};