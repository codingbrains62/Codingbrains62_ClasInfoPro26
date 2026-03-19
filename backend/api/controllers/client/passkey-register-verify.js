// Passkey Register Verify
// This action verifies the passkey registration response from the client and saves the new credential to the user's record.
// Inputs: email, registration response from client, optional device name
// Outputs: success or error message

// Import the necessary function from the simplewebauthn library
const { verifyRegistrationResponse } = require('@simplewebauthn/server');

module.exports = {
  friendlyName: 'Passkey register verify',

  inputs: {
    email: { type: 'string', required: true },
    response: { type: 'json', required: true },
    deviceName: { type: 'string' },
  },

  fn: async function (inputs) {
    const res = this.res;
    try {
      const user = await Client.findOne({ emailAddress: inputs.email });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      // console.log("VERIFY REGISTRATION RESPONSE", inputs.response);
      // console.log("SESSION DATA", this.req.session);

      // Verify the registration response
      const expectedChallenge = this.req.session.challenge;
      //console.log("SESSION CHALLENGE", expectedChallenge);

      // If no challenge in session, cannot verify
      if (!expectedChallenge) {
        return res.status(400).json({ message: 'No challenge found in session' });
      }

      // Verify the response
      const verification = await verifyRegistrationResponse({
        response: inputs.response,
        expectedChallenge,
        expectedOrigin: process.env.FRONTEND_URL,
        expectedRPID: new URL(process.env.FRONTEND_URL).hostname,
        requireUserVerification: false,
      });
      //console.log("VERIFY RESULT", verification);
      if (!verification.verified) {
        return res.status(400).json({ message: 'Verification failed' });
      }
      // Save the new passkey credential to user's record
      const regInfo = verification.registrationInfo;
      if (!regInfo || !regInfo.credential) {
        return res.status(400).json({ message: 'registrationInfo missing' });
      }
      const credentialID = regInfo.credential.id;
      const credentialPublicKey = regInfo.credential.publicKey;
      const counter = regInfo.credential.counter;
      const passkeys = user.passkeys ? JSON.parse(user.passkeys) : [];
      passkeys.push({
        // credID: credentialID,
        credID: credentialID,
        publicKey: Buffer.from(credentialPublicKey).toString('base64'),
        counter,
        transports: regInfo.credential.transports,
        deviceName: inputs.deviceName || 'Unknown',
      });
      // Update user with new passkey and clear challenge
      await Client.updateOne({ id: user.id }).set({
        passkeys: JSON.stringify(passkeys),
        passkeyChallenge: null,
      });
      const updatedUser = await Client.findOne({ id: user.id });
       //console.log("UPDATED PASSKEYS", updatedUser.passkeys);
       // Log the successful registration event in HistoricalEvent
       await HistoricalEvent.create({
          description: 'Passkey registered successfully',
          actorId: user.id,
          actorType: 'Client',
          actorDisplayName: user.fullName,
          category: 'Other'
        });
      // clear session challenge
      this.req.session.challenge = null;
      return res.json({ message: 'Passkey registered successfully' });
    } catch (err) {
      console.error("VERIFY ERROR 👉", err);
      return res.status(500).json({ message: err.message });
    }
  }
};
