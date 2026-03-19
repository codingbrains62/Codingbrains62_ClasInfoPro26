/**
 * Remove client user by id
 * @description This action deletes a client user from the database based on the provided ID.
 * @param {number} id - The ID of the client user to be removed
 * @returns {object} A response object indicating the success or failure of the deletion process
 */

module.exports = {

  friendlyName: 'Remove user',

  description: 'Delete client user by id',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'Remove user id'
    }
  },

  exits: {
    success: { statusCode: 200 },
    notFound: { statusCode: 404 },
    serverError: { statusCode: 500 }
  },

  fn: async function (inputs, exits) {

    try {

      const removed = await Client.destroyOne({ id: inputs.id });

      if (!removed) {
        return exits.notFound({
          status: false,
          status_code: 404,
          message: 'User not found',
          data: null
        });
      }

      return exits.success({
        status: true,
        status_code: 200,
        message: 'User successfully removed',
        data: {
          id: removed.id
        }
      });

    } catch (error) {

      sails.log.error(error);

      return exits.serverError({
        status: false,
        status_code: 500,
        message: 'Internal Server Error',
        data: null
      });

    }

  }

};