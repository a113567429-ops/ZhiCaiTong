import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 将元转换为"X 万元"展示。
 * 例如：100000 → "10 万元"，35000 → "3.5 万元"
 */
export function formatWan(amount: number): string {
  const wan = amount / 10000
  // 整数则不显示小数点，否则保留最多 1 位
  const formatted = Number.isInteger(wan) ? wan.toString() : wan.toFixed(1)
  return `${formatted} 万元`
}

/**
 * 大数字加千分位逗号。
 * 例如：1234567 → "1,234,567"
 */
export function formatMoney(amount: number): string {
  return amount.toLocaleString('zh-CN')
}
