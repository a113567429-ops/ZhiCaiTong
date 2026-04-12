import type { Industry } from '@/engine/types'
import { Building2, Home, Briefcase, LandPlot } from 'lucide-react'
import React from 'react'

interface IndustrySelectorProps {
  selected: Industry | null
  onSelect: (industry: Industry) => void
}

interface IndustryOption {
  id: Industry
  label: string
  icon: React.ElementType
  enabled: boolean
}

const INDUSTRY_OPTIONS: IndustryOption[] = [
  { id: 'hotel', label: '酒店管理', icon: Building2, enabled: true },
  { id: 'realestate', label: '房地产', icon: Home, enabled: true },
  { id: 'service', label: '服务业', icon: Briefcase, enabled: false },
  { id: 'construction', label: '建筑工程', icon: LandPlot, enabled: false },
]

/**
 * 行业选择器。
 *
 * 第一阶段只有"酒店管理"和"房地产"可选，其他行业显示"即将开放"灰色状态。
 */
export default function IndustrySelector({ selected, onSelect }: IndustrySelectorProps) {
  return (
    <div className="w-full px-4 py-4">
      <h3
        className="text-base font-medium mb-4"
        style={{ color: 'var(--color-text)', letterSpacing: '0.05em' }}
      >
        选择评估行业
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {INDUSTRY_OPTIONS.map((option) => {
          const isSelected = selected === option.id
          const isDisabled = !option.enabled
          const Icon = option.icon

          return (
            <button
              key={option.id}
              onClick={() => option.enabled && onSelect(option.id)}
              disabled={isDisabled}
              className="relative flex flex-col items-center gap-3 py-6 px-3 rounded-2xl border transition-all duration-300 group"
              style={{
                borderColor: isSelected
                  ? 'var(--color-primary-gold)'
                  : 'var(--color-border)',
                backgroundColor: isSelected
                  ? 'var(--color-primary-light)'
                  : isDisabled
                    ? '#FAF9F8'
                    : 'var(--color-card)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.6 : 1,
                boxShadow: isSelected ? '0 4px 12px rgba(197, 160, 89, 0.12)' : 'none',
              }}
            >
              {/* 图标 */}
              <div 
                className={`p-2 rounded-full transition-colors duration-300 ${isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}
              >
                <Icon size={28} strokeWidth={1.2} />
              </div>

              {/* 标签 */}
              <span
                className="text-sm tracking-widest font-light"
                style={{
                  color: isSelected
                    ? 'var(--color-primary)'
                    : 'var(--color-text)',
                }}
              >
                {option.label}
              </span>

              {/* 即将开放标记 */}
              {isDisabled && (
                <span
                  className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded-sm border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  COMING
                </span>
              )}

              {/* 选中指示点 */}
              {isSelected && (
                <span
                  className="absolute bottom-2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary-gold)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
