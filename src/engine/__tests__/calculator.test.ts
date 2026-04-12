import { describe, it, expect } from 'vitest'
import { calculateMetrics } from '../calculator'
import type { UserInput } from '../types'

function input(overrides: Partial<UserInput> = {}): UserInput {
  return {
    industry: 'hotel',
    monthlyRevenue: 0,
    monthlyExpense: 0,
    cashOnHand: 0,
    accountsReceivable: 0,
    totalDebt: 0,
    fixedAssets: 0,
    inventory: 0,
    monthlyInterest: 0,
    ...overrides,
  }
}

describe('calculateMetrics', () => {
  describe('profitMargin', () => {
    it('正常场景：收入 10 万，支出 8 万 → 利润率 20%', () => {
      const result = calculateMetrics(input({ monthlyRevenue: 100000, monthlyExpense: 80000 }))
      expect(result.profitMargin).toBe(20)
    })

    it('边界：收入 = 0 → 利润率 = 0', () => {
      const result = calculateMetrics(input({ monthlyRevenue: 0, monthlyExpense: 5000 }))
      expect(result.profitMargin).toBe(0)
    })

    it('收入 = 支出 → 利润率 = 0', () => {
      const result = calculateMetrics(input({ monthlyRevenue: 10000, monthlyExpense: 10000 }))
      expect(result.profitMargin).toBe(0)
    })

    it('支出 > 收入 → 利润率为负', () => {
      const result = calculateMetrics(input({ monthlyRevenue: 10000, monthlyExpense: 12000 }))
      expect(result.profitMargin).toBe(-20)
    })
  })

  describe('cashRunway', () => {
    it('现金 100, 月支出 10 → 10 个月', () => {
      const result = calculateMetrics(input({ cashOnHand: 100, monthlyExpense: 10 }))
      expect(result.cashRunway).toBe(10)
    })

    it('边界：支出 = 0 且有现金 → cashRunway = 999', () => {
      const result = calculateMetrics(input({ cashOnHand: 50000, monthlyExpense: 0 }))
      expect(result.cashRunway).toBe(999)
    })

    it('边界：支出 = 0 且无现金 → cashRunway = 0', () => {
      const result = calculateMetrics(input({ cashOnHand: 0, monthlyExpense: 0 }))
      expect(result.cashRunway).toBe(0)
    })
  })

  describe('debtToAssetRatio', () => {
    it('总资产 100, 负债 50 → 负债率 50%', () => {
      const result = calculateMetrics(input({ cashOnHand: 100, totalDebt: 50 }))
      expect(result.debtToAssetRatio).toBe(50)
    })

    it('边界：总资产 = 0 且有负债 → 负债率 = 100', () => {
      const result = calculateMetrics(input({ totalDebt: 100 }))
      expect(result.debtToAssetRatio).toBe(100)
    })

    it('边界：总资产 = 0 且无负债 → 负债率 = 0', () => {
      const result = calculateMetrics(input())
      expect(result.debtToAssetRatio).toBe(0)
    })

    it('总资产 = 现金 + 应收 + 固定资产 + 存货', () => {
      const result = calculateMetrics(
        input({
          cashOnHand: 25,
          accountsReceivable: 25,
          fixedAssets: 25,
          inventory: 25,
          totalDebt: 50,
        }),
      )
      expect(result.debtToAssetRatio).toBe(50)
    })
  })

  describe('liquidityRatio', () => {
    it('流动资产 150, 每月利息 10 → 流动比率 15', () => {
      const result = calculateMetrics(
        input({
          cashOnHand: 100,
          accountsReceivable: 30,
          inventory: 20,
          monthlyInterest: 10,
        }),
      )
      expect(result.liquidityRatio).toBe(15)
    })

    it('边界：利息 = 0 且有流动资产 → 流动比率 = 999', () => {
      const result = calculateMetrics(input({ cashOnHand: 100, monthlyInterest: 0 }))
      expect(result.liquidityRatio).toBe(999)
    })

    it('边界：利息 = 0 且无流动资产 → 流动比率 = 0', () => {
      const result = calculateMetrics(input({ monthlyInterest: 0 }))
      expect(result.liquidityRatio).toBe(0)
    })

    it('流动资产不含固定资产', () => {
      const result = calculateMetrics(
        input({
          cashOnHand: 100,
          fixedAssets: 500, // 固定资产不算流动资产
          monthlyInterest: 100,
        }),
      )
      expect(result.liquidityRatio).toBe(1)
    })
  })

  describe('全零极端情况', () => {
    it('所有字段为 0 → 四个指标都是 0', () => {
      const result = calculateMetrics(input())
      expect(result).toEqual({
        profitMargin: 0,
        cashRunway: 0,
        debtToAssetRatio: 0,
        liquidityRatio: 0,
      })
    })
  })
})
