import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { configureHttpClient } from '../api/httpClient'
import { DEFAULT_APP_CONFIG, type AppConfig } from '../config/appConfig'

const AppConfigContext = createContext<AppConfig>(DEFAULT_APP_CONFIG)

type AppConfigProviderProps = {
  config: AppConfig
  children: ReactNode
}

export function AppConfigProvider({ config, children }: AppConfigProviderProps) {
  useEffect(() => {
    configureHttpClient(config.apiBaseUrl)
  }, [config.apiBaseUrl])

  return <AppConfigContext.Provider value={config}>{children}</AppConfigContext.Provider>
}

export function useAppConfig(): AppConfig {
  return useContext(AppConfigContext)
}
