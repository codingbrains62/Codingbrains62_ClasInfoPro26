/**
 * User Service
 * Description: This service provides functions to interact with the user-related API endpoints, including adding a new user, fetching all users, and updating user information. It uses an authenticated fetch wrapper to ensure that all requests include the necessary authentication tokens.
 * Functions:
 * - addUserApi: Sends a POST request to add a new user with the provided payload.
 * - getUsersApi: Sends a GET request to retrieve all users from the server.
 * - updateUserApi: Sends a PUT request to update an existing user's information based on their ID and the provided payload.
 * Each function handles the API response, parsing the JSON data and returning an object containing the status code and the response data for further processing in the application.
 */

import { authFetch } from "./fetchWrapper";

/**
 * Add a new user
 * @description This function sends a POST request to the /add_user endpoint with the provided user data payload. It handles the API response and returns an object containing the status code and response data.
 * @param {object} payload - The user data to be added, including fields such as fullName, email, password, and SecurityLevel.
 * @returns {object} An object containing the status code and response data from the API.
 */
export async function addUserApi(payload) {
  const fetch = authFetch("/add_user");

  fetch.post(payload);

  await fetch.execute();

  let body = null;

  try {
    const txt = await fetch.response.value.text();
    body = txt ? JSON.parse(txt) : null;
  } catch (e) {
    body = null;
  }

  return {
    status: fetch.statusCode.value,
    data: body,
  };
}

/**
 * Get all users
 * @description This function sends a GET request to the /get_users endpoint to retrieve all users from the server. It handles the API response and returns an object containing the status code and response data.
 * @returns {object} An object containing the status code and response data from the API, which includes an array of user objects.
*/
export async function getUsersApi() {
  const fetch = authFetch(`/get_users?_t=${Date.now()}`);

  await fetch.execute();

  let body = null;
  try {
    const txt = await fetch.response.value.text();
    body = txt ? JSON.parse(txt) : null;
  } catch (e) {
    body = null;
  }

  return {
    status: fetch.statusCode.value,
    data: body,
  };
}

/**
 * Toggle client user status
 * @description This function sends a POST request to the /toggle_client_user_status endpoint with the ID of the client user to toggle their isDisabled status. It handles the API response and returns an object containing the status code and response data, which includes the new status of the user.
 * @param {number} id - The ID of the client user to toggle.
 * @returns {object} An object containing the status code and response data from the API, which includes the new status of the user.
 */
export async function userStatusApi(id) {
  const fetch = authFetch("/disable_user");
  fetch.post({ id });

  await fetch.execute();

  let body = null;
  try {
    const txt = await fetch.response.value.text();
    body = txt ? JSON.parse(txt) : null;
  } catch (e) {
    body = null;
  }

  return {
    status: fetch.statusCode.value,
    data: body,
  };
}

/**
 * Update user information
 * @description This function sends a PUT request to the /edit_user/{id} endpoint with the provided user data payload to update an existing user's information. It handles the API response and returns an object containing the status code and response data. 
 * @param {number} id - The ID of the user to be updated.
 * @param {object} payload - The updated user data, which may include fields such as fullName, email, password, and SecurityLevel.
 * @returns {object} An object containing the status code and response data from the API.
 */
export async function showProfileApi(id) {
  const fetch = authFetch("/show_profile");
  fetch.post({ id });

  await fetch.execute();

  let body = null;
  try {
    const txt = await fetch.response.value.text();
    body = txt ? JSON.parse(txt) : null;
  } catch (e) {
    body = null;
  }

  return {
    status: fetch.statusCode.value,
    data: body,
  };
}

/**
 * Update user information
 * @description This function sends a PUT request to the /edit_user/{id} endpoint with the provided user data payload to update an existing user's information. It handles the API response and returns an object containing the status code and response data.
 * @param {number} id - The ID of the user to be updated.
 * @param {object} payload - The updated user data, which may include fields such as fullName, email, password, and SecurityLevel.
 * @returns {object} An object containing the status code and response data from the API.
 */
export async function updateUserApi(id, payload) {
  // const fetch = authFetch(`/edit_user`);
     const fetch = authFetch(`/edit_user/${id}`);

  fetch.post(payload);

  await fetch.execute();

  let body = null;
  try {
    const txt = await fetch.response.value.text();
    body = txt ? JSON.parse(txt) : null;
  } catch (e) {
    body = null;
  }
  return {
    status: fetch.statusCode.value,
    data: body,
  };
}
/**
 * Get user
 */
export async function getUserByIdApi(id) {
  const fetch = authFetch(`/show_profile`);
 
  fetch.post({ id });
 
  await fetch.execute();
 
  let body = null;
 
  try {
    const txt = await fetch.response.value.text();
    body = txt ? JSON.parse(txt) : null;
  } catch (e) {
    body = null;
  }
 
  return {
    status: fetch.statusCode.value,
    data: body,
  };
}
