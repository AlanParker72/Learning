import axios from 'axios'

/**
 * Shared Axios stub.
 *
 * SECURITY: Real auth must attach session credentials here. The API must
 * derive role/permissions from the server session — never trust a client-sent
 * `role` query/body field for authorization.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' }
})

apiClient.interceptors.request.use((config) => {
  // TODO: attach auth token from session when wiring real backend.
  return config
})
