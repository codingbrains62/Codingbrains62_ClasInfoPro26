/* * This file defines a custom fetch wrapper that includes the authentication token in the headers of each request.
 * It uses the useFetch hook from @vueuse/core to manage the fetch state and response.
 * The authFetch function takes a URL and options, retrieves the token from localStorage, and sets the Authorization header if the token exists.
 * The API base URL is defined in an environment variable for flexibility across different environments (development, production, etc.).
 */

import { useFetch } from "@vueuse/core";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
 //console.log(import.meta.env.VITE_API_BASE_URL)
export function authFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  //console.log("Token in authFetch:", token);
  return useFetch(`${API_BASE_URL}${url}`, {
    immediate: false,
    ...options,
    beforeFetch({ options }) {
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };
      }
      return { options };
    },
  });
}
