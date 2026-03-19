const { verifyAuthenticationResponse } = require('@simplewebauthn/server');
const jwt = require('jsonwebtoken');

module.exports = {
  friendlyName: 'Passkey login verify',

  inputs: {
    response: { type: 'json', required: true },
  },

  fn: async function (inputs) {
    const res = this.res;
    try {
      // Find the user based on the credential ID in the response
      const incomingCredID = inputs.response.id;
      //console.log("Incoming rawId:", incomingCredID);
      const allUsers = await Client.find({
        isDeleted: 0,
        isDisabled: 0
      });

      let user = null;
      let authenticator = null;
      // Loop through users and their passkeys to find a matching credential ID
      for (const u of allUsers) {
        if (!u.passkeys) continue;
        let storedPasskeys = u.passkeys;
          if (typeof storedPasskeys === 'string') {
          try {
            storedPasskeys = JSON.parse(storedPasskeys);
          } catch (e) {
            continue;
          }
        }
        // console.log(`Checking user ${u.emailAddress} with passkeys:`, storedPasskeys);

        // Loop through the user's passkeys to find a match
        for (const pk of storedPasskeys) {
          //console.log("Stored credID:", pk.credID);
          if (pk.credID === incomingCredID) {
            user = u;
            authenticator = pk;
            user.passkeys = storedPasskeys;
            break;
          }
        }
        if (user) break;
      }
      // If no user or authenticator is found, return an error
      if (!user || !authenticator) {
        //console.log("No matching passkey found");
        // console.log("Incoming credID:", incomingCredID);
        return res.json({
          record: {
            status: 'error',
            status_code: 401,
            message: 'Passkey not registered'
          }
        });
      }
      // console.log("User found:", user.emailAddress);
      // console.log("Authenticator found with credID:", authenticator.credID);

      // Verify the authentication response
      const expectedChallenge = this.req.session.challenge;
      if (!expectedChallenge) {
        return res.json({
          record: {
            status: 'error',
            status_code: 400,
            message: 'No challenge found'
          }
        });
      }
      // console.log("---- LOGIN DEBUG START ----");
      // console.log("Incoming ID:", inputs.response.id);
      // console.log("Matched Authenticator:", authenticator);
      // console.log("credID type:", typeof authenticator?.credID);
      // console.log("publicKey exists:", !!authenticator?.publicKey);
      // console.log("counter value:", authenticator?.counter);
      // console.log("Session challenge:", this.req.session.challenge);
      // console.log("---- LOGIN DEBUG END ----");

      // Perform the verification
    const verification = await verifyAuthenticationResponse({
        response: inputs.response,
        expectedChallenge,
        expectedOrigin: process.env.FRONTEND_URL,
        expectedRPID: new URL(process.env.FRONTEND_URL).hostname,
        credential: {
          id: authenticator.credID,
          publicKey: Buffer.from(authenticator.publicKey, 'base64url'),
          counter: authenticator.counter ?? 0,
        },
        requireUserVerification: false,
    });
      if (!verification.verified) {
        return res.json({
          record: {
            status: 'error',
            status_code: 401,
            message: 'Authentication failed'
          }
        });
      }
      // Update the authenticator's counter and issue a JWT
    authenticator.counter = verification.authenticationInfo.newCounter;
      const token = jwt.sign(
        { id: user.id, username: user.username, SecurityLevel: user.SecurityLevel, type: 'client' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      // Set the JWT as an HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      // Clear the challenge from the session and 
      // update the user's passkey counter in the database
      this.req.session.challenge = null;
      authenticator.counter = verification.authenticationInfo.newCounter;
      await Client.updateOne({ id: user.id }).set({
          passkeys: JSON.stringify(user.passkeys),
          token,
          lastSeenAt: Date.now()
        });
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
      sails.log.error('Passkey login error:', err);
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
// This controller verifies the authentication response from the client during passkey login. It checks the credential ID against stored passkeys, verifies the response using @simplewebauthn/server, and issues a JWT if successful.
// Key steps include:
// 1. Finding the user and authenticator based on the incoming credential ID.
// 2. Verifying the authentication response using the stored public key and counter.
// 3. Issuing a JWT and setting it as an HTTP-only cookie upon successful verification.
// 4. Updating the authenticator's counter in the database to prevent replay attacks.
// 5. Handling errors and returning appropriate responses for different failure scenarios.