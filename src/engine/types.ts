/** 支持的行业类型 */
export type Industry = 'hotel' | 'realestate' | 'service' | 'construction'

/** 用户输入的原始数据 */
export interface UserInput {
  industry: Industry
  monthlyRevenue: number // 月均营业收入（元）
  monthlyExpense: number // 月均总支出（元）
  cashOnHand: number // 现金及等价物（元）
  accountsReceivable: number // 应收账款（元），默认 0
  totalDebt: number // 应付账款+借款（元），默认 0
  fixedAssets: number // 固定资产（元），默认 0
  inventory: number // 存货（元），默认 0
}

/** 计算得出的财务指标 */
export interface FinancialMetrics {
  profitMargin: number // 利润率 (%)
  cashRunway: number // 现金可维持月数
  debtToAssetRatio: number // 资产负债率 (%)
  liquidityRatio: number // 流动比率
}

/** 红绿灯等级 */
export type IndicatorLevel = 'green' | 'yellow' | 'red'

/** 单项指标评分 */
export interface IndicatorScore {
  name: string // 指标名称（中文）
  key: keyof FinancialMetrics
  value: number // 原始值
  score: number // 0-100 评分
  level: IndicatorLevel // 红绿灯
  label: string // 等级标签："健康" | "需关注" | "有风险"
  interpretation: string // 一句话解读
  advice: string // 比喻化建议
}

/** 完整分析报告 */
export interface AnalysisReport {
  totalScore: number // 总分 (0-100)
  level: IndicatorLevel
  emoji: string // 对应表情
  summary: string // 一句话总结
  indicators: IndicatorScore[]
  generatedAt: string // ISO 时间戳
}

/** 单个指标的基准区间配置 */
export interface MetricBenchmark {
  green: [number, number] // 健康区间
  yellow: [number, number] // 关注区间
  red: [number, number] // 风险区间
  weight: number // 权重 (0-1)
}

/** 行业基准配置 */
export interface IndustryBenchmark {
  industry: Industry
  label: string // 行业中文名
  metrics: {
    [K in keyof FinancialMetrics]: MetricBenchmark
  }
}
