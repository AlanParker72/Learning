import { Tab, Tabs } from '@mui/material'
import type { TabDef } from '../../config/types'

type Props = {
  tabs: TabDef[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function DashboardTabs({ tabs, activeTab, onChange }: Props) {
  if (tabs.length === 0) return null

  const value = tabs.some((t) => t.id === activeTab) ? activeTab : tabs[0].id

  return (
    <Tabs
      value={value}
      onChange={(_, next) => onChange(next as string)}
      sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
    >
      {tabs.map((tab) => (
        <Tab key={tab.id} value={tab.id} label={tab.label} />
      ))}
    </Tabs>
  )
}
