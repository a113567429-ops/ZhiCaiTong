import type { FinancialMetrics, IndicatorScore, IndustryBenchmark } from './types'

const INDICATOR_LABELS: Record<keyof FinancialMetrics, string> = {
  profitMargin: '利润率',
  cashRunway: '现金流健康度',
  debtToAssetRatio: '负债水平',
  liquidityRatio: '短期偿债能力',
}

/**
 * 将指标值映射到 0-100 分。
 *
 * 映射规则（区间线性插值）：
 * - 绿灯区间 → 80-100 分
 * - 黄灯区间 → 60-80 分
 * - 红灯区间 → 0-60 分
 */
function scoreMetric(
  value: number,
  benchmark: { green: [number, number]; yellow: [number, number]; red: [number, number] },
): { score: number; level: 'green' | 'yellow' | 'red' } {
  const { green, yellow, red } = benchmark

  const inRange = (v: number, range: [number, number]) => v >= range[0] && v <= range[1]

  if (inRange(value, green)) {
    // 绿灯区间内线性映射到 80-100
    const [lo, hi] = green
    const ratio = hi > lo ? Math.min((value - lo) / (hi - lo), 1) : 1
    return { score: Math.round(80 + ratio * 20), level: 'green' }
  }

  if (inRange(value, yellow)) {
    // 黄灯区间内线性映射到 60-80
    const [lo, hi] = yellow
    const ratio = hi > lo ? (value - lo) / (hi - lo) : 0.5
    return { score: Math.round(60 + ratio * 20), level: 'yellow' }
  }

  // 红灯区间映射到 0-60
  const [lo, hi] = red
  const ratio = hi > lo ? Math.min((value - lo) / (hi - lo), 1) : 0
  return { score: Math.round(ratio * 60), level: 'red' }
}

/**
 * 对全部财务指标评分，返回各单项 IndicatorScore、加权总分和总体健康等级。
 *
 * interpretation / advice 留空，由 interpreter.ts 填充。
 */
export function scoreAllMetrics(
  metrics: FinancialMetrics,
  benchmark: IndustryBenchmark,
): { indicators: IndicatorScore[]; totalScore: number; level: 'green' | 'yellow' | 'red' } {
  const indicators: IndicatorScore[] = (
    Object.keys(metrics) as (keyof FinancialMetrics)[]
  ).map((key) => {
    const value = metrics[key]
    const bench = benchmark.metrics[key]
    const { score, level } = scoreMetric(value, bench)

    return {
      name: INDICATOR_LABELS[key],
      key,
      value,
      score,
      level,
      label: level === 'green' ? '健康' : level === 'yellow' ? '需关注' : '有风险',
      interpretation: '', // 由 interpreter 填充
      advice: '',
    }
  })

  // 加权总分 = Σ(各指标分数 × 权重)
  const totalScore = Math.round(
    indicators.reduce((sum, ind) => {
      const weight = benchmark.metrics[ind.key].weight
      return sum + ind.score * weight
    }, 0),
  )

  const level = totalScore >= 80 ? 'green' : totalScore >= 60 ? 'yellow' : 'red'

  return { indicators, totalScore, level }
}
