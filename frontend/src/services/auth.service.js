import { useFetch } from '@vueuse/core'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is not defined in .env')

export function loginApi(email, password) {
    return useFetch(`${API_BASE_URL}/login`)
    .post({ email, password })
    .json()
}

export function forgotPasswordApi(email) {
  return useFetch(
    `${API_BASE_URL}/forget_password?email=${encodeURIComponent(email)}`
  )
    .post()
    .json()
}

export function verifyForgotTokenApi(token) {
  return useFetch(
    `${API_BASE_URL}/forget_password_link/${token}`
  ).get().json()
}

export function resetPasswordApi(token, password) {
  return useFetch(`${API_BASE_URL}/reset_password`)
    .post({ token, password })
    .json()
}
