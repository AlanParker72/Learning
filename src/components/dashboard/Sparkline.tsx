import { Box } from '@mui/material'
import { Line, LineChart, ResponsiveContainer } from 'recharts'

type SparklineProps = {
  values: number[]
  color: string
}

export default function Sparkline({ values, color }: SparklineProps) {
  const data = values.map((value, index) => ({ index, value }))

  return (
    <Box sx={{ width: 88, height: 40 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
