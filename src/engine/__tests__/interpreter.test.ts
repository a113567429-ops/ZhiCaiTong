import { describe, it, expect } from 'vitest'
import { generateReport } from '../interpreter'
import { scoreAllMetrics } from '../scorer'
import { calculateMetrics } from '../calculator'
import { HOTEL_BENCHMARK } from '@/data/benchmarks'
import type { FinancialMetrics, UserInput } from '../types'

function metrics(overrides: Partial<FinancialMetrics> = {}): FinancialMetrics {
  return {
    profitMargin: 0,
    cashRunway: 0,
    debtToAssetRatio: 0,
    liquidityRatio: 0,
    ...overrides,
  }
}

describe('generateReport', () => {
  describe('利润率解读', () => {
    it('绿灯 → interpretation 包含"不错"，advice 包含"留存"', () => {
      const scored = scoreAllMetrics(
        metrics({ profitMargin: 20, cashRunway: 6, debtToAssetRatio: 10, liquidityRatio: 10 }),
        HOTEL_BENCHMARK,
      )
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'profitMargin')!
      expect(ind.interpretation).toContain('不错')
      expect(ind.advice).toContain('留存')
    })

    it('黄灯 → interpretation 包含"不算多"', () => {
      const scored = scoreAllMetrics(metrics({ profitMargin: 5 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'profitMargin')!
      expect(ind.interpretation).toContain('不算多')
    })

    it('红灯亏损 → interpretation 包含"亏损"', () => {
      const scored = scoreAllMetrics(metrics({ profitMargin: -10 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'profitMargin')!
      expect(ind.interpretation).toContain('亏损')
    })
  })

  describe('现金流解读', () => {
    it('红灯 → interpretation 包含"危险"字样', () => {
      const scored = scoreAllMetrics(metrics({ cashRunway: 0.5 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'cashRunway')!
      expect(ind.interpretation).toContain('危险')
    })

    it('绿灯 → interpretation 包含"充足"', () => {
      const scored = scoreAllMetrics(metrics({ cashRunway: 6 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'cashRunway')!
      expect(ind.interpretation).toContain('充足')
    })
  })

  describe('负债率解读', () => {
    it('绿灯 → interpretation 包含"可控"', () => {
      const scored = scoreAllMetrics(metrics({ debtToAssetRatio: 20 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'debtToAssetRatio')!
      expect(ind.interpretation).toContain('可控')
    })

    it('红灯 → interpretation 包含"压力"', () => {
      const scored = scoreAllMetrics(metrics({ debtToAssetRatio: 150 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'debtToAssetRatio')!
      expect(ind.interpretation).toContain('压力')
    })
  })

  describe('流动比率解读', () => {
    it('黄灯 → interpretation 包含"紧"', () => {
      const scored = scoreAllMetrics(metrics({ liquidityRatio: 4.5 }), HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const ind = report.indicators.find((i) => i.key === 'liquidityRatio')!
      expect(ind.interpretation).toContain('紧')
    })
  })

  describe('报告元信息', () => {
    it('generatedAt 是合法 ISO 时间戳', () => {
      const scored = scoreAllMetrics(
        metrics({ profitMargin: 20, cashRunway: 6, debtToAssetRatio: 10, liquidityRatio: 10 }),
        HOTEL_BENCHMARK,
      )
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      const parsed = new Date(report.generatedAt)
      expect(parsed.getTime()).not.toBeNaN()
    })

    it('summary 根据 level 取对应文案', () => {
      const green = generateReport(85, 'green', [])
      expect(green.summary).toContain('健康')

      const red = generateReport(40, 'red', [])
      expect(red.summary).toContain('风险')
    })

    it('所有 indicator 的 interpretation 和 advice 都已填充', () => {
      const scored = scoreAllMetrics(
        metrics({ profitMargin: 20, cashRunway: 6, debtToAssetRatio: 10, liquidityRatio: 10 }),
        HOTEL_BENCHMARK,
      )
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)
      for (const ind of report.indicators) {
        expect(ind.interpretation.length).toBeGreaterThan(0)
        expect(ind.advice.length).toBeGreaterThan(0)
      }
    })
  })

  describe('端到端集成（calculator → scorer → interpreter）', () => {
    it('从 UserInput 到完整报告流畅运行', () => {
      const input: UserInput = {
        industry: 'hotel',
        monthlyRevenue: 500000, // 50 万
        monthlyExpense: 350000, // 35 万
        cashOnHand: 1500000,    // 150 万
        accountsReceivable: 200000,
        totalDebt: 800000,
        fixedAssets: 3000000,
        inventory: 100000,
        monthlyInterest: 10000,
      }

      const m = calculateMetrics(input)
      const scored = scoreAllMetrics(m, HOTEL_BENCHMARK)
      const report = generateReport(scored.totalScore, scored.level, scored.indicators)

      expect(report.totalScore).toBeGreaterThanOrEqual(0)
      expect(report.totalScore).toBeLessThanOrEqual(100)
      expect(['green', 'yellow', 'red']).toContain(report.level)
      expect(report.indicators).toHaveLength(4)
      expect(report.generatedAt).toBeTruthy()
    })
  })
})
