/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

   '*': 'authenticated',
  //  'client/add-client-user': true,
  'client/validate-login': true,
  'forget-password': true,
  'forget-password-link': true,
  'reset-login': true,
  'Forgetpassword1Controller': true,
  //'client/passkey-register': true,
  // 'Udpate-client-user': true,
  'client/passkey-login': true,
  'client/passkey-login-verify': true,
  'client/test-passkey': true,

  'contact-us': true,
  'client/forget-password': true,
  'client/forget-password-link': true,
  'client/reset-password': true
};
