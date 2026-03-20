const ejs = require('ejs');
const path = require('path');

module.exports = {

  friendlyName: 'Send template email',

  description: 'Compile an email template with layout and return final HTML.',

  inputs: {

    template: {
      type: 'string',
      required: true
    },

    templateData: {
      type: 'ref',
      defaultsTo: {}
    },

    layout: {
      type: 'ref',
      defaultsTo: 'layout-email'
    }

  },

  exits: {
    success: {
      description: 'Template rendered successfully'
    }
  },

  fn: async function (inputs, exits) {

    const templatePath = path.resolve(
      sails.config.appPath,
      'views/emailTemplates',
      `${inputs.template}.ejs`
    );

    const bodyHtml = await ejs.renderFile(
      templatePath,
      inputs.templateData
    );

    if (inputs.layout === false) {
      return exits.success(bodyHtml);
    }

    const layoutPath = path.resolve(
      sails.config.appPath,
      'views/layouts',
      `${inputs.layout}.ejs`
    );

    const finalHtml = await ejs.renderFile(
      layoutPath,
      { ...inputs.templateData, body: bodyHtml }
    );

    return exits.success(finalHtml);
  }
};