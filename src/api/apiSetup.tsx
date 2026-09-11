import React, { useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { addRequestInterceptor, addResponseInterceptor } from './httpClient'

// ApiSetup registers global API interceptors:
// - request interceptor adds Authorization header when token present
// - response interceptor reports errors via notistack snackbar

export default function ApiSetup() {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    // Request interceptor: attach Authorization header if token available
    addRequestInterceptor((cfg: any) => {
      try {
        const token = localStorage.getItem('authToken') || (import.meta as any).env?.VITE_API_TOKEN || ''
        if (token) {
          cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` }
        }
      } catch (e) {
        // ignore
      }
      return cfg
    })

    // Response interceptor: on success pass through, on error show toast and rethrow
    addResponseInterceptor(
      (payload: any) => payload,
      (err: any) => {
        try {
          const message = (err && (err.message || err.body)) || 'Network error'
          enqueueSnackbar(String(message), { variant: 'error' })
        } catch (e) {
          // ignore
        }
        return err
      }
    )
  }, [enqueueSnackbar])

  return null
}
