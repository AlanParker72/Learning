import { Menu, MenuItem } from '@mui/material'
import type { DeliveryActionType } from '../../api/deliveriesApi'
import type { DeliveryActionPermission } from '../../config/roles'
import { usePortalContainer } from '../../embed/PortalContainerContext'

type RowActionsMenuProps = {
  anchorEl: HTMLElement | null
  onClose: () => void
  onAction: (action: DeliveryActionType) => void
  /** Role-derived actions to show. Empty → menu stays closed / unused. */
  allowedActions?: readonly DeliveryActionPermission[]
  /** When false, Resend is hidden even if the role allows it. */
  manualRetryAllowed?: boolean
}

export default function RowActionsMenu({
  anchorEl,
  onClose,
  onAction,
  allowedActions = ['acknowledge', 'resend'],
  manualRetryAllowed = true
}: RowActionsMenuProps) {
  const portalContainer = usePortalContainer() ?? undefined
  const showAcknowledge = allowedActions.includes('acknowledge')
  const showResend = allowedActions.includes('resend') && manualRetryAllowed

  if (!showAcknowledge && !showResend) {
    return null
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      container={portalContainer}
      disableScrollLock
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {showAcknowledge && (
        <MenuItem
          onClick={() => {
            onAction('acknowledge')
            onClose()
          }}
        >
          Acknowledge
        </MenuItem>
      )}
      {showResend && (
        <MenuItem
          onClick={() => {
            onAction('resend')
            onClose()
          }}
        >
          Resend
        </MenuItem>
      )}
    </Menu>
  )
}
