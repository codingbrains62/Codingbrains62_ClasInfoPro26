/**
 * 
 * @description:: This controller validates user login credentials (username/email and password) and issues a JWT token upon successful authentication. It also logs historical events for both successful and failed login attempts.
 * @author :: Coding Brains
 * @param {string} username - The username of the user trying to log in.
 * @param {string} email - TThe email address of the user trying to log in.
 * @param {string} password - The plain text password for login.
 * @returns:
 * - On success: A JSON object containing the status, status code, message, user data (excluding password), and JWT token.
 * - On failure: A JSON object containing the status, status code, and error message indicating the reason for failure (e.g., missing credentials, user not found, invalid password, or internal server error).
 * 
 * @notes:
 * - The controller uses bcrypt to compare the provided password with the hashed password stored in the database.
 * - JWT tokens are signed with a secret key and have a validity of 7 days.
 * - Historical events are logged for both successful and failed login attempts for auditing purposes.
 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Validate login',
  description: 'Login user using username or email and password',

  inputs: {
    username: { type: 'string', required: false, description: 'Username of the user' },
    email: { type: 'string', required: false, description: 'Email of the user'  },
    password: { type: 'string', required: true, description: 'Plain text password for login' }
  },

  exits: {
    success: { statusCode: 200 },
    badRequest: { statusCode: 400 },
    unauthorized: { statusCode: 401 },
    serverError: { statusCode: 500 }
  },

  fn: async function (inputs, exits) {
    const res = this.res;

    try {
      const loginIdentifier = (inputs.username || inputs.email || '').trim();

      if (!loginIdentifier || !inputs.password) {
        return res.json({
          record: {
            status: 'error',
            status_code: 203,
            message: 'Username/email and password are required'
          }
        });
      }

      // Find client
      const user = await Client.findOne({
        where: {
          or: [
            { username: loginIdentifier },
            { emailAddress: loginIdentifier }
          ],
          isDeleted: 0,
        }
      }).populate('billingAccount');

      if (!user) {
        await HistoricalEvent.create({
          description: 'Username/email not found',
          actorId: 0,
          actorType: 'Other',
          actorDisplayName: loginIdentifier,
          category: 'Login'
        });

        return res.json({
          record: {
            status: 'error',
            status_code: 202,
            message: 'Invalid username or password'
          }
        });
      }

      // Check if account is disabled
      if (user.isDisabled == 1) {

        await HistoricalEvent.create({
          description: 'Disabled account login attempt',
          actorId: user.id,
          actorType: 'Client',
          actorDisplayName: user.fullName,
        });

         // SEND SECURITY ALERT EMAIL
          try {
            const userIp =
              this.req.headers['x-forwarded-for'] ||
              this.req.connection.remoteAddress ||
              this.req.socket.remoteAddress ||
              this.req.ip;
            const html = await sails.helpers.sendTemplateEmail.with({
                template: 'security-alert',
                templateData: {
                  name: user.fullName,
                  email: user.emailAddress,
                  ip: userIp.replace('::ffff:', ''),
                  time: new Date().toLocaleString(),
                  subject: 'Security Alert - Disabled Account Login Attempt'
                }
              });

              await Mailer.sendMail(html, {
                to: ['it@clasinfo.com', 'codingbrains62@gmail.com'],
                subject: 'Security Alert - Disabled Account Login Attempt'
              });
          } catch (e) {
            sails.log.error('Security alert email failed:', e);
          }

        return res.json({
          record: {
            status: 'error',
            status_code: 202,
            message: 'Invalid username or password'
          }
        });
      }

      // Password check
      const isMatch = await bcrypt.compare(inputs.password, user.password);
      if (!isMatch) {
        await HistoricalEvent.create({
          description: 'Invalid login password',
          actorId: user.id,
          actorType: 'Client',
          actorDisplayName: user.fullName,
          category: 'Login'
        });

        return res.json({
          record: {
            status: 'error',
            status_code: 202,
            message: 'Invalid username or password'
          }
        });
      }

      // JWT
      const token = jwt.sign(
        { 
          id: user.id,
          username: user.username,
          SecurityLevel: user.SecurityLevel,
          type: 'client' 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Cookie (optional – same as old)
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Update login info
      await Client.updateOne({ id: user.id }).set({
        token,
        lastSeenAt: Date.now()
      });

      // Login success log
      await HistoricalEvent.create({
        description: 'Login successful',
        actorId: user.id,
        actorType: 'Client',
        actorDisplayName: user.fullName,
        category: 'Login'
      });

      if (user.billingAccount) {
        user.bookkeepingId = user.billingAccount.bookkeepingId;
      }

      delete user.password;

      return res.json({
        record: {
          status: 'success',
          status_code: 200,
          message: 'Login successful',
          data: user,
          token
        }
      });

    } catch (err) {
      sails.log.error('Login error:', err);

      // await ErrorEvent.create({
      //   description: (err.message || 'Login error').substring(0, 255),
      //   actorId: 0,
      //   actorType: 'System',
      //   actorDisplayName: 'validate-login',
      //   category: 'Error'
      // });

      await HistoricalEvent.create({
        description: (err.message || 'Login error').substring(0, 255),
        actorId: 0,
        actorType: 'System',
        actorDisplayName: 'validate-login',
        category: 'Login'
      });

      return res.json({
        record: {
          status: 'error',
          status_code: 500,
          message: 'Internal Server Error'
        }
      });
    }
  }
};
// This controller handles user login by validating the provided username/email and password. It checks for the existence of the user, verifies the password using bcrypt, and issues a JWT upon successful authentication. The controller also logs historical events for both successful and failed login attempts. Error handling is implemented to catch and log any unexpected issues during the login process.