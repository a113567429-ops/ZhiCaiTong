import type { IndustryBenchmark } from '@/engine/types'

export const HOTEL_BENCHMARK: IndustryBenchmark = {
  industry: 'hotel',
  label: '酒店管理',
  metrics: {
    profitMargin: {
      green: [10, 100], // 利润率 ≥10% 为健康（酒店净利普遍低于餐饮）
      yellow: [3, 10], // 3%-10% 需关注
      red: [-100, 3], // <3% 有风险
      weight: 0.3,
    },
    cashRunway: {
      green: [3, 999], // ≥3 个月为健康
      yellow: [2, 3], // 2-3 个月需关注（酒店固定成本高，需更多缓冲）
      red: [0, 2], // <2 个月有风险
      weight: 0.3,
    },
    debtToAssetRatio: {
      green: [0, 50], // 负债率 ≤50% 为健康（地产类资产可承载更高杠杆）
      yellow: [50, 70], // 50%-70% 需关注
      red: [70, 200], // >70% 有风险
      weight: 0.25,
    },
    liquidityRatio: {
      green: [6.0, 999], // 流动比率 ≥6.0 为健康（现金足以支撑 6 个月利息）
      yellow: [3.0, 6.0], // 3.0-6.0 需关注
      red: [0, 3.0], // <3.0 有风险
      weight: 0.15,
    },
  },
}

// 第一阶段仅导出酒店管理，第二阶段在此处扩展
export const BENCHMARKS: Record<string, IndustryBenchmark> = {
  hotel: HOTEL_BENCHMARK,
}
