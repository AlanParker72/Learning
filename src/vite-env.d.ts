/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK_API?: string
  readonly VITE_API_BASE_URL?: string
  /** Sentinel task id for list-on-load claim URL path param. */
  readonly VITE_WORKFLOW_TASK_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
