/**
     * Add Client User
     *
     * @description :: Create a new client user with associated org and billing account, and send a security email.
     * @help        :: See https://sailsjs.com/docs/concepts/actions for more details on actions.
     * @api {post} /api/v1/add_user Add a new client user
     * @author Coding Brains
     *
     * @param {string} username - The desired username for the client user (required).
     * @param {string} password - The desired password for the client user (required).
     * @param {string} fullName - The full name of the client user (required).
     * @param {string} email - The email address of the client user (required).
     * @param {string} altemail - An alternate email address for the client user (optional).
     * @param {string} phone - The phone number of the client user (required).
     * @param {string} cellphone - The cell phone number of the client user (optional).
     * @param {string} security_Level - The security level assigned to the client user (required).
     * @param {string} billingaddressPart1 - The first part of the billing address for the client user (required).
     * @param {string} company_name - The name of the company/organization associated with the client user (required).
     * @param {number} created_by - The ID of the user who is creating this client user (required).
     *
     * @returns {object} A success message if the user is created successfully, or an error message if there are validation issues or server errors.
     *                  mail sent to user on successful creation of account
**/
module.exports = {

  friendlyName: 'Add client user',

  description: 'Create a new client user',

  inputs: {
    username: { type: 'string', required: true },
    password: { type: 'string', required: true },
    fullName: { type: 'string', required: true },
    email: { type: 'string', required: true },
    alternateEmailAddress: { type: 'string' },
    phone: { type: 'string', required: true },
    cellPhone: { type: 'string' },
    security_Level: { type: 'string', required: true },
    billingaddressPart1: { type: 'string', required: true },
    company_name: { type: 'string', required: true },
  },

  exits: {
    success: { statusCode: 200 },
    validationError: { statusCode: 400 },
    conflict: { statusCode: 409 },
    serverError: { statusCode: 500 }
  },

  fn: async function (inputs, exits) {
    sails.log('🔥 ADD USER API HIT');
    const loggedInUser = this.req.user;
    if (!loggedInUser) {
      return exits.serverError({
        status: 'error',
        message: 'Unauthorized'
      });
    }
    const createdBy = loggedInUser.id;
    try {
      /* ---------------- VALIDATION ---------------- */
      const errors = [];
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      const alphaRegex = /^[A-Za-z ]+$/;
      const phoneRegex = /^\d{10}$/;

      if (!emailRegex.test(inputs.email)) errors.push('Invalid email address');
      if (!passwordRegex.test(inputs.password)) errors.push('Weak password');
      if (!alphaRegex.test(inputs.company_name)) errors.push('Invalid company name');
      if (!alphaRegex.test(inputs.fullName)) errors.push('Invalid full name');
      if (!phoneRegex.test(inputs.phone)) errors.push('Phone must be 10 digits');

      if (inputs.altemail) {
        if (!emailRegex.test(inputs.altemail)) errors.push('Invalid alternate email');
        if (inputs.email === inputs.altemail) errors.push('Emails must be different');
      }

      if (errors.length) {
        return exits.validationError({
          status: 'error',
          status_code: 400,
          message: errors
        });
      }

      /* ---------------- DUPLICATE CHECK ---------------- */
      const existingUser = await Client.findOne({ username: inputs.username });
      if (existingUser) {
        return exits.conflict({
          status: 'error',
          status_code: 409,
          message: 'Username already exists'
        });
      }

      /* ---------------- CREATE ORG ---------------- */
      const org = await Org.create({ name: inputs.company_name, category: 'ABL/Factor' }).fetch();

      /* ---------------- CREATE BILLING ACCOUNT ---------------- */
      const billingAccount = await BillingAccount.create({
        addressPart1: inputs.billingaddressPart1,
        org: org.id
      }).fetch();

      /* ---------------- CREATE CLIENT ---------------- */

      const client = await Client.create({
        username: inputs.username,
        password: inputs.password, // auto-hashed in model
        fullName: inputs.fullName,
        emailAddress: inputs.email,
        alternateEmailAddress: inputs.alternateEmailAddress,
        phone: inputs.phone,
        cellPhone: inputs.cellPhone,
        SecurityLevel: inputs.security_Level,
        billingAccount: billingAccount.id,
        mandate: 'Corporate',
        createdBy: createdBy
      }).fetch();

      /* ---------------- POST UPDATE ---------------- */

      await Client.updateOne({ id: client.id })
        .set({ WebsiteLinkID: client.id, bookkeepingId: client.id });

      await BillingAccount.updateOne({ id: billingAccount.id })
        .set({ WebsiteLinkID: client.id, bookkeepingId: client.id });

      /* ---------------- LOG ---------------- */

      await HistoricalEvent.create({
        description: 'Client user created',
        actorId: client.id,
        actorType: 'Client',
        actorDisplayName: inputs.fullName,
        category: 'Other'
      });

      /* ---------------- SECURITY EMAIL ---------------- */
    const html = await sails.helpers.sendTemplateEmail.with({
        template: 'securityEmail',
        templateData: {
        name: inputs.fullName,
        username: inputs.username,
        email: inputs.email,
        loginUrl: sails.config.custom.baseUrl,
        actionType: 'create',
        editedFields: [],
        message: 'Welcome to ClasInfo Pro. Your account has been successfully created.',
        subject: 'Security Alert - Account Created'
      },
      });
      try {
        await Mailer.sendMail(html, {
          to: inputs.email,
          subject: 'Security Alert - Account Created',
          replyTo: inputs.email
        });
      } catch (err) {
        sails.log.error('Failed to send security email:', err);
      }

      /* ---------------- RESPONSE ---------------- */
      return exits.success({
        status: 'success',
        status_code: 200,
        message: 'User added successfully'
      });

    } catch (err) {

      sails.log.error(err);
      return exits.serverError({
        status: 'error',
        status_code: 500,
        message: 'Internal server error'
      });

    }
  }

};
