import { useEffect, useMemo, useState } from 'react'
import {
  actionsForRoles,
  fetchCurrentUserRoles,
  isEditRole,
  isReadOnlyRole,
  type DeliveryActionPermission,
  type UserRole
} from '../config/roles'

export type CurrentUserRolesState = {
  roles: UserRole[]
  loading: boolean
  allowedActions: DeliveryActionPermission[]
  canAcknowledge: boolean
  canResend: boolean
  /** True when the user has any delivery row action permission (edit capability). */
  hasAnyAction: boolean
  /** True when at least one role is EDIT. */
  canEdit: boolean
  /** True when roles are present and none grant edit/actions. */
  isReadOnly: boolean
}

/**
 * Loads current-user roles (mock stub today) and derives delivery action permissions.
 */
export function useCurrentUserRoles(): CurrentUserRolesState {
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void fetchCurrentUserRoles()
      .then((next) => {
        if (!cancelled) setRoles(next)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(() => {
    const allowedActions = actionsForRoles(roles)
    const canEdit = roles.some(isEditRole)
    const isReadOnly =
      roles.length > 0 && roles.every(isReadOnlyRole) && allowedActions.length === 0
    return {
      roles,
      loading,
      allowedActions,
      canAcknowledge: allowedActions.includes('acknowledge'),
      canResend: allowedActions.includes('resend'),
      hasAnyAction: allowedActions.length > 0,
      canEdit,
      isReadOnly
    }
  }, [loading, roles])
}
