import type { UserInput, FinancialMetrics } from './types'

/**
 * 由用户输入计算四项财务指标。
 *
 * 所有除法都做了零值保护：分母为 0 时根据业务语义返回特殊值
 * （如 cashRunway=999 表示"几乎无限期"，debtToAssetRatio=100 表示"完全资不抵债"）。
 */
export function calculateMetrics(input: UserInput): FinancialMetrics {
  const {
    monthlyRevenue,
    monthlyExpense,
    cashOnHand,
    accountsReceivable,
    totalDebt,
    fixedAssets,
    inventory,
    monthlyInterest,
  } = input

  // 利润率 = (收入 - 支出) / 收入 × 100
  const profitMargin =
    monthlyRevenue > 0 ? ((monthlyRevenue - monthlyExpense) / monthlyRevenue) * 100 : 0

  // 现金可维持月数 = 现金 / 月均支出
  // 支出为 0 时：若有现金则视为"几乎无限期"(999)，否则 0
  const cashRunway =
    monthlyExpense > 0 ? cashOnHand / monthlyExpense : cashOnHand > 0 ? 999 : 0

  // 总资产 = 现金 + 应收 + 固定资产 + 存货
  const totalAssets = cashOnHand + accountsReceivable + fixedAssets + inventory

  // 资产负债率 = 总负债 / 总资产 × 100
  // 总资产为 0 时：若有负债则视为"完全资不抵债"(100)，否则 0
  const debtToAssetRatio =
    totalAssets > 0 ? (totalDebt / totalAssets) * 100 : totalDebt > 0 ? 100 : 0

  // 流动比率 = 流动资产 / 每月应付利息（流动负债压力）
  // 流动资产不含固定资产
  const currentAssets = cashOnHand + accountsReceivable + inventory
  const liquidityRatio =
    monthlyInterest > 0 ? currentAssets / monthlyInterest : currentAssets > 0 ? 999 : 0

  return { profitMargin, cashRunway, debtToAssetRatio, liquidityRatio }
}
