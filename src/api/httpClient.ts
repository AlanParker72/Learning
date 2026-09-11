import axios, { type AxiosRequestConfig } from 'axios'

/** When true, API modules return stub responses instead of calling the network. */
export const USE_STUBS = import.meta.env.VITE_USE_STUBS !== 'false'

const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE ?? ''

/** Minimal axios instance — credentials + common headers only (no auth tokens). */
export const http = axios.create({
  baseURL: ENV_API_BASE,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

/**
 * Override axios `baseURL` from bootstrap config (`main.tsx` → AppConfig).
 * Empty/undefined keeps the env fallback already set at create time.
 */
export function configureHttpClient(apiBaseUrl?: string): void {
  if (apiBaseUrl !== undefined && apiBaseUrl !== '') {
    http.defaults.baseURL = apiBaseUrl
  }
}

http.interceptors.request.use((config) => {
  config.headers.setAccept('application/json')
  if (config.data !== undefined && !config.headers.get('Content-Type')) {
    config.headers.setContentType('application/json')
  }
  return config
})

export class ApiError extends Error {
  status?: number
  body?: string

  constructor(message: string, status?: number, body?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

const toApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const body =
      typeof error.response?.data === 'string'
        ? error.response.data
        : error.response?.data != null
          ? JSON.stringify(error.response.data)
          : undefined
    throw new ApiError(error.message || 'Request failed', status, body)
  }
  throw error
}

export async function apiGet<TResponse>(
  url: string,
  params?: Record<string, string | number | boolean | undefined>,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  try {
    const response = await http.get<TResponse>(url, { ...config, params })
    return response.data
  } catch (error) {
    return toApiError(error)
  }
}

export async function apiPost<TResponse>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  try {
    const response = await http.post<TResponse>(url, data, config)
    return response.data
  } catch (error) {
    return toApiError(error)
  }
}

/** Small artificial delay so stub mode still feels like a network call. */
export const stubDelay = (ms = 120): Promise<void> =>
  new Promise((resolve) => window.setTimeout(resolve, ms))
