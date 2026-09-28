import type { ReactNode } from 'react'
import type { Permission } from './permissions'
import { usePermission } from './usePermission'

type CanProps = {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

/** Capability gate — prefer over `role === …` in presentational UI. */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = usePermission()
  if (!can(permission)) return <>{fallback}</>
  return <>{children}</>
}
