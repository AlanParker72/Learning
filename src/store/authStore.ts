import { create } from 'zustand'
import { Role } from '../rbac/roles'

type AuthState = {
  /**
   * TEMP: driven by RoleSwitcher for local demos.
   * Production auth should set roles from the session.
   * Backend must never trust client-supplied role for authorization.
   */
  roles: Role[]
  activeRole: Role
  setActiveRole: (role: Role) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  roles: [Role.Q_MANAGER],
  activeRole: Role.Q_MANAGER,
  setActiveRole: (role) => set({ activeRole: role, roles: [role] })
}))
