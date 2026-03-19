import { useFetch } from "@vueuse/core";

const API = import.meta.env.VITE_API_BASE_URL;

// Contact form submit
export const contactApi = async (payload) => {
  try {
    const { data, error } = await useFetch(`${API}/contact-us`)
      .post(payload)
      .json();
    return { data: data.value, error: error.value };
  } catch (err) {
    return { data: null, error: err };
  }
};

// Get user autofill data
export const getUserDetailsApi = async (payload) => {
  try {
    const { data, error } = await useFetch(`${API}/get_details_place_an_order`)
      .post(payload)
      .json();
    return { data: data.value, error: error.value };
  } catch (err) {
    return { data: null, error: err };
  }
};