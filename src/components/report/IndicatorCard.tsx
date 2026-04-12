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
      <div className="flex items-center gap-3">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <span
          className="font-medium text-sm flex-1 tracking-widest uppercase opacity-80"
          style={{ color: 'var(--color-text)' }}
        >
          {indicator.name}
        </span>
        <span
          className="text-[10px] tracking-widest px-2 py-0.5 rounded-sm border opacity-60 font-light"
          style={{
            borderColor: dotColor,
            color: dotColor,
          }}
        >
          {indicator.label}
        </span>
        <span
          className="font-light text-xl tabular-nums tracking-tighter"
          style={{ color: 'var(--color-text)' }}
        >
          {indicator.score}
        </span>
      </div>

      {/* 分割线 */}
      <div className="h-px w-full my-4 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

      {/* 解读文字 */}
      <p
        className="leading-relaxed font-light italic"
        style={{ fontSize: '15px', color: 'var(--color-text)' }}
      >
        {indicator.interpretation}
      </p>

      {/* 摘要区 */}
      <div
        className="mt-4 rounded-xl px-4 py-4 border-l-2"
        style={{ 
          backgroundColor: 'var(--color-bg)',
          borderColor: dotColor
        }}
      >
        <p
          className="leading-loose font-light tracking-wide italic"
          style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}
        >
          {indicator.advice}
        </p>
      </div>
    </div>
  )
}
