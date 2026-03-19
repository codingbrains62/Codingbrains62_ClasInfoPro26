/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  //Start Authentication & User Management
  'POST /api/v1/login': { action: 'client/validate-login' },
  'POST /api/v1/add_user': { action: 'client/add-client-user' },
  'POST /api/v1/edit_user': { action: 'client/update-client-user' },
  'POST /api/v1/disable_user': { action: 'client/disable-client-user' },
  'POST /api/v1/remove_user': { action: 'client/remove-user' },
  

  //End Authentication & User Management
   //Start forget password flow
  'POST /api/v1/forget_password': {  action: 'client/forget-password'},
  'GET  /api/v1/forget_password_link/:token': { action: 'client/forget-password-link'},
  'POST /api/v1/reset_password': { action: 'client/reset-password' },
   //End forget password flow 
   //Start Passkey login
  'POST /api/v1/passkey/register': { action: 'client/passkey-register' },
  'POST /api/v1/passkey/register/verify': { action: 'client/passkey-register-verify' },
  'POST /api/v1/passkey/login': { action: 'client/passkey-login' },
  'POST /api/v1/passkey/login/verify': { action: 'client/passkey-login-verify' },
  'GET /api/v1/test-passkey-db': { action: 'client/test-passkey'},
   // End Passkey login
   // Start Profile & Place an order
   'POST /api/v1/show_profile':{action:'show-profile'},
   'POST /api/v1/get_details_place_an_order': { action: 'get-details-place-an-order' },
   'get /api/v1/get_users': { action: 'get-user-by' },
   // End Profile & Place an order


  'POST /api/v1/contact-us': { action: 'contact-us' },
  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/
};
