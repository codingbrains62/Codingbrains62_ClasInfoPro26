/**
 * Forget password link
 * @description :: Server-side logic for validating forget password tokens.
 * @author      :: Coding Brains
 * @param {string} token - The token sent to the user's email for password reset.
 * @returns {json} - A JSON response indicating whether the token is valid or not.
 * This controller checks if the provided token exists, is active, and has not expired. 
 * It returns a success message if the token is valid, or an error message if the token is missing, invalid, used, or expired.
**/
module.exports = {

  friendlyName: 'Forget password link',

  fn: async function () {
    const { req, res } = this;
    try {
      // token read
      const token = req.param('token');
      sails.log('FULL PARAMS:', req.params);
      sails.log('TOKEN RECEIVED:', token);
      if (!token) {
        return res.json({
          record: { status: 'error', message: 'Token missing' }
        });
      }
      // DB fetch
      const data = await ForgetPassword.findOne({
        tokan: token,
        tokan_status: 1
      });
      if (!data) {
        return res.json({
          record: { status: 'error', message: 'Invalid or used token' }
        });
      }
      // RAW expiresAt
      sails.log('RAW expiresAt:', data.expiresAt);
      sails.log('TYPE expiresAt:', typeof data.expiresAt);
      //  TIMESTAMP compare
      const nowTs = Date.now();
      const expiryTs = Number(data.expiresAt);

      sails.log('NOW_TS:', nowTs);
      sails.log('EXPIRY_TS:', expiryTs);

      // if (isNaN(expiryTs)) {
      if (isNaN(expiryTs) || expiryTs <= Date.now()) {
        return res.json({
          record: { status: 'error', message: 'Token expired' }
        });
      }
      //SUCCESS
      return res.json({
        record: {
          status: 'success',
          message: 'Token valid'
        }
      });
    } catch (err) {
      sails.log.error(err);
      return res.serverError();
    }
  }
};