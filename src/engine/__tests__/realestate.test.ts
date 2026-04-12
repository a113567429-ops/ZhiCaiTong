import { describe, it, expect } from 'vitest'
import { calculateMetrics } from '../calculator'
import { scoreAllMetrics } from '../scorer'
import { BENCHMARKS } from '@/data/benchmarks'
import type { UserInput } from '../types'

describe('房地产行业集成测试', () => {
  const realEstateBenchmark = BENCHMARKS['realestate']

  it('典型高杠杆地产场景：负债率 75% 在地产模式下应为黄灯而非红灯', () => {
    const input: UserInput = {
      industry: 'realestate',
      monthlyRevenue: 1000000,
      monthlyExpense: 600000,
      cashOnHand: 5000000,
      accountsReceivable: 1000000,
      totalDebt: 9000000, // 900万债
      fixedAssets: 5000000, // 总资产 = 500+100+500+100 = 1200万
      inventory: 1000000,   
      monthlyInterest: 50000,
    }

    // 1. 计算指标
    const metrics = calculateMetrics(input)
    // 负债率 = 900 / 1200 = 75%
    expect(metrics.debtToAssetRatio).toBe(75)

    // 2. 评分
    const result = scoreAllMetrics(metrics, realEstateBenchmark)
    const debtInd = result.indicators.find(i => i.key === 'debtToAssetRatio')!
    
    // 地产模式下：65-80 是黄灯
    expect(debtInd.level).toBe('yellow')
    expect(debtInd.label).toBe('需关注')
  })

  it('利润率 20% 在地产模式下应为黄灯（酒店模式下是绿灯）', () => {
    const input: UserInput = {
      industry: 'realestate',
      monthlyRevenue: 100000,
      monthlyExpense: 80000, // 利润率 20%
      cashOnHand: 1000000,
      accountsReceivable: 0,
      totalDebt: 0,
      fixedAssets: 0,
      inventory: 0,
      monthlyInterest: 1000,
    }

    const metrics = calculateMetrics(input)
    const result = scoreAllMetrics(metrics, realEstateBenchmark)
    const profitInd = result.indicators.find(i => i.key === 'profitMargin')!

    // 地产模式下：健康阈值是 30%，20% 是黄灯
    expect(profitInd.level).toBe('yellow')
  })
})
