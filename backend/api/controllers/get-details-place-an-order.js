// Get Details Place An Order
// This action retrieves user billing and organization details for placing an order
// Inputs: user id
// Outputs: user billing and organization details (if available)

module.exports = {

  friendlyName: 'Get details place an order',

  description: 'Get user billing and organization details for placing an order',

  inputs: {
    id: {
      type: 'number',
      required: true,
      description: 'User id'
    }
  },

  exits: {
    success: {
      description: 'Details fetched successfully'
    },
    notFound: {
      description: 'User not found'
    }
  },

  fn: async function (inputs) {
    const res = this.res;

    try {

      // 1️⃣ Find user
      const user = await Client.findOne({ id: inputs.id });

      if (!user) {
        return res.json({
          status: false,
          status_code: 404,
          message: 'User not found',
          data: null
        });
      }

      let billingAccount = null;
      let org = null;

      // 2️⃣ Get billing account
      if (user.billingAccount) {
        billingAccount = await BillingAccount.findOne({
          id: user.billingAccount
        });

        if (billingAccount && billingAccount.org) {
          org = await Org.findOne({
            id: billingAccount.org
          });
        }
      }

      // 3️⃣ Safe response (NO password, token, etc.)
      const responseData = {
        id: user.id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        phone: user.phone,

        address: billingAccount?.addressPart1 || null,
        city: billingAccount?.addressPart2 || null,
        state: billingAccount?.addressPart3 || null,
        postal_code: billingAccount?.addressPart4 || null,
        country: billingAccount?.addressPart5 || null,
        account: billingAccount?.bookkeepingId || null,

        company_name: org?.name || null
      };

      return res.json({
        status: true,
        status_code: 200,
        message: 'Details fetched successfully',
        data: responseData
      });

    } catch (error) {

      sails.log.error('Order details error:', error);

      return res.serverError({
        message: 'Failed to fetch order details',
        data: error
      });
    }
  }
};
