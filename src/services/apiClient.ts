import axios from 'axios'

/**
 * Shared Axios instance.
 *
 * SECURITY: Real auth must attach session credentials here. The API must
 * derive role/permissions from the server session — never trust a client-sent
 * `role` query/body field for authorization. Client role is a UX hint only
 * (and used by the mock below for local RoleSwitcher demos).
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use((config) => {
  // Stub: attach auth token from session when wiring real backend.
  // const token = getSessionToken()
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
