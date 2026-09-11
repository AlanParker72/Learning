export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type ApiRequestConfig<TResponse = unknown> = {
  method?: HttpMethod
  url: string
  params?: Record<string, string | number | boolean | undefined>
  headers?: Record<string, string>
  data?: unknown
  mockResponse?: TResponse
}

type RequestInterceptor = {
  fulfilled?: (config: ApiRequestConfig) => ApiRequestConfig
  rejected?: (error: unknown) => unknown
}

type ResponseInterceptor = {
  fulfilled?: <T>(value: T) => T
  rejected?: (error: unknown) => unknown
}

const requestInterceptors: RequestInterceptor[] = []
const responseInterceptors: ResponseInterceptor[] = []

export function addRequestInterceptor(
  fulfilled: (config: ApiRequestConfig) => ApiRequestConfig,
  rejected?: (error: unknown) => unknown
): number {
  return requestInterceptors.push({ fulfilled, rejected }) - 1
}

export function addResponseInterceptor(
  fulfilled: <T>(value: T) => T,
  rejected?: (error: unknown) => unknown
): number {
  return responseInterceptors.push({ fulfilled, rejected }) - 1
}

export function removeRequestInterceptor(id: number): void {
  delete requestInterceptors[id]
}

export function removeResponseInterceptor(id: number): void {
  delete responseInterceptors[id]
}

const USE_STUBS = import.meta.env.VITE_USE_STUBS !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

function buildUrl(path: string, params?: ApiRequestConfig['params']): string {
  const isAbsolute = /^https?:\/\//i.test(path)
  const url = `${isAbsolute ? '' : API_BASE}${path}`
  const searchParams = new URLSearchParams()

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `${url}?${query}` : url
}

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

export async function apiRequest<TResponse = unknown>(config: ApiRequestConfig<TResponse>): Promise<TResponse> {
  let requestConfig: ApiRequestConfig<TResponse> = {
    ...config,
    method: config.method ?? 'GET',
    headers: { Accept: 'application/json', ...(config.headers ?? {}) }
  }

  for (const interceptor of requestInterceptors) {
    if (!interceptor?.fulfilled) continue
    try {
      requestConfig = interceptor.fulfilled(requestConfig) as ApiRequestConfig<TResponse>
    } catch (error) {
      interceptor.rejected?.(error)
    }
  }

  if (USE_STUBS && config.mockResponse !== undefined) {
    await new Promise((resolve) => window.setTimeout(resolve, 160))
    return config.mockResponse
  }

  const url = buildUrl(requestConfig.url, requestConfig.params)
  const headers: Record<string, string> = { ...(requestConfig.headers ?? {}) }
  const fetchOptions: RequestInit = {
    method: requestConfig.method,
    headers
  }

  if (requestConfig.method && requestConfig.method !== 'GET' && requestConfig.data !== undefined) {
    fetchOptions.body = typeof requestConfig.data === 'string' ? requestConfig.data : JSON.stringify(requestConfig.data)
    if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
  }

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      const body = await response.text().catch(() => undefined)
      throw new ApiError(`Request failed: ${response.status} ${response.statusText}`, response.status, body)
    }

    const contentType = response.headers.get('content-type') ?? ''
    const payload = contentType.includes('application/json') ? await response.json() : await response.text()

    let finalPayload = payload as TResponse
    for (const interceptor of responseInterceptors) {
      if (interceptor?.fulfilled) {
        finalPayload = interceptor.fulfilled(finalPayload)
      }
    }

    return finalPayload
  } catch (error) {
    let finalError: unknown = error
    for (const interceptor of responseInterceptors) {
      if (interceptor?.rejected) {
        finalError = interceptor.rejected(finalError)
      }
    }
    throw finalError
  }
}
