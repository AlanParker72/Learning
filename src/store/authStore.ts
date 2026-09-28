import { create } from 'zustand'
import { Role } from '../rbac/roles'

type AuthState = {
  /**
   * TEMP: driven by RoleSwitcher for local demo.
   * Production auth should set roles from the session and ignore the switcher.
   * Backend must never trust client-supplied role for authorization.
   */
  roles: Role[]
  activeRole: Role
  setActiveRole: (role: Role) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  roles: [Role.O_MANAGER],
  activeRole: Role.O_MANAGER,
  setActiveRole: (role) => set({ activeRole: role, roles: [role] })
}))
