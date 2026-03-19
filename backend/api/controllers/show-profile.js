// Show Profile
// This action shows user profile with billing and organization details
// Inputs: user id
// Outputs: user profile with billing and organization details (if available)

module.exports = {

  friendlyName: 'Show profile',
  description: 'Show user profile with billing and organization details',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'User id'
    }
  },

  exits: {
    success: {
      description: 'User profile fetched successfully'
    },
    notFound: {
      description: 'User not found'
    }
  },
  fn: async function (inputs) {
    try {
      // 1️⃣ Find user
      const user = await Client.findOne({ id: inputs.id });
      if (!user) {
        return {
          status: 'error',
          status_code: 404,
          message: 'User not found'
        };
      }
      // 2️⃣ Get billing account
      let address = null;
      let companyName = null;
      if (user.billingAccount) {
        const billingAccount = await BillingAccount.findOne({
          id: user.billingAccount
        });
        if (billingAccount) {
          address = billingAccount.addressPart1 || null;
          if (billingAccount.org) {
            const org = await Org.findOne({
              id: billingAccount.org
            });
            if (org) {
              companyName = org.name || null;
            }
          }
        }
      }
      // 3️⃣ SAFE USER DATA (Never send password/token/internal flags)
      const safeUser = {
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        alternateEmailAddress: user.alternateEmailAddress,
        phone: user.phone,
        cellPhone: user.cellPhone,
        username: user.username,
        mandate: user.mandate,
        SecurityLevel: user.SecurityLevel,
        address: address,
        company_name: companyName,
        lastSeenAt: user.lastSeenAt
      };

      return {
        status: 'success',
        status_code: 200,
        message: safeUser
      };

    } catch (error) {

      sails.log.error('Show Profile Error:', error);

      return {
        status: 'error',
        status_code: 500,
        message: 'Internal Server Error'
      };
    }
  }
};
