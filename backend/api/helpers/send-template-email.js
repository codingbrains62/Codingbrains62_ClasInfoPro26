const ejs = require('ejs');
const path = require('path');

module.exports = {

  friendlyName: 'Send template email',

  description: 'Compile an email template with layout and return final HTML.',

  inputs: {

    template: {
      description: 'Template name inside views/emailTemplates (without .ejs)',
      type: 'string',
      required: true
    },

    templateData: {
      description: 'Data accessible inside EJS template',
      type: 'ref',
      defaultsTo: {}
    },

    layout: {
      description: 'Layout file inside views/layouts (without .ejs). Set false to disable layout.',
      type: 'ref',
      defaultsTo: 'layout-email'
    }

  },

  fn: async function (inputs) {

    const templatePath = path.resolve( sails.config.appPath, 'views/emailTemplates', `${inputs.template}.ejs` );
    // 1️⃣ Render main template (body)
    const bodyHtml = await ejs.renderFile(
      templatePath,
      inputs.templateData
    );
    // 2️⃣ If layout disabled, return body only
    if (inputs.layout === false) {
      return bodyHtml;
    }
    // 3️⃣ Render layout
    const layoutPath = path.resolve( sails.config.appPath, 'views/layouts', `${inputs.layout}.ejs`);
    const finalHtml = await ejs.renderFile( layoutPath,
      {...inputs.templateData,  body: bodyHtml}
    );
    return finalHtml;
  }
};
