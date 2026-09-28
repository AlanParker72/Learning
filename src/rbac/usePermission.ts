import { useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import type { Permission } from './permissions'
import { permissionsForRoles } from './rolePermissions'

/**
 * Derives the effective permission set from the current auth role(s)
 * and exposes `can(permission)`.
 */
export function usePermission() {
  const roles = useAuthStore((s) => s.roles)

  const permissions = useMemo(() => permissionsForRoles(roles), [roles])

  const can = (permission: Permission): boolean => permissions.has(permission)

  return { roles, permissions, can }
}
