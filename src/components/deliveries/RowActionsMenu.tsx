import { Menu, MenuItem } from '@mui/material'
import type { DeliveryActionType } from '../../api/mockApi'
import type { DeliveryActionPermission } from '../../config/roles'

type RowActionsMenuProps = {
  anchorEl: HTMLElement | null
  onClose: () => void
  onAction: (action: DeliveryActionType) => void
  /** Role-derived actions to show. Empty → menu stays closed / unused. */
  allowedActions?: readonly DeliveryActionPermission[]
}

export default function RowActionsMenu({
  anchorEl,
  onClose,
  onAction,
  allowedActions = ['acknowledge', 'resend']
}: RowActionsMenuProps) {
  const showAcknowledge = allowedActions.includes('acknowledge')
  const showResend = allowedActions.includes('resend')

  if (!showAcknowledge && !showResend) {
    return null
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
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
