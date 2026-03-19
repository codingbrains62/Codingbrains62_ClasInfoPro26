const { generateAuthenticationOptions } = require('@simplewebauthn/server');

module.exports = {
  friendlyName: 'Passkey login',


  fn: async function () {
    const res = this.res;

    // const user = await Client.findOne({ emailAddress: inputs.email });

    // if (!user || !user.passkeys || user.passkeys.length === 0) {
    //   return res.status(400).json({ message: 'No passkeys found' });
    // }
    // console.log('PASSKEYS FROM DB:', user.passkeys);

    // Generate options for the client to use during authentication
    const options = await generateAuthenticationOptions({
      timeout: 60000,
      rpID: new URL(process.env.FRONTEND_URL).hostname,
      // allowCredentials: user.passkeys.map(pk => ({
      //   id: pk.credID,
      //   type: 'public-key',
      //   transports: pk.transports || ['internal'],
      // })),  
      userVerification: 'preferred',
    });
   // Store the challenge in the session for later verification
    this.req.session.challenge = options.challenge;
    return res.json(JSON.parse(JSON.stringify(options)));
  }
};

// This controller generates authentication options for passkey login. It retrieves the user's registered passkeys from the database, creates a challenge, and returns the options to the client. The challenge is stored in the session for later verification during the login process. Note that the allowCredentials field is currently commented out, which means any registered authenticator can be used for authentication. Adjust this as needed based on your application's requirements.