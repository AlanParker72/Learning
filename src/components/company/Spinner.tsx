/**
 * Local stand-in for the company Spinner.
 * Replace with the company package export when available (same swap as DataTable).
 */
import { Box, CircularProgress } from '@mui/material'

type Props = {
  size?: number
}

export function Spinner({ size = 32 }: Props) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress size={size} />
    </Box>
  )
}

export default Spinner
