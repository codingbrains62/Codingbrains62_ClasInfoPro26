// Passkey Register
// This action initiates the passkey registration process by generating registration options for the client.
// Inputs: email
// Outputs: registration options to be used by the client for passkey registration

const { generateRegistrationOptions } = require('@simplewebauthn/server');

module.exports = {
  friendlyName: 'Passkey register',

  inputs: {
    email: { type: 'string', required: true },
  },

  fn: async function (inputs, exits) {
    const res = this.res;

    const user = await Client.findOne({ emailAddress: inputs.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
  // Generate options for the client to pass to the browser
   const userID = new TextEncoder().encode(String(user.id));
   // console.log('USER ID IN BYTES', userID);
   // console.log('USER ID AS STRING', String(user.id));
   // console.log('USER ID AS NUMBER', user.id);
   const options = await generateRegistrationOptions({
      rpName: 'ClasInfoPro',
      rpID: new URL(process.env.FRONTEND_URL).hostname,
      userID,
      userName: user.username,
      userDisplayName: 'ClasInfoPro User',
      attestationType: 'none',
      timeout: 60000,
      excludeCredentials: [],
      authenticatorSelection: {
        //authenticatorAttachment: 'platform',
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });
    //console.log('DISPLAY NAME SENT:', options.user.displayName);
    //console.log('FULL USER OBJECT:', options.user);
    //console.log('RAW OPTIONS FROM SIMPLEWEBAUTHN', options);
    this.req.session.challenge = options.challenge;
    // save challenge
    await Client.updateOne({ id: user.id }).set({ passkeyChallenge: options.challenge });
   return res.json(JSON.parse(JSON.stringify(options)));
  }
};
