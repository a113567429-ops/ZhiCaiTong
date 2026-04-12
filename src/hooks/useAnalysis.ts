import { useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import { calculateMetrics } from '@/engine/calculator'
import { scoreAllMetrics } from '@/engine/scorer'
import { generateReport } from '@/engine/interpreter'
import { BENCHMARKS } from '@/data/benchmarks'
import type { UserInput } from '@/engine/types'

/**
 * 分析流程 Hook。
 *
 * 调用 `runAnalysis()` 后会：
 * 1. dispatch SET_ANALYZING（开始加载动画）
 * 2. 延迟 1.5 秒（增强"分析中"的感知体验）
 * 3. 执行三步计算：指标计算 → 评分 → 解读生成
 * 4. dispatch SET_REPORT（结束加载，设置报告）
 */
export function useAnalysis() {
  const { state, dispatch } = useApp()

  const runAnalysis = useCallback((finalInput: UserInput) => {
    dispatch({ type: 'SET_ANALYZING', payload: true })

    // 模拟短暂计算延迟（增强"分析中"的感知）
    setTimeout(() => {
      // 防御判断：找不到行业基准时回退，避免崩溃
      const benchmark = BENCHMARKS[finalInput.industry]
      if (!benchmark) {
        console.error(`未找到行业"${finalInput.industry}"的基准数据，无法生成报告。`)
        dispatch({ type: 'SET_ANALYZING', payload: false })
        return
      }

      // 1. 计算指标
      const metrics = calculateMetrics(finalInput)

      // 2. 评分
      const { indicators, totalScore, level } = scoreAllMetrics(metrics, benchmark)

      // 3. 生成解读
      const report = generateReport(totalScore, level, indicators)

      dispatch({ type: 'SET_REPORT', payload: report })
    }, 1500) // 1.5 秒动画时间
  }, [dispatch])

  return {
    runAnalysis,
    isAnalyzing: state.isAnalyzing,
    report: state.report,
  }
}
