/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_STUBS?: string
  readonly VITE_API_BASE?: string
  readonly VITE_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
