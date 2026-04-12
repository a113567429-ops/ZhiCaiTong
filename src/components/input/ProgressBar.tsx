interface ProgressBarProps {
  /** 当前步骤（1-indexed，展示用） */
  current: number
  /** 总步骤数 */
  total: number
}

/**
 * 问答进度条。
 *
 * 顶部显示"第 X 题 / 共 Y 题"文字，
 * 下方是金棕色填充进度条，比例 = current / total。
 */
export default function ProgressBar({ current, total }: ProgressBarProps) {
  const ratio = Math.min(current / total, 1)
  const percent = Math.round(ratio * 100)

  return (
    <div className="w-full px-4 pt-4 pb-2">
      {/* 文字标签 */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          第 {current} 题 / 共 {total} 题
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)', opacity: 0.6 }}
        >
          {percent}%
        </span>
      </div>

      {/* 进度条轨道 */}
      <div
        className="w-full h-2 overflow-hidden"
        style={{
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-input)',
        }}
      >
        {/* 填充条 */}
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${percent}%`,
            backgroundColor: 'var(--color-primary-gold)',
            borderRadius: 'var(--radius-input)',
          }}
        />
      </div>
    </div>
  )
}
