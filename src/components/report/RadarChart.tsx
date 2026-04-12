import {
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import type { IndicatorScore } from '@/engine/types'

interface MetricsRadarChartProps {
  indicators: IndicatorScore[]
}

export default function MetricsRadarChart({ indicators }: MetricsRadarChartProps) {
  const data = indicators.map((ind) => ({
    subject: ind.name,
    score: ind.score,
    fullMark: 100,
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="var(--color-border)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 13, fill: 'var(--color-text-secondary)' }}
        />
        <Radar
          dataKey="score"
          stroke="var(--color-primary)"
          fill="var(--color-primary)"
          fillOpacity={0.2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  )
}
