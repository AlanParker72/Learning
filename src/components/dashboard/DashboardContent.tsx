import { Alert, Box, CircularProgress, Stack } from '@mui/material'
import type {
  ActionDef,
  DashboardDataResponse,
  TabDef,
  WidgetDef
} from '../../config/types'
import { ChartWidget } from './widgets/ChartWidget'
import { MetricWidget } from './widgets/MetricWidget'
import { TableWidget } from './widgets/TableWidget'

type Props = {
  widgets: WidgetDef[]
  activeTabDef: TabDef | undefined
  actions: ActionDef[]
  data: DashboardDataResponse | undefined
  isLoading: boolean
  isError: boolean
  selectedIds: string[]
  onToggleSelected: (id: string) => void
  onSelectAll: (ids: string[]) => void
  onRowAction: (actionId: string, rowId: string) => void
  onBulkAction: (actionId: string) => void
}

export function DashboardContent({
  widgets,
  activeTabDef,
  actions,
  data,
  isLoading,
  isError,
  selectedIds,
  onToggleSelected,
  onSelectAll,
  onRowAction,
  onBulkAction
}: Props) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (isError) {
    return <Alert severity="error">Failed to load dashboard data.</Alert>
  }

  if (!data || !activeTabDef) {
    return <Alert severity="info">No configuration for this view.</Alert>
  }

  return (
    <Stack spacing={2}>
      {widgets.map((widget) => {
        if (widget.type === 'metrics') {
          return (
            <MetricWidget
              key={widget.id}
              title={widget.title}
              metrics={data.metrics}
            />
          )
        }
        if (widget.type === 'chart') {
          return (
            <ChartWidget
              key={widget.id}
              title={widget.title}
              points={data.chart}
            />
          )
        }
        if (widget.type === 'table') {
          return (
            <TableWidget
              key={widget.id}
              title={widget.title}
              columns={activeTabDef.columns}
              rows={data.rows}
              actions={actions}
              selectable={Boolean(activeTabDef.selectable)}
              selectedIds={selectedIds}
              onToggleSelected={onToggleSelected}
              onSelectAll={onSelectAll}
              onRowAction={onRowAction}
              onBulkAction={onBulkAction}
            />
          )
        }
        return null
      })}
    </Stack>
  )
}
