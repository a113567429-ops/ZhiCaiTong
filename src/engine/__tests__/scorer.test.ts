import { describe, it, expect } from 'vitest'
import { scoreAllMetrics } from '../scorer'
import { HOTEL_BENCHMARK } from '@/data/benchmarks'
import type { FinancialMetrics } from '../types'

function metrics(overrides: Partial<FinancialMetrics> = {}): FinancialMetrics {
  return {
    profitMargin: 0,
    cashRunway: 0,
    debtToAssetRatio: 0,
    liquidityRatio: 0,
    ...overrides,
  }
}

function getIndicator(
  result: ReturnType<typeof scoreAllMetrics>,
  key: keyof FinancialMetrics,
) {
  const ind = result.indicators.find((i) => i.key === key)
  if (!ind) throw new Error(`indicator not found: ${key}`)
  return ind
}

describe('scoreAllMetrics', () => {
  describe('单项指标评分', () => {
    it('利润率 20%（绿灯）→ score ≥ 80', () => {
      const result = scoreAllMetrics(metrics({ profitMargin: 20 }), HOTEL_BENCHMARK)
      const ind = getIndicator(result, 'profitMargin')
      expect(ind.score).toBeGreaterThanOrEqual(80)
      expect(ind.level).toBe('green')
      expect(ind.label).toBe('健康')
    })

    it('利润率 5%（黄灯）→ 60 ≤ score < 80', () => {
      const result = scoreAllMetrics(metrics({ profitMargin: 5 }), HOTEL_BENCHMARK)
      const ind = getIndicator(result, 'profitMargin')
      expect(ind.score).toBeGreaterThanOrEqual(60)
      expect(ind.score).toBeLessThan(80)
      expect(ind.level).toBe('yellow')
      expect(ind.label).toBe('需关注')
    })

    it('利润率 -10%（红灯）→ score < 60', () => {
      const result = scoreAllMetrics(metrics({ profitMargin: -10 }), HOTEL_BENCHMARK)
      const ind = getIndicator(result, 'profitMargin')
      expect(ind.score).toBeLessThan(60)
      expect(ind.level).toBe('red')
      expect(ind.label).toBe('有风险')
    })
  })

  describe('IndicatorScore 对象结构', () => {
    it('返回 4 个指标，每个含 name/key/value/score/level/label/interpretation/advice', () => {
      const result = scoreAllMetrics(
        metrics({ profitMargin: 20, cashRunway: 6, debtToAssetRatio: 10, liquidityRatio: 3 }),
        HOTEL_BENCHMARK,
      )
      expect(result.indicators).toHaveLength(4)
      for (const ind of result.indicators) {
        expect(ind.name).toBeTruthy()
        expect(ind.key).toBeTruthy()
        expect(typeof ind.value).toBe('number')
        expect(ind.score).toBeGreaterThanOrEqual(0)
        expect(ind.score).toBeLessThanOrEqual(100)
        expect(['green', 'yellow', 'red']).toContain(ind.level)
        expect(['健康', '需关注', '有风险']).toContain(ind.label)
        // interpretation 和 advice 留给 interpreter 填充
        expect(ind.interpretation).toBe('')
        expect(ind.advice).toBe('')
      }
    })

    it('indicator.value 与输入 metrics 一一对应', () => {
      const result = scoreAllMetrics(
        metrics({ profitMargin: 20, cashRunway: 6, debtToAssetRatio: 10, liquidityRatio: 3 }),
        HOTEL_BENCHMARK,
      )
      expect(getIndicator(result, 'profitMargin').value).toBe(20)
      expect(getIndicator(result, 'cashRunway').value).toBe(6)
      expect(getIndicator(result, 'debtToAssetRatio').value).toBe(10)
      expect(getIndicator(result, 'liquidityRatio').value).toBe(3)
    })

    it('indicator.name 是中文标签', () => {
      const result = scoreAllMetrics(metrics({ profitMargin: 20 }), HOTEL_BENCHMARK)
      expect(getIndicator(result, 'profitMargin').name).toBe('利润率')
    })
  })

  describe('totalScore 和总体 level', () => {
    it('四项全绿 → totalScore ≥ 80，level = green', () => {
      const result = scoreAllMetrics(
        metrics({
          profitMargin: 50, // green [10, 100]
          cashRunway: 6, // green [3, 999]
          debtToAssetRatio: 10, // green [0, 50]
          liquidityRatio: 3, // green [1.5, 999]
        }),
        HOTEL_BENCHMARK,
      )
      expect(result.totalScore).toBeGreaterThanOrEqual(80)
      expect(result.level).toBe('green')
      for (const ind of result.indicators) {
        expect(ind.level).toBe('green')
      }
    })

    it('四项全红 → totalScore < 60，level = red', () => {
      const result = scoreAllMetrics(
        metrics({
          profitMargin: -50, // red [-100, 3]
          cashRunway: 0.5, // red [0, 2]
          debtToAssetRatio: 150, // red [70, 200]
          liquidityRatio: 0.5, // red [0, 1.0]
        }),
        HOTEL_BENCHMARK,
      )
      expect(result.totalScore).toBeLessThan(60)
      expect(result.level).toBe('red')
      for (const ind of result.indicators) {
        expect(ind.level).toBe('red')
      }
    })

    it('四项全黄 → 60 ≤ totalScore < 80，level = yellow', () => {
      const result = scoreAllMetrics(
        metrics({
          profitMargin: 5, // yellow [3, 10]
          cashRunway: 2.5, // yellow [2, 3]
          debtToAssetRatio: 60, // yellow [50, 70]
          liquidityRatio: 1.25, // yellow [1.0, 1.5]
        }),
        HOTEL_BENCHMARK,
      )
      expect(result.totalScore).toBeGreaterThanOrEqual(60)
      expect(result.totalScore).toBeLessThan(80)
      expect(result.level).toBe('yellow')
    })

    it('权重加权后 totalScore 不超出 [0, 100]', () => {
      // 极端值也不能让总分溢出
      const maxResult = scoreAllMetrics(
        metrics({
          profitMargin: 100,
          cashRunway: 999,
          debtToAssetRatio: 50,
          liquidityRatio: 999,
        }),
        HOTEL_BENCHMARK,
      )
      expect(maxResult.totalScore).toBeLessThanOrEqual(100)
      expect(maxResult.totalScore).toBeGreaterThanOrEqual(0)

      const minResult = scoreAllMetrics(
        metrics({
          profitMargin: -100,
          cashRunway: 0,
          debtToAssetRatio: 200,
          liquidityRatio: 0,
        }),
        HOTEL_BENCHMARK,
      )
      expect(minResult.totalScore).toBeLessThanOrEqual(100)
      expect(minResult.totalScore).toBeGreaterThanOrEqual(0)
    })

    it('level 阈值：≥80 green, ≥60 yellow, <60 red', () => {
      // 混合指标产生不同总分
      const greenEdge = scoreAllMetrics(
        metrics({ profitMargin: 50, cashRunway: 6, debtToAssetRatio: 10, liquidityRatio: 3 }),
        HOTEL_BENCHMARK,
      )
      if (greenEdge.totalScore >= 80) expect(greenEdge.level).toBe('green')

      const yellowEdge = scoreAllMetrics(
        metrics({ profitMargin: 5, cashRunway: 2.5, debtToAssetRatio: 60, liquidityRatio: 1.25 }),
        HOTEL_BENCHMARK,
      )
      if (yellowEdge.totalScore >= 60 && yellowEdge.totalScore < 80)
        expect(yellowEdge.level).toBe('yellow')

      const redEdge = scoreAllMetrics(
        metrics({ profitMargin: -50, cashRunway: 0.5, debtToAssetRatio: 150, liquidityRatio: 0.5 }),
        HOTEL_BENCHMARK,
      )
      if (redEdge.totalScore < 60) expect(redEdge.level).toBe('red')
    })
  })
})
