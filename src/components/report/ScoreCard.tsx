import type { IndicatorLevel } from '@/engine/types'
import { Progress } from '@/components/ui/progress'

interface ScoreCardProps {
  score: number
  level: IndicatorLevel
  emoji: string
  summary: string
}

const LEVEL_COLORS: Record<IndicatorLevel, { bg: string; bar: string }> = {
  green: { bg: 'var(--color-green-bg)', bar: 'var(--color-green)' },
  yellow: { bg: 'var(--color-yellow-bg)', bar: 'var(--color-yellow)' },
  red: { bg: 'var(--color-red-bg)', bar: 'var(--color-red)' },
}

export default function ScoreCard({ score, level, emoji, summary }: ScoreCardProps) {
  const colors = LEVEL_COLORS[level]

  return (
    <div
      className="w-full rounded-2xl px-6 py-8 flex flex-col items-center gap-4"
      style={{
        backgroundColor: colors.bg,
        borderRadius: 'var(--radius-card)',
      }}
    >
      {/* 表情图标 */}
      <span className="leading-none" style={{ fontSize: '64px' }}>
        {emoji}
      </span>

      {/* 总分数字 */}
      <div className="text-center">
        <span
          className="font-bold leading-none"
          style={{ fontSize: '48px', color: colors.bar }}
        >
          {score}
        </span>
        <span
          className="ml-1 text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          分
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
        className="text-center leading-relaxed"
        style={{ fontSize: '16px', color: 'var(--color-text)' }}
      >
        {summary}
      </p>
    </div>
  )
}
