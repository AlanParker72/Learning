import { create } from 'zustand'
import { isRole, Role } from '../rbac/roles'

function resolveDefaultRole(): Role {
  const fromEnv = import.meta.env.VITE_DEFAULT_ROLE
  if (typeof fromEnv === 'string' && isRole(fromEnv)) {
    return fromEnv
  }
  return Role.Q_MANAGER
}

const defaultRole = resolveDefaultRole()

type AuthState = {
  /**
   * Active role from session/env (default Q_MANAGER or VITE_DEFAULT_ROLE).
   * No UI RoleSwitcher — production auth should set roles from the session.
   * Backend must never trust client-supplied role for authorization.
   */
  roles: Role[]
  activeRole: Role
  setActiveRole: (role: Role) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  roles: [defaultRole],
  activeRole: defaultRole,
  setActiveRole: (role) => set({ activeRole: role, roles: [role] })
}))
