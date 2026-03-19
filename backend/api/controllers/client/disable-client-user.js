/**
 * Toggle client user status
 * @description This action toggles the isDisabled status of a client user. If the user is currently enabled, it will be disabled, and vice versa.
 * @param {number} id - The ID of the client user to toggle
 * @returns {object} A response object containing the new status of the user
 */

module.exports = {

  friendlyName: 'Toggle client user status',

  description: 'Enable or disable a client user',

  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: { statusCode: 200 },
    notFound: { statusCode: 404 },
    serverError: { statusCode: 500 }
  },

  fn: async function (inputs, exits) {

    // console.log("============= TOGGLE USER API HIT =============");
    // console.log("Incoming ID:", inputs.id);

    try {
      const client = await Client.findOne({ id: inputs.id });
      if (!client) {
        return exits.notFound({
          status: 'error',
          message: 'User not found'
        });
      }

      // console.log("DB VALUE RAW:", client.isDisabled);
      // console.log("TYPE:", typeof client.isDisabled);
      const current = Number(client.isDisabled);
      // console.log("Converted VALUE:", current);

      // TOGGLE
      const newValue = current === 1 ? 0 : 1;

      // console.log("NEW VALUE:", newValue);
      const updatedUser = await Client.updateOne({ id: inputs.id })
        .set({
          isDisabled: newValue
        });
      //console.log("DB Update result:", updatedUser);
      return exits.success({
        status: 'success',
        message: newValue === '1'
          ? 'User disabled successfully'
          : 'User enabled successfully',
        data: {
          id: inputs.id,
          isDisabled: newValue
        }
      });

    } catch (error) {
      sails.log.error(error);
      return exits.serverError({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};