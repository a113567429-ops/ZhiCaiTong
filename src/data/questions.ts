import type { UserInput } from '@/engine/types'

export interface Question {
  id: string
  field: keyof UserInput // 映射到 UserInput 字段
  question: string // 用户看到的问题（日常语言）
  subtitle?: string // 补充说明
  inputType: 'slider' | 'number'
  required: boolean
  defaultValue: number
  min: number
  max: number
  step: number
  unit: string // "元", "万元"
  useWan: boolean // 是否以"万"为单位展示
}

export const HOTEL_QUESTIONS: Question[] = [
  {
    id: 'revenue',
    field: 'monthlyRevenue',
    question: '你每个月大概能收到多少钱？',
    subtitle: '包括客房收入、餐饮收入、会议室、停车等所有营业收入',
    inputType: 'slider',
    required: true,
    defaultValue: 10,
    min: 0,
    max: 200,
    step: 1,
    unit: '万元',
    useWan: true,
  },
  {
    id: 'expense',
    field: 'monthlyExpense',
    question: '每个月要花出去多少钱？',
    subtitle: '物业/房租、员工工资、维修保养、水电煤气等所有运营支出',
    inputType: 'slider',
    required: true,
    defaultValue: 8,
    min: 0,
    max: 200,
    step: 1,
    unit: '万元',
    useWan: true,
  },
  {
    id: 'cash',
    field: 'cashOnHand',
    question: '现在手上还有多少现金？',
    subtitle: '银行账户余额 + 手头现金 + 备用金',
    inputType: 'number',
    required: true,
    defaultValue: 0,
    min: 0,
    max: 99999999,
    step: 1000,
    unit: '元',
    useWan: false,
  },
  {
    id: 'receivable',
    field: 'accountsReceivable',
    question: '别人还欠你多少钱没给？',
    subtitle: '企业客户未付房款、租金未收、押金未退等应收款项',
    inputType: 'number',
    required: false,
    defaultValue: 0,
    min: 0,
    max: 99999999,
    step: 1000,
    unit: '元',
    useWan: false,
  },
  {
    id: 'debt',
    field: 'totalDebt',
    question: '你欠别人多少钱？',
    subtitle: '银行贷款、供应商应付款、预收押金退款等',
    inputType: 'number',
    required: false,
    defaultValue: 0,
    min: 0,
    max: 99999999,
    step: 1000,
    unit: '元',
    useWan: false,
  },
  {
    id: 'interest',
    field: 'monthlyInterest',
    question: '每月平均要付多少利息？',
    subtitle: '银行贷款利息、民间借款利息等（不含本金）',
    inputType: 'number',
    required: false,
    defaultValue: 0,
    min: 0,
    max: 9999999,
    step: 100,
    unit: '元',
    useWan: false,
  },
  {
    id: 'assets',
    field: 'fixedAssets',
    question: '物业、装修和设备大概值多少钱？',
    subtitle: '含房产/租赁资产、装修、家具、厨房设备等，粗略估计即可',
    inputType: 'number',
    required: false,
    defaultValue: 0,
    min: 0,
    max: 99999999,
    step: 10000,
    unit: '元',
    useWan: false,
  },
  {
    id: 'inventory',
    field: 'inventory',
    question: '备用耗材和物料库存大概值多少钱？',
    subtitle: '床品备件、清洁用品、餐厅食材等库存物资',
    inputType: 'number',
    required: false,
    defaultValue: 0,
    min: 0,
    max: 99999999,
    step: 1000,
    unit: '元',
    useWan: false,
  },
]
