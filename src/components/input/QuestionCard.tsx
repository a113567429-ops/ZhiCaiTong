import type { Question } from '@/data/questions'
import AmountSlider from './AmountSlider'
import AmountInput from './AmountInput'

interface QuestionCardProps {
  question: Question
  value: number
  onChange: (value: number) => void
}

/**
 * 单个问题卡片。
 *
 * 顶部显示问题标题（20px, bold）和可选辅助说明（14px, gray）。
 * 根据 inputType 渲染 AmountSlider 或 AmountInput。
 * 非必填问题显示"跳过"提示。
 */
export default function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  return (
    <div className="w-full px-4 py-6">
      {/* 问题标题 */}
      <h2
        className="font-bold leading-snug"
        style={{
          fontSize: '20px',
          color: 'var(--color-text)',
        }}
      >
        {question.question}
      </h2>

      {/* 辅助说明 */}
      {question.subtitle && (
        <p
          className="mt-2 leading-relaxed"
          style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
          }}
        >
          {question.subtitle}
        </p>
      )}

      {/* 非必填提示 */}
      {!question.required && (
        <span
          className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full"
          style={{
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-text-secondary)',
          }}
        >
          选填，可跳过
        </span>
      )}

      {/* 输入控件 */}
      {question.inputType === 'slider' ? (
        <AmountSlider
          value={value}
          onChange={onChange}
          min={question.min}
          max={question.max}
          step={question.step}
          unit={question.unit}
          useWan={question.useWan}
        />
      ) : (
        <AmountInput
          value={value}
          onChange={onChange}
          min={question.min}
          max={question.max}
          step={question.step}
          unit={question.unit}
          placeholder={`请输入${question.unit === '万元' ? '金额（万元）' : '金额（元）'}`}
        />
      )}
    </div>
  )
}
