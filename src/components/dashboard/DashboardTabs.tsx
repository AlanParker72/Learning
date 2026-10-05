import { Tab, Tabs } from '@mui/material'
import type { TabDef } from '../../config/types'

type Props = {
  tabs: TabDef[]
  activeTab: string
  tabCounts?: Record<string, number>
  onChange: (tabId: string) => void
}

export function DashboardTabs({ tabs, activeTab, tabCounts, onChange }: Props) {
  if (tabs.length === 0) return null

  const value = tabs.some((t) => t.id === activeTab) ? activeTab : tabs[0].id

  return (
    <Tabs
      value={value}
      onChange={(_, next) => onChange(next as string)}
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      {tabs.map((tab) => {
        const count = tabCounts?.[tab.id]
        const label =
          typeof count === 'number' ? `${tab.label} (${count})` : tab.label
        return <Tab key={tab.id} value={tab.id} label={label} />
      })}
    </Tabs>
  )
}
