/**
 * Reset password
 * @description :: Server-side logic for handling password reset requests.
 * @author      :: Coding Brains
 * @param {string} token - The password reset token sent to the user's email.
 * @param {string} password - The new password provided by the user.
 * @returns {json} - A JSON response indicating success or failure of the password reset operation.
**/

const bcrypt = require('bcrypt');

module.exports = {

  friendlyName: 'Reset password',

  fn: async function () {
    const { req, res } = this;

    try {
      const token = req.param('token');
      const password = req.param('password');

      if (!token || !password) {
        return res.json({
          record: { status: 'error', message: 'Token and password required' }
        });
      }
     // Password complexity validation
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.json({
          record: { status: 'error', status_code: 422, message: 'Minimum 8 characters with uppercase, lowercase, number and special character required' }
        });
      }
  
      const record = await ForgetPassword.findOne({
        tokan: token,
        tokan_status: 1
      });

      // Historical log for expired/invalid token
        await HistoricalEvent.create({
          description: 'Password reset failed - invalid or expired token',
          actorId: record?.userid || 0,
          actorType: 'Client',
          actorDisplayName: 'NaN',
          category: 'Other'
        });

      if (!record || Number(record.expiresAt) <= Date.now()) {
        return res.json({
          record: { status: 'error', status_code: 400, message: 'Invalid or expired token' }
        });
      }

      //const hash = await bcrypt.hash(password, 10);
      await Client.updateOne({ id: record.userid })
        .set({ password: password });

        await ForgetPassword.updateOne({ id: record.id })
        .set({ tokan_status: 0 }).fetch();

        // await ForgetPassword.update({ id: record.id })
        //  .set({ tokan_status: 0 });

        const user = await Client.findOne({ id: record.userid });

        await HistoricalEvent.create({
          description: 'Password reset successfully',
          actorId: user.id,
          actorType: 'Client',
          actorDisplayName: user.fullName,
          category: 'Other'
        });
    // Send confirmation email to user if email exists
        if (user && user.emailAddress) {
            const html = await sails.helpers.sendTemplateEmail.with({
              template: 'password-reset-success',
              templateData: {
                name: user.fullName || 'User',
                subject: 'CLAS Password Reset (Do Not Reply)'
              }
            });
            await Mailer.sendMail(html, {
              to: user.emailAddress,
              subject: 'CLAS Password Reset (Do Not Reply)',
              html: html
            });
        }

      return res.json({
        record: { status: 'success', status_code: 200, message: 'Password reset successful' }
      });

    } catch (err) {
      sails.log.error(err);
      // Historical log for server error
      await HistoricalEvent.create({
        description: 'Password reset failed - server error',
        actorId: 0,
        actorType: 'User',
        actorDisplayName: 'reset-password-user',
        category: 'Other'
      });
       return res.status(500).json({
        record: {
          status: 'error',
          status_code: 500,
          message: 'Internal server error'
        }
      });
    }
  }
};