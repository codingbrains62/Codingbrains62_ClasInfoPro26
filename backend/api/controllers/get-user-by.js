/**
 * Get users based on role
 * @description This controller function retrieves users from the database based on the role of the logged-in user. If the user has an "Admin" role, it fetches all users; otherwise, it fetches only the logged-in user's information. The function handles various scenarios, including unauthorized access, user not found, and server errors, returning appropriate responses for each case.
 * @returns {object} A response object containing the status, status code, message, and data (list of users or user information) based on the logged-in user's role and the outcome of the database query.
 * - If the logged-in user is not found, it returns a 404 error with a message "User not found".
 * - If the logged-in user is not an admin, it returns only their information (id, fullName, isDisabled) with a success message.
 */
module.exports = {

  friendlyName: 'Get users',

  description: 'Get users based on role',

  inputs: {},

  exits: {
    success: { description: "Success",},
    error: { description: 'Error' },
    servererror: { description: 'Server Error'}
  },

  fn: async function (inputs, exits) {

    try {
      const loggedUser = this.req.user;
      //console.log("LOGGED USER:", loggedUser);
      if (!loggedUser) {
        return exits.error({
          status: "error",
          status_code: 401,
          message: "Unauthorized"
        });
      }
      // ==========================
      // FETCH FRESH USER DATA TO CHECK ROLE
      // ==========================
      const freshUser = await Client.findOne({
        where: { id: loggedUser.id },
        select: ['id', 'SecurityLevel']
      });
      if (!freshUser) {
        return exits.error({
          status: "error",
          status_code: 404,
          message: "User not found"
        });
      }
      const role = freshUser.SecurityLevel;
      // ==========================
      // IF USER ROLE
      // ==========================
      if (role !== 'Admin') {

        const user = await Client.findOne({
          where: { id: loggedUser.id }, 
          select: ['id', 'fullName', 'isDisabled']
        });

        if (!user) {
          return exits.error({
            status: "error",
            status_code: 404,
            message: "User not found",
            data: []
          });
        }

        return exits.success({
          status: "success",
          status_code: 200,
          message: "User fetched successfully",
          data: [{
            id: user.id,
            fullName: user.fullName,
            isDisabled: Number(user.isDisabled),
          }]
        });
      }

      // ==========================
      // 🔹 IF ADMIN ROLE
      // ==========================
      const users = await Client.find({
        select: ['id', 'fullName', 'isDisabled', 'SecurityLevel'],
        sort: 'id ASC'
      });

      if (!users || users.length === 0) {
        return exits.error({
          status: "error",
          status_code: 404,
          message: "No users found",
          data: []
        });
      }

      return exits.success({
        status: "success",
        status_code: 200,
        message: "Users fetched successfully",
        data: users.map(user => ({
              id: user.id,
              fullName: user.fullName,
              isDisabled: Number(user.isDisabled),
              SecurityLevel: user.SecurityLevel
            }))
      });

    } catch (err) {

      sails.log.error(err);

      return exits.servererror({
        status: "error",
        status_code: 500,
        message: "Internal Server Error",
        error: err.message
      });
    }
  }
};