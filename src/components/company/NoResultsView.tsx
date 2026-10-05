/**
 * Local stand-in for the company NoResultsView.
 * Replace with the company package export when available (same swap as DataTable).
 */
import { Box, Typography } from '@mui/material'

type Props = {
  message?: string
}

export function NoResultsView({
  message = 'No records for this tab / filters.'
}: Props) {
  return (
    <Box sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default NoResultsView
