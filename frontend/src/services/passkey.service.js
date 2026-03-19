// services/passkey.service.js
import { useFetch } from '@vueuse/core'

const API = import.meta.env.VITE_API_BASE_URL
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  return user?.token
}
const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json'
})
export const getPasskeyOptions = (email) =>
  useFetch(`${API}/passkey/register`, {
      headers: authHeaders(),
      credentials: 'include',
  })
  .post({ email })
  .json()

export const verifyPasskey = (payload) =>
 useFetch(`${API}/passkey/register/verify`, {
      headers: authHeaders(),
      credentials: 'include',
  })
  .post(payload)
  .json()


export const getPasskeyLoginOptions = (email) =>
  useFetch(`${API}/passkey/login`, { credentials: 'include' })
    .post({ email })
    .json();

export const verifyPasskeyLogin = (payload) =>
  useFetch(`${API}/passkey/login/verify`, { credentials: 'include' })
    .post(payload)
    .json();

