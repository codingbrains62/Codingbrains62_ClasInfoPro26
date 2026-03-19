// Test controller to verify that we can save a passkey challenge to the database and retrieve it successfully.
// This is not part of the actual passkey implementation, just a test to verify that the database is working as expected.
// To test this, send a GET request to /api/v1/test-passkey-db and verify that the response contains the saved passkey challenge.
// Note: This controller assumes that there is a user with id 1 in the Client model. You may need to adjust the userId variable if your database is different.
// Example response:
// {
//   "status": "ok",
//   "savedValue": "POSTMAN_TEST_123"
// }

module.exports = {

  friendlyName: 'Test passkey db',

  fn: async function (inputs, exits) {

    const userId = 1;

    await Client.updateOne({ id: userId }).set({
      passkeyChallenge: 'POSTMAN_TEST_123'
    })

    const user = await Client.findOne({ id: userId })

    return exits.success({
      status: 'ok',
      savedValue: user.passkeyChallenge
    })
  }
}