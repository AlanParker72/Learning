import { useEffect, useMemo, useState } from 'react'
import {
  actionsForRoles,
  fetchCurrentUserRoles,
  type DeliveryActionPermission,
  type UserRole
} from '../config/roles'

export type CurrentUserRolesState = {
  roles: UserRole[]
  loading: boolean
  allowedActions: DeliveryActionPermission[]
  canAcknowledge: boolean
  canResend: boolean
  hasAnyAction: boolean
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
    return {
      roles,
      loading,
      allowedActions,
      canAcknowledge: allowedActions.includes('acknowledge'),
      canResend: allowedActions.includes('resend'),
      hasAnyAction: allowedActions.length > 0
    }
  }, [loading, roles])
}
