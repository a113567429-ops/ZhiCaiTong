import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useAnalysis } from '@/hooks/useAnalysis'
import { HOTEL_QUESTIONS } from '@/data/questions'
import type { Question } from '@/data/questions'
import Header from '@/components/layout/Header'
import MobileContainer from '@/components/layout/MobileContainer'
import ProgressBar from '@/components/input/ProgressBar'
import QuestionCard from '@/components/input/QuestionCard'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

/**
 * 问答流程页 — 逐题引导用户输入财务数据。
 *
 * 从 AppContext 读取 currentStep 和 industry，根据 industry 获取问题列表。
 * 支持上一步/下一步导航，必填校验，最后一题触发分析。
 *
 * 路由守卫：若未选择行业（直接访问 /questionnaire），自动重定向首页。
 */
export default function QuestionnairePage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const { runAnalysis } = useAnalysis()

  // 当前问题列表（当前仅酒店管理）
  const questions: Question[] = HOTEL_QUESTIONS
  const totalSteps = questions.length

  const { currentStep, industry, userInput } = state
  const currentQuestion = questions[currentStep]

  // 本地值状态 — 每道题维护一个当前编辑值
  // 初始值取 userInput 中已存的值（回退时保留数据），否则取 defaultValue
  const getStoredValue = (q: Question): number => {
    const stored = userInput[q.field]
    if (stored !== undefined) {
      // 如果是万元字段，从元转回万元单位用于展示
      return q.useWan ? (stored as number) / 10000 : (stored as number)
    }
    return q.defaultValue
  }

  const [localValue, setLocalValue] = useState<number>(() =>
    currentQuestion ? getStoredValue(currentQuestion) : 0,
  )

  // 校验提示
  const [showError, setShowError] = useState(false)

  // 路由守卫：未选行业 → 重定向首页
  useEffect(() => {
    if (!industry) {
      navigate('/', { replace: true })
    }
  }, [industry, navigate])

  // 当 currentStep 变化时，同步 localValue
  useEffect(() => {
    if (currentQuestion) {
      setLocalValue(getStoredValue(currentQuestion))
      setShowError(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep])

  if (!industry || !currentQuestion) return null

  const isLastStep = currentStep === totalSteps - 1
  const isFirstStep = currentStep === 0

  /** 保存当前值到全局状态 */
  function saveCurrentValue() {
    const fieldValue = currentQuestion.useWan
      ? localValue * 10000 // 万元→元
      : localValue
    dispatch({
      type: 'SET_INPUT',
      payload: { field: currentQuestion.field, value: fieldValue },
    })
  }

  /** 下一步 / 完成 */
  function handleNext() {
    // 必填校验：值为 0 且 required
    if (currentQuestion.required && localValue === 0) {
      setShowError(true)
      return
    }
    setShowError(false)

    // 保存当前值
    saveCurrentValue()

    if (isLastStep) {
      // 最后一题 → 触发分析 + 跳转报告页
      runAnalysis()
      navigate('/report')
    } else {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  /** 上一步 */
  function handlePrev() {
    // 保存当前值（即便未填完也保留）
    saveCurrentValue()

    if (isFirstStep) {
      navigate('/')
    } else {
      dispatch({ type: 'PREV_STEP' })
    }
  }

  /** 跳过（非必填题） */
  function handleSkip() {
    // 设为 0 保存并前进
    dispatch({
      type: 'SET_INPUT',
      payload: { field: currentQuestion.field, value: 0 },
    })

    if (isLastStep) {
      runAnalysis()
      navigate('/report')
    } else {
      dispatch({ type: 'NEXT_STEP' })
    }
  }

  return (
    <MobileContainer>
      <Header
        showBack
        onBack={handlePrev}
      />

      {/* 进度条 */}
      <ProgressBar current={currentStep + 1} total={totalSteps} />

      {/* 问题卡片 — 带入场动画 */}
      <div
        key={currentStep}
        className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300"
      >
        <QuestionCard
          key={currentStep}
          question={currentQuestion}
          value={localValue}
          onChange={(v) => {
            setLocalValue(v)
            setShowError(false)
          }}
        />

        {/* 必填校验提示 */}
        {showError && (
          <div
            className="mx-4 px-4 py-2.5 rounded-lg text-sm animate-in fade-in duration-200"
            style={{
              backgroundColor: 'var(--color-red-bg)',
              color: 'var(--color-red)',
            }}
          >
            ⚠️ 这道题是必填项，请输入后继续
          </div>
        )}
      </div>

      {/* ── 底部操作栏 ── */}
      <div
        className="sticky bottom-0 px-4 py-4"
        style={{
          backgroundColor: 'var(--color-card)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {/* 跳过按钮（仅非必填题显示） */}
        {!currentQuestion.required && (
          <button
            onClick={handleSkip}
            className="w-full mb-3 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent',
            }}
          >
            跳过这题 →
          </button>
        )}

        <div className="flex gap-3">
          {/* 上一步按钮 */}
          <button
            onClick={handlePrev}
            className="flex items-center justify-center gap-1 py-3.5 px-5 text-sm font-semibold rounded-xl transition-all duration-200"
            style={{
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-button)',
              minHeight: '48px',
            }}
          >
            <ChevronLeft size={18} />
            上一步
          </button>

          {/* 下一步 / 完成按钮 */}
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-1 py-3.5 text-base font-semibold tracking-wide rounded-xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #775a19 0%, #C5A059 100%)',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(197, 160, 89, 0.3)',
              borderRadius: 'var(--radius-button)',
              minHeight: '48px',
            }}
          >
            {isLastStep ? (
              <>
                完成 <Check size={18} />
              </>
            ) : (
              <>
                下一步 <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </MobileContainer>
  )
}
