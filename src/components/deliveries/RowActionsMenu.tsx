import { Menu, MenuItem } from '@mui/material'
import type { DeliveryActionType } from '../../api/mockApi'

type RowActionsMenuProps = {
  anchorEl: HTMLElement | null
  onClose: () => void
  onAction: (action: DeliveryActionType) => void
}

export default function RowActionsMenu({
  anchorEl,
  onClose,
  onAction
}: RowActionsMenuProps) {
  return (
    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem
        onClick={() => {
          onAction('acknowledge')
          onClose()
        }}
      >
        Acknowledge
      </MenuItem>
      <MenuItem
        onClick={() => {
          onAction('resend')
          onClose()
        }}
      >
        Resend
      </MenuItem>
    </Menu>
  )
}
