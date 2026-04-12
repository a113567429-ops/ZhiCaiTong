import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from 'recharts'
import type { IndicatorLevel } from '@/engine/types'

interface ScoreGaugeProps {
  score: number
  level: IndicatorLevel
}

const LEVEL_COLORS: Record<IndicatorLevel, string> = {
  green: 'var(--color-green)',
  yellow: 'var(--color-yellow)',
  red: 'var(--color-red)',
}

export default function ScoreGauge({ score, level }: ScoreGaugeProps) {
  const color = LEVEL_COLORS[level]
  const data = [{ name: '总分', value: score }]

  return (
    <div className="relative w-full" style={{ height: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
          cx="50%"
          cy="80%"
        >
          <RadialBar
            background={{ fill: 'var(--color-border)' }}
            dataKey="value"
            fill={color}
            cornerRadius={8}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* 中心叠加数字 */}
      <div
        className="absolute inset-0 flex items-end justify-center"
        style={{ paddingBottom: '28px' }}
      >
        <div className="text-center">
          <span
            className="font-bold leading-none"
            style={{ fontSize: '40px', color }}
          >
            {score}
          </span>
          <span
            className="ml-1 text-base"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            分
          </span>
        </div>
      </div>
    </div>
  )
}
