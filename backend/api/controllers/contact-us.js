/**
 * Contact Us Controller
 * @description This controller handles the submission of the contact form and sends an email to the site administrators.
 * @author Coding Brains
 * 
 * @param {string} name - The name of the person submitting the contact form
 * @param {string} email - The email address of the person submitting the contact form
 * @param {string} comments - The comments or message from the person submitting the contact form
 * @returns {object} A response object indicating the success or failure of the email sending process
 *  Mail is sent to Admin email address with the details of the contact form submission. 
 * The response object contains a status, status code, and a message indicating whether the submission was successful or if there was an error.
 * 
*/

module.exports = {

  friendlyName: 'Submit Contact Form',

  description: 'Send contact form email',

  inputs: {

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true,
      isEmail: true
    },

    comments: {
      type: 'string',
      required: true
    }

  },

  exits: {

    success: {
      description: 'Email sent successfully'
    },

    error: {
      description: 'Something went wrong'
    }

  },

  fn: async function (inputs, exits) {

    try {

      // Prepare mail data
      const mailData = {
        name: inputs.name,
        email: inputs.email,
        comments: inputs.comments
      };

      const html = await sails.helpers.sendTemplateEmail.with({
        template: 'contactusmail',
        templateData: {
          ...mailData,
          subject: 'New Contact Message - ClasInfo Pro'
        },
        layout: false
      });

      try {
        await Mailer.sendMail(html, {
          to: 'codingbrains62@gmail.com',
          subject: 'New Contact Message - ClasInfo Pro',
          replyTo: inputs.email
        });
      } catch (err) {
        sails.log.error('Mailer sendMail failed:', err);
        throw new Error('Email sending failed');
      }
      return exits.success({
        status: true,
        status_code: 200,
        message: 'YOUR COMMENTS HAVE BEEN SUBMITTED'
      });

    } catch (error) {

      sails.log.error('Contact Email Error:', error);

      return exits.error({
        status: false,
        status_code: 500,
        message: 'Internal server error'
      });

    }

  }

};