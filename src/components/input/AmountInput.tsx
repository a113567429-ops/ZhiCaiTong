import { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface AmountInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  unit: string
  placeholder?: string
}

/**
 * 数字金额输入框。
 *
 * 基于 shadcn Input 组件。
 * - 输入时显示千分位格式化
 * - 失去焦点后校验 min/max 范围并 clamp
 * - 右侧显示单位标签
 */
export default function AmountInput({
  value,
  onChange,
  min,
  max,
  step,
  unit,
  placeholder = '请输入金额',
}: AmountInputProps) {
  // 内部维护文本状态，支持编辑过程中输入不完整的数字
  const [displayText, setDisplayText] = useState(
    value > 0 ? value.toLocaleString('zh-CN') : '',
  )
  const [isFocused, setIsFocused] = useState(false)

  /** 解析千分位文本为数字 */
  const parseNumber = useCallback((text: string): number => {
    const cleaned = text.replace(/,/g, '').replace(/[^\d.]/g, '')
    const num = parseFloat(cleaned)
    return isNaN(num) ? 0 : num
  }, [])

  /** 格式化数字为千分位文本 */
  const formatNumber = useCallback((num: number): string => {
    if (num === 0) return ''
    return num.toLocaleString('zh-CN')
  }, [])

  // 同步外部 value 变化
  useEffect(() => {
    if (!isFocused) {
      setDisplayText(formatNumber(value))
    }
  }, [value, isFocused, formatNumber])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      // 允许输入数字、逗号、小数点
      setDisplayText(raw)

      const num = parseNumber(raw)
      onChange(num)
    },
    [onChange, parseNumber],
  )

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    // 聚焦时显示纯数字，方便编辑
    if (value > 0) {
      setDisplayText(value.toString())
    } else {
      setDisplayText('')
    }
  }, [value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)

    // 校验并 clamp 到 min/max 范围
    let num = parseNumber(displayText)
    if (num < min) num = min
    if (num > max) num = max

    // 按 step 取整（可选）
    if (step > 0) {
      num = Math.round(num / step) * step
    }

    onChange(num)
    setDisplayText(formatNumber(num))
  }, [displayText, min, max, step, onChange, parseNumber, formatNumber])

  return (
    <div className="w-full py-4">
      <div className="relative">
        <Input
          type="text"
          inputMode="numeric"
          value={displayText}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pr-14 text-lg h-12"
          style={{
            borderRadius: 'var(--radius-input)',
            borderColor: isFocused ? 'var(--color-primary-gold)' : 'var(--color-border)',
          }}
        />
        {/* 右侧单位标签 */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {unit}
        </span>
      </div>
    </div>
  )
}
