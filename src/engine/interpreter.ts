import type { IndicatorScore, AnalysisReport, IndicatorLevel } from './types'

/** 总体等级 → 表情映射 */
const EMOJI_MAP: Record<IndicatorLevel, string> = {
  green: '😊',
  yellow: '🤔',
  red: '⚠️',
}

/** 总体等级 → 一句话总结 */
const SUMMARIES: Record<IndicatorLevel, string> = {
  green: '你的企业财务状况整体健康，继续保持！',
  yellow: '企业整体还行，但有些方面需要注意一下。',
  red: '企业财务存在明显风险点，建议重点关注以下问题。',
}

// ─── 四个私有解读函数 ───────────────────────────────────────────

/** 利润率解读 */
function interpretProfitMargin(ind: IndicatorScore): IndicatorScore {
  const v = ind.value
  if (ind.level === 'green') {
    return {
      ...ind,
      interpretation: `利润率 ${v.toFixed(1)}%，每收入100块能赚 ${v.toFixed(0)} 块，不错！`,
      advice: '盈利能力健康，可以考虑适当留存利润作为发展资金。',
    }
  }
  if (ind.level === 'yellow') {
    return {
      ...ind,
      interpretation: `利润率 ${v.toFixed(1)}%，赚得不算多，但还在正常范围内。`,
      advice: '利润就像体重——不胖不瘦最好。可以看看哪些开支能省一省。',
    }
  }
  return {
    ...ind,
    interpretation:
      v <= 0
        ? `目前处于亏损状态，每月亏 ${Math.abs(v).toFixed(1)}%。`
        : `利润率只有 ${v.toFixed(1)}%，赚的钱很薄。`,
    advice: '利润太薄就像走钢丝——任何意外支出都可能让你亏损。需要认真想想怎么增收或降本。',
  }
}

/** 现金流解读 */
function interpretCashRunway(ind: IndicatorScore): IndicatorScore {
  const months = ind.value
  if (ind.level === 'green') {
    return {
      ...ind,
      interpretation: `手头现金够用 ${months.toFixed(1)} 个月，现金储备充足。`,
      advice: '现金流充裕，就像身体血液充足，抵抗力强。',
    }
  }
  if (ind.level === 'yellow') {
    return {
      ...ind,
      interpretation: `现金只够维持 ${months.toFixed(1)} 个月，有点紧张。`,
      advice: '现金流就像身体的血液，流得太快会贫血。建议存够至少3个月的备用金。',
    }
  }
  return {
    ...ind,
    interpretation: `现金只够撑 ${months.toFixed(1)} 个月，非常危险！`,
    advice: '如果经营突然停顿，你几乎没有缓冲时间。这是最需要立即解决的问题。',
  }
}

/** 负债率解读 */
function interpretDebtRatio(ind: IndicatorScore): IndicatorScore {
  const v = ind.value
  if (ind.level === 'green') {
    return {
      ...ind,
      interpretation: `负债率 ${v.toFixed(0)}%，借的钱不多，负担可控。`,
      advice: '负债水平健康，就像车贷占收入比例合理，生活轻松。',
    }
  }
  if (ind.level === 'yellow') {
    return {
      ...ind,
      interpretation: `负债率 ${v.toFixed(0)}%，借的钱有点多了，要注意。`,
      advice: '欠钱就像背包里装石头——走得动但比较累。尽量别再加了。',
    }
  }
  return {
    ...ind,
    interpretation: `负债率高达 ${v.toFixed(0)}%，债务压力很大！`,
    advice: '欠钱太多就像身上绑着沙袋游泳——很危险。优先想办法减少负债。',
  }
}

/** 流动比率解读 */
function interpretLiquidity(ind: IndicatorScore): IndicatorScore {
  const v = ind.value
  if (ind.level === 'green') {
    return {
      ...ind,
      interpretation: `流动比率 ${v.toFixed(1)}，短期还钱没压力。`,
      advice: '短期偿债能力充足，不用担心突然要还钱的情况。',
    }
  }
  if (ind.level === 'yellow') {
    return {
      ...ind,
      interpretation: `流动比率 ${v.toFixed(1)}，如果突然要还钱会有点紧。`,
      advice: '就像信用卡还款日前要凑钱的感觉——能还上但不轻松。',
    }
  }
  return {
    ...ind,
    interpretation: `流动比率只有 ${v.toFixed(1)}，手头的钱不够还短期的债。`,
    advice: '这意味着如果债主同时来要钱，你可能周转不开。需要尽快改善。',
  }
}

// ─── 分发表 ──────────────────────────────────────────────────────

const INTERPRETERS: Record<string, (ind: IndicatorScore) => IndicatorScore> = {
  profitMargin: interpretProfitMargin,
  cashRunway: interpretCashRunway,
  debtToAssetRatio: interpretDebtRatio,
  liquidityRatio: interpretLiquidity,
}

// ─── 入口函数 ────────────────────────────────────────────────────

/**
 * 根据评分结果生成完整的 AnalysisReport。
 *
 * 为每个 IndicatorScore 填充 interpretation / advice，
 * 并附加 emoji、summary、generatedAt 等报告元信息。
 */
export function generateReport(
  totalScore: number,
  level: IndicatorLevel,
  indicators: IndicatorScore[],
): AnalysisReport {
  const interpreted = indicators.map((ind) => {
    const fn = INTERPRETERS[ind.key]
    return fn ? fn(ind) : ind
  })

  return {
    totalScore,
    level,
    emoji: EMOJI_MAP[level],
    summary: SUMMARIES[level],
    indicators: interpreted,
    generatedAt: new Date().toISOString(),
  }
}
