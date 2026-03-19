/**
 * Update client user profile and log changes
 * @description :: Server-side logic for updating client user details, logging changes, sending notifications, and handling sensitive changes.
 * @author :: Coding Brains
 *
 * @param {string} id - The ID of the client user to update (required).
 * @param {string} email - The new email address for the client user (optional).
 * @param {string} fullName - The new full name of the client user (optional).
 * @param {string} altemail - The new alternate email address for the client user (optional).
 * @param {string} phone - The new phone number of the client user (optional).
 * @param {string} cellphone - The new cell phone number of the client user (optional).
 * @param {string} security_Level - The new security level assigned to the client user (optional).
 * @param {string} billingaddressPart1 - The new first part of the billing address (optional).
 * @param {string} company_name - The new company/organization name (optional).
 * @returns {object} A success message if the user is updated successfully, or an error message if validation fails or server errors occur.
 */

module.exports = {
  friendlyName: 'Update client user',
  description: 'Update client user profile and log changes',

  inputs: {
    id: { type: 'string', required: true, description: 'Client user id' },
    email: { type: 'string', isEmail: true, allowNull: true },
    fullName: { type: 'string', allowNull: true },
    altemail: { type: 'string', allowNull: true },
    phone: { type: 'string', allowNull: true },
    cellphone: { type: 'string', allowNull: true },
    security_Level: { type: 'string', allowNull: true },
    billingaddressPart1: { type: 'string', allowNull: true },
    company_name: { type: 'string', allowNull: true },
    // password: { type: 'string', allowNull: true }
  },

  exits: {
    success: { statusCode: 200 },
    badRequest: { statusCode: 400 },
    notFound: { statusCode: 404 }
  },

  fn: async function (inputs, exits) {
    const req = this.req;
    const res = this.res;

    try {
      /* ---------------- VALIDATION ---------------- */
      const errors = [];
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const phoneRegex = /^\d{10}$/;
      const nameRegex = /^[a-zA-Z ]+$/;
      const companyRegex = /^[a-zA-Z!@#$%&*,. ]+$/;

      if (inputs.email && !emailRegex.test(inputs.email)) errors.push('Invalid email address');
      if (inputs.altemail && !emailRegex.test(inputs.altemail)) errors.push('Invalid alternate email');
      if (inputs.fullName && !nameRegex.test(inputs.fullName)) errors.push('Invalid full name');
      if (inputs.phone && !phoneRegex.test(inputs.phone)) errors.push('Phone number must be 10 digits');
      if (inputs.company_name && !companyRegex.test(inputs.company_name)) errors.push('Invalid company name');
      if (inputs.billingaddressPart1 !== undefined && !inputs.billingaddressPart1) {
            errors.push('Billing address cannot be empty');
          }
      if (errors.length > 0) {
        return res.json({
          record: { status: 'error', status_code: 400, message: errors }
        });
      }

      /* ---------------- FETCH CLIENT ---------------- */
      const client = await Client.findOne({ id: inputs.id });
      if (!client) {
        return res.json({
          record: { status: 'error', status_code: 404, message: 'Client not found' }
        });
      }

      /* ---------------- UPDATE CLIENT ---------------- */
      const updateData = {};
      if (inputs.fullName !== undefined) updateData.fullName = inputs.fullName;
      // if (inputs.email !== undefined) updateData.emailAddress = inputs.email;
      if (inputs.altemail !== undefined) updateData.alternateEmailAddress = inputs.altemail;
      if (inputs.phone !== undefined) updateData.phone = inputs.phone;
      if (inputs.cellphone !== undefined) updateData.cellPhone = inputs.cellphone;
      // if (inputs.security_Level !== undefined) updateData.SecurityLevel = inputs.security_Level;
      const currentUser = req.user;
       if (inputs.security_Level !== undefined) {
          if (!currentUser || currentUser.SecurityLevel !== 'Admin') {
            return res.json({
              record: {
                status: 'error',
                status_code: 403,
                message: 'Not authorized to change security level'
              }
            });
          }
          updateData.SecurityLevel = inputs.security_Level;
        }
        // if (inputs.password) {
        //   const hashed = await sails.helpers.passwords.hashPassword(inputs.password);
        //   updateData.password = hashed;
        // }

      if (Object.keys(updateData).length > 0) {
        await Client.updateOne({ id: inputs.id }).set(updateData);
      }

      /* ---------------- LOG HISTORY ---------------- */
      await HistoricalEvent.create({
        description: 'User profile updated successfully',
        actorId: inputs.id,
        actorType: 'Client',
        actorDisplayName: inputs.fullName || client.fullName,
        category: 'Other'
      });

      /* ---------------- TRACK CHANGES ---------------- */
      const editedFields = [];
      const trackChange = (column, oldVal, newVal) => {
        if (oldVal !== newVal && newVal !== undefined) {
          editedFields.push({ column, current_record: oldVal, new_record: newVal });
        }
      };

      trackChange('fullName', client.fullName, inputs.fullName);
      trackChange('alternateEmailAddress', client.alternateEmailAddress, inputs.altemail);
      trackChange('phone', client.phone, inputs.phone);
      trackChange('cellPhone', client.cellPhone, inputs.cellphone);
      trackChange('SecurityLevel', client.SecurityLevel, inputs.security_Level);
      trackChange('emailAddress', client.emailAddress, inputs.email);

      /* ---------------- SECURITY NOTIFICATION EMAIL ---------------- */
      /* ---------------- SECURITY NOTIFICATION EMAIL ---------------- */
    const updatedClient = await Client.findOne({ id: inputs.id });

  if (
  editedFields.length > 0 &&
  updatedClient.emailAddress &&
  updatedClient.emailAddress.trim() !== ""
) {

  console.log("Sending security mail to:", updatedClient.emailAddress);

  const html = await sails.helpers.sendTemplateEmail.with({
    template: 'securityEmail',
    templateData: {
      name: updatedClient.fullName,
      username: updatedClient.username,
      email: updatedClient.emailAddress,
      loginUrl: sails.config.custom.baseUrl,
      actionType: 'update',
      editedFields: editedFields,
      message: 'Your account profile has been updated. If you did not make this change, please contact support immediately.',
      subject: 'Security Alert - Profile Updated'
    }
  });

  await Mailer.sendMail(html, {
    to: updatedClient.emailAddress,
    subject: 'Security Alert - Profile Updated'
  });
}

      /* ---------------- BILLING / ORG REQUEST ---------------- */
      const requestChanges = [];
      if (inputs.email && client.emailAddress !== inputs.email) {
        requestChanges.push({ column: 'emailAddress', current_record: client.emailAddress, new_record: inputs.email });
      }

      const billingAccount = await BillingAccount.findOne({ id: client.billingAccount });
      if (billingAccount && billingAccount.addressPart1 !== inputs.billingaddressPart1) {
        requestChanges.push({ column: 'addressPart1', current_record: billingAccount.addressPart1, new_record: inputs.billingaddressPart1 });
      }

      const org = billingAccount ? await Org.findOne({ id: billingAccount.org }) : null;
      if (org && org.name !== inputs.company_name) {
        requestChanges.push({ column: 'Company Name', current_record: org.name, new_record: inputs.company_name });
      }

        if (requestChanges.length > 0) {

          const adminHtml = await sails.helpers.sendTemplateEmail.with({
            template: 'userUpdateRequest',
            templateData: {
              name: inputs.fullName || client.fullName,
              dataobj: requestChanges,
              request_page: 'edit',
              subject: 'Edit Request - User Profile Change'
            }
          });

          try {
            await Mailer.sendMail(adminHtml, {
              to: 'codingbrains62@gmail.com',
              subject: 'Edit Request - User Profile Change'
            });
          } catch (err) {
            sails.log.error('Failed to send admin edit request email:', err);
          }

          return res.json({
            record: { status: 'success', status_code: 200, message: 'Update request sent successfully' }
          });
        }

      /* ---------------- FINAL RESPONSE ---------------- */
      return res.json({
        status: 'success',
        status_code: 200,
        message: 'Record updated successfully',
        data: { clientId: client.id, fullName: inputs.fullName || client.fullName, email: inputs.email || client.emailAddress }
      });

    } catch (err) {
      sails.log.error(err);
      return res.json({ record: { status: 'error', status_code: 500, message: 'Internal Server Error' } });
    }
  }
};
