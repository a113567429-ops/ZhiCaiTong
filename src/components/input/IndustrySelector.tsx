import type { Industry } from '@/engine/types'

interface IndustrySelectorProps {
  selected: Industry | null
  onSelect: (industry: Industry) => void
}

interface IndustryOption {
  id: Industry
  label: string
  icon: string
  enabled: boolean
}

const INDUSTRY_OPTIONS: IndustryOption[] = [
  { id: 'hotel', label: '酒店管理', icon: '🏨', enabled: true },
  { id: 'realestate', label: '房地产', icon: '🏗️', enabled: false },
  { id: 'service', label: '服务业', icon: '💼', enabled: false },
  { id: 'construction', label: '建筑工程', icon: '🔨', enabled: false },
]

/**
 * 行业选择器。
 *
 * 第一阶段只有"酒店管理"可选，其他行业显示"即将开放"灰色状态。
 * 点击可选卡片后高亮选中，触发 onSelect 回调。
 */
export default function IndustrySelector({ selected, onSelect }: IndustrySelectorProps) {
  return (
    <div className="w-full px-4 py-4">
      <h3
        className="text-base font-semibold mb-3"
        style={{ color: 'var(--color-text)' }}
      >
        选择你的行业
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {INDUSTRY_OPTIONS.map((option) => {
          const isSelected = selected === option.id
          const isDisabled = !option.enabled

          return (
            <button
              key={option.id}
              onClick={() => option.enabled && onSelect(option.id)}
              disabled={isDisabled}
              className="relative flex flex-col items-center gap-2 py-5 px-3 rounded-2xl border-2 transition-all duration-200"
              style={{
                borderColor: isSelected
                  ? 'var(--color-primary-gold)'
                  : isDisabled
                    ? 'var(--color-border)'
                    : 'var(--color-border)',
                backgroundColor: isSelected
                  ? 'var(--color-primary-light)'
                  : isDisabled
                    ? '#F9F7F5'
                    : 'var(--color-card)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.55 : 1,
              }}
            >
              {/* 图标 */}
              <span className="text-3xl">{option.icon}</span>

              {/* 标签 */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isSelected
                    ? 'var(--color-primary)'
                    : isDisabled
                      ? 'var(--color-text-secondary)'
                      : 'var(--color-text)',
                }}
              >
                {option.label}
              </span>

              {/* 即将开放标记 */}
              {isDisabled && (
                <span
                  className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  即将开放
                </span>
              )}

              {/* 选中指示器 */}
              {isSelected && (
                <span
                  className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-white text-xs"
                  style={{ backgroundColor: 'var(--color-primary-gold)' }}
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
