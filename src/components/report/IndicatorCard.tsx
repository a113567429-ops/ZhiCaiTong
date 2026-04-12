import type { IndicatorScore, IndicatorLevel } from '@/engine/types'

interface IndicatorCardProps {
  indicator: IndicatorScore
}

const LEVEL_DOT_COLOR: Record<IndicatorLevel, string> = {
  green: 'var(--color-green)',
  yellow: 'var(--color-yellow)',
  red: 'var(--color-red)',
}

export default function IndicatorCard({ indicator }: IndicatorCardProps) {
  const dotColor = LEVEL_DOT_COLOR[indicator.level]

  return (
    <div
      className="w-full rounded-2xl px-5 py-4"
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* 顶行：红绿灯圆点 + 指标名 + 等级标签 + 分数 */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <span
          className="font-semibold text-base flex-1"
          style={{ color: 'var(--color-text)' }}
        >
          {indicator.name}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: dotColor,
            color: '#fff',
          }}
        >
          {indicator.label}
        </span>
        <span
          className="font-bold text-base tabular-nums"
          style={{ color: dotColor }}
        >
          {indicator.score}分
        </span>
      </div>

      {/* 分割线 */}
      <hr className="my-3" style={{ borderColor: 'var(--color-border)' }} />

      {/* 解读文字 */}
      <p
        className="leading-relaxed"
        style={{ fontSize: '14px', color: 'var(--color-text)' }}
      >
        {indicator.interpretation}
      </p>

      {/* 分割线 */}
      <hr className="my-3" style={{ borderColor: 'var(--color-border)' }} />

      {/* 建议 */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: 'var(--color-bg)' }}
      >
        <p
          className="leading-relaxed"
          style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
        >
          💡 {indicator.advice}
        </p>
      </div>
    </div>
  )
}
