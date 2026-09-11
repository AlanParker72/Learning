import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { brand } from '../../theme/brand'
import { formatNumber } from '../../utils/format'

type DeliveryPaginationProps = {
  page: number
  pageSize: number
  total: number
  pageCount: number
  pageNumbers: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export default function DeliveryPagination({
  page,
  pageSize,
  total,
  pageCount,
  pageNumbers,
  onPageChange,
  onPageSizeChange
}: DeliveryPaginationProps) {
  const from = total === 0 ? 0 : Math.min((page - 1) * pageSize + 1, total)
  const to = Math.min(page * pageSize, total)

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, px: 0.5, flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Showing {formatNumber(from)} to {formatNumber(to)} of {formatNumber(total)} results
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
        <TextField
          select
          size="small"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          sx={{ minWidth: 128, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        >
          {[10, 25, 50, 100].map((option) => (
            <MenuItem key={option} value={option}>{option} per page</MenuItem>
          ))}
        </TextField>

        <Button size="small" variant="outlined" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))} sx={{ minWidth: 36, borderRadius: 1.5 }}>
          ‹
        </Button>

        {pageNumbers.map((pageNumber, index, array) => {
          const prev = index > 0 ? array[index - 1] : null
          const gap = prev !== null && pageNumber - prev > 1
          const active = page === pageNumber

          return (
            <Stack key={pageNumber} direction="row" spacing={1} alignItems="center">
              {gap && <Typography variant="body2" color="text.secondary">...</Typography>}
              <Button
                size="small"
                variant={active ? 'contained' : 'outlined'}
                onClick={() => onPageChange(pageNumber)}
                sx={{
                  minWidth: 36,
                  borderRadius: 1.5,
                  background: active ? brand.tableHeader : undefined,
                  '&:hover': { background: active ? brand.tableHeader : undefined }
                }}
              >
                {pageNumber}
              </Button>
            </Stack>
          )
        })}

        <Button size="small" variant="outlined" disabled={page >= pageCount} onClick={() => onPageChange(Math.min(pageCount, page + 1))} sx={{ minWidth: 36, borderRadius: 1.5 }}>
          ›
        </Button>
      </Stack>
    </Stack>
  )
}
