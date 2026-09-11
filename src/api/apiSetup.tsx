import { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import {
  addRequestInterceptor,
  addResponseInterceptor,
  removeRequestInterceptor,
  removeResponseInterceptor,
  type ApiRequestConfig
} from './httpClient'

export default function ApiSetup() {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const requestId = addRequestInterceptor((config: ApiRequestConfig) => {
      const token = window.localStorage.getItem('authToken') || import.meta.env.VITE_API_TOKEN || ''
      if (!token) return config
      return {
        ...config,
        headers: {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${token}`
        }
      }
    })

    const responseId = addResponseInterceptor(
      (payload) => payload,
      (error: unknown) => {
        const message = error instanceof Error ? error.message : 'Network error'
        enqueueSnackbar(message, { variant: 'error' })
        return error
      }
    )

    return () => {
      removeRequestInterceptor(requestId)
      removeResponseInterceptor(responseId)
    }
  }, [enqueueSnackbar])

  return null
}
