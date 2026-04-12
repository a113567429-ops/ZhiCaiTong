import { Slider } from '@/components/ui/slider'

interface AmountSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  unit: string
  /** 为 true 时展示值转换为"X 万元" */
  useWan?: boolean
}

/**
 * 金额滑块输入。
 *
 * 基于 shadcn Slider 组件。
 * 滑块上方显示当前数值大字（48px），下方显示 min/max 刻度标签。
 * 拖动时数值实时更新。
 */
export default function AmountSlider({
  value,
  onChange,
  min,
  max,
  step,
  unit,
  useWan = false,
}: AmountSliderProps) {
  const displayMin = useWan ? `${min}` : min.toLocaleString('zh-CN')
  const displayMax = useWan ? `${max}` : max.toLocaleString('zh-CN')

  return (
    <div className="w-full py-4">
      {/* 当前数值 — 大字展示 */}
      <div className="text-center mb-6">
        <span
          className="font-bold leading-none"
          style={{
            fontSize: '48px',
            color: 'var(--color-primary)',
          }}
        >
          {value}
        </span>
        <span
          className="ml-2 text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {unit}
        </span>
      </div>

      {/* 滑块 */}
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={min}
          max={max}
          step={step}
          className="w-full [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-range]]:bg-[var(--color-primary-gold)] [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-[var(--color-primary-gold)]"
        />
      </div>

      {/* 刻度标签 */}
      <div className="flex justify-between mt-2 px-2">
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {displayMin} {unit}
        </span>
        <span
          className="text-xs"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {displayMax} {unit}
        </span>
      </div>
    </div>
  )
}
