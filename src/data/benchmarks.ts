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

export const REAL_ESTATE_BENCHMARK: IndustryBenchmark = {
  industry: 'realestate',
  label: '房地产',
  metrics: {
    profitMargin: {
      green: [30, 100], // 30%+ 净利为健康
      yellow: [15, 30],
      red: [-100, 15],
      weight: 0.3,
    },
    cashRunway: {
      green: [6, 999], // 需要更长缓冲 (6个月)
      yellow: [3, 6],
      red: [0, 3],
      weight: 0.3,
    },
    debtToAssetRatio: {
      green: [0, 65], // 容忍度更高 (65%)
      yellow: [65, 80],
      red: [80, 200],
      weight: 0.25,
    },
    liquidityRatio: {
      green: [5.0, 999], // 覆盖 5 个月利息
      yellow: [2.5, 5.0],
      red: [0, 2.5],
      weight: 0.15,
    },
  },
}

// 导出所有行业基准
export const BENCHMARKS: Record<string, IndustryBenchmark> = {
  hotel: HOTEL_BENCHMARK,
  realestate: REAL_ESTATE_BENCHMARK,
}
