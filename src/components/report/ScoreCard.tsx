import type { IndicatorLevel } from '@/engine/types'
import { Progress } from '@/components/ui/progress'

interface ScoreCardProps {
  score: number
  level: IndicatorLevel
  summary: string
}

const LEVEL_COLORS: Record<IndicatorLevel, { bg: string; bar: string }> = {
  green: { bg: 'var(--color-green-bg)', bar: 'var(--color-green)' },
  yellow: { bg: 'var(--color-yellow-bg)', bar: 'var(--color-yellow)' },
  red: { bg: 'var(--color-red-bg)', bar: 'var(--color-red)' },
}

export default function ScoreCard({ score, level, summary }: ScoreCardProps) {
  const colors = LEVEL_COLORS[level]

  return (
    <div
      className="w-full rounded-2xl px-6 py-10 flex flex-col items-center gap-6"
      style={{
        backgroundColor: colors.bg,
        borderRadius: 'var(--radius-card)',
        border: `1px solid ${colors.bar}20`,
      }}
    >
      {/* 状态标签 */}
      <span 
        className="text-xs tracking-[0.3em] font-light uppercase opacity-60"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Financial Health Check
      </span>

      {/* 总分数字 */}
      <div className="text-center flex items-baseline gap-1">
        <span
          className="font-light leading-none tracking-tighter"
          style={{ fontSize: '72px', color: colors.bar }}
        >
          {score}
        </span>
        <span
          className="text-sm tracking-widest font-light"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          PTS
        </span>
      </div>

      {/* 彩色进度条 */}
      <Progress
        value={score}
        className="h-2 w-full max-w-xs"
        style={
          {
            '--progress-color': colors.bar,
          } as React.CSSProperties
        }
      />

      {/* 一句话总结 */}
      <p
        className="text-center leading-loose font-light tracking-wide max-w-[240px]"
        style={{ fontSize: '15px', color: 'var(--color-text)' }}
      >
        {summary}
      </p>
    </div>
  )
}
