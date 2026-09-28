/**
 * Canonical dashboard roles.
 * Add a new role here first, then wire permissions + config (see README).
 */
export const Role = {
  O_MANAGER: 'O_MANAGER',
  O_ANALYST: 'O_ANALYST',
  Q_MANAGER: 'Q_MANAGER',
  Q_ANALYST: 'Q_ANALYST'
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const ALL_ROLES: readonly Role[] = [
  Role.O_MANAGER,
  Role.O_ANALYST,
  Role.Q_MANAGER,
  Role.Q_ANALYST
]

export const ROLE_LABELS: Record<Role, string> = {
  [Role.O_MANAGER]: 'O Manager',
  [Role.O_ANALYST]: 'O Analyst',
  [Role.Q_MANAGER]: 'Q Manager',
  [Role.Q_ANALYST]: 'Q Analyst'
}

export function isRole(value: string): value is Role {
  return (ALL_ROLES as readonly string[]).includes(value)
}
