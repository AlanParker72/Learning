import { useMemo } from 'react'
import {
  actionsForRoles,
  isAdminRole,
  isReadOnlyRole,
  type DeliveryActionPermission,
  type UserRole
} from '../config/roles'
import { useAppConfig } from '../context/AppConfigContext'

export type CurrentUserRolesState = {
  roles: UserRole[]
  loading: boolean
  allowedActions: DeliveryActionPermission[]
  canAcknowledge: boolean
  canResend: boolean
  /** True when the user has any delivery row action permission (admin capability). */
  hasAnyAction: boolean
  /** True when the selected role is ADMIN. */
  canEdit: boolean
  /** True when the selected role is READ_ONLY. */
  isReadOnly: boolean
}

/**
 * Derives delivery action permissions from AppConfig.selectedRole (bootstrapped in main.tsx).
 */
export function useCurrentUserRoles(): CurrentUserRolesState {
  const { selectedRole } = useAppConfig()

  return useMemo(() => {
    const roles: UserRole[] = [selectedRole]
    const allowedActions = actionsForRoles(roles)
    const canEdit = isAdminRole(selectedRole)
    const isReadOnly = isReadOnlyRole(selectedRole) && allowedActions.length === 0
    return {
      roles,
      loading: false,
      allowedActions,
      canAcknowledge: allowedActions.includes('acknowledge'),
      canResend: allowedActions.includes('resend'),
      hasAnyAction: allowedActions.length > 0,
      canEdit,
      isReadOnly
    }
  }, [selectedRole])
}
