import { UserRole, type UserRole as UserRoleType } from './roles'

/**
 * Bootstrap configuration passed from the app entry (`main.tsx`).
 * Prefer wiring real host/auth values here instead of hardcoding in leaves.
 */
export type AppConfig = {
  /** Roles available in this deployment. */
  roles: readonly UserRoleType[]
  /** Current user's role — drives Acknowledge/Resend menu visibility. */
  selectedRole: UserRoleType
  /** Axios `baseURL`. Empty string keeps relative URLs / env fallback already applied. */
  apiBaseUrl: string
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  roles: [UserRole.ADMIN, UserRole.READ_ONLY],
  selectedRole: UserRole.ADMIN,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE ?? ''
}
