export type ApiRequestConfig<TResponse = unknown> = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  params?: Record<string, string | number | undefined>
  headers?: Record<string, string>
  data?: any
  mockResponse?: TResponse
}

type Interceptor = {
  fulfilled?: (value: any) => any
  rejected?: (error: any) => any
}

const requestInterceptors: Interceptor[] = []
const responseInterceptors: Interceptor[] = []

export const apiInterceptors = {
  request: requestInterceptors,
  response: responseInterceptors
}

export function addRequestInterceptor(fulfilled: (cfg: any) => any, rejected?: (err: any) => any) {
  requestInterceptors.push({ fulfilled, rejected })
}

export function addResponseInterceptor(fulfilled: (value: any) => any, rejected?: (err: any) => any) {
  responseInterceptors.push({ fulfilled, rejected })
}

// Environment-driven behavior
const USE_STUBS = typeof import.meta !== 'undefined' && (import.meta as any).env && ((import.meta as any).env.VITE_USE_STUBS === 'true' || (import.meta as any).env.VITE_USE_STUBS === undefined)
const API_BASE = typeof import.meta !== 'undefined' && (import.meta as any).env ? ((import.meta as any).env.VITE_API_BASE || '') : ''

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const isAbsolute = /^https?:\/\//i.test(path)
  const base = isAbsolute ? '' : API_BASE
  const url = `${base}${path}`
  const searchParams = new URLSearchParams()
  Object.keys(params ?? {}).forEach((key) => {
    const value = params?.[key]
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  return `${url}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
}

export async function apiRequest<TResponse = unknown>(config: ApiRequestConfig<TResponse>): Promise<TResponse> {
  let requestConfig = {
    ...config,
    method: config.method ?? 'GET',
    headers: { 'Accept': 'application/json', ...(config.headers ?? {}) }
  }

  // run request interceptors (sync)
  for (const interceptor of requestInterceptors) {
    if (interceptor.fulfilled) {
      // allow interceptor to modify config
      // wrap in try to allow rejected handlers to run
      try {
        requestConfig = interceptor.fulfilled(requestConfig)
      } catch (err) {
        if (interceptor.rejected) interceptor.rejected(err)
      }
    }
  }

  // If using stubs and mockResponse provided, return mock quickly
  if (USE_STUBS && config.mockResponse !== undefined) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(config.mockResponse as TResponse), 150)
    })
  }

  const url = buildUrl(requestConfig.url, requestConfig.params)

  const fetchOptions: RequestInit = {
    method: requestConfig.method,
    headers: requestConfig.headers
  }

  if (requestConfig.method && requestConfig.method.toUpperCase() !== 'GET' && requestConfig.data !== undefined) {
    fetchOptions.body = typeof requestConfig.data === 'string' ? requestConfig.data : JSON.stringify(requestConfig.data)
    if (!fetchOptions.headers) fetchOptions.headers = {}
    // ensure content-type if not provided
    if (!(fetchOptions.headers as Record<string, string>)['Content-Type']) {
      (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json'
    }
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const errorPayload = await response.text().catch(() => null)
      const err = new Error(`Request failed: ${response.status} ${response.statusText}`)
      ;(err as any).status = response.status
      ;(err as any).body = errorPayload
      throw err
    }

    const contentType = response.headers.get('content-type') || ''
    const payload = contentType.includes('application/json') ? (await response.json()) : (await response.text())

    let finalPayload = payload as TResponse
    for (const interceptor of responseInterceptors) {
      if (interceptor.fulfilled) {
        finalPayload = interceptor.fulfilled(finalPayload)
      }
    }

    return finalPayload
  } catch (error) {
    let finalError = error
    for (const interceptor of responseInterceptors) {
      if (interceptor.rejected) {
        finalError = interceptor.rejected(finalError)
      }
    }

    throw finalError
  }
}
