import { useState, useEffect } from 'react'
import { useFeedback } from '@/hooks/useFeedback'
import { Button } from '@/components/ui/button'

interface FeedbackFormProps {
  industry: string
  totalScore: number
  onSuccess?: () => void
}

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="text-3xl transition-transform hover:scale-110 active:scale-95"
          style={{
            color:
              star <= (hovered || value)
                ? 'var(--color-primary-gold)'
                : 'var(--color-border)',
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          aria-label={`${star} 星`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default function FeedbackForm({
  industry,
  totalScore,
  onSuccess,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const { submitFeedback, isSubmitting, isSuccess, error } = useFeedback()

  const handleSubmit = async () => {
    if (rating === 0) return
    await submitFeedback({ rating, comment, industry, totalScore })
  }

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess()
    }
  }, [isSuccess, onSuccess])

  if (isSuccess) {
    return (
      <div
        className="w-full rounded-2xl px-6 py-10 text-center"
        style={{
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <span className="text-5xl leading-none">🙏</span>
        <p
          className="mt-4 font-semibold text-lg"
          style={{ color: 'var(--color-text)' }}
        >
          感谢你的反馈！
        </p>
        <p
          className="mt-2 text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          你的建议将帮助我们做得更好
        </p>
      </div>
    )
  }

  return (
    <div
      className="w-full rounded-2xl px-6 py-6 flex flex-col gap-5"
      style={{
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      {/* 标题 */}
      <p
        className="font-semibold text-base"
        style={{ color: 'var(--color-text)' }}
      >
        觉得这次体检怎么样？
      </p>

      {/* 星级评分 */}
      <div className="flex flex-col gap-2">
        <span
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          评分
        </span>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* 文字建议 */}
      <div className="flex flex-col gap-2">
        <span
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          建议
        </span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="有什么想说的？"
          rows={4}
          className="w-full resize-none rounded-xl px-4 py-3 text-sm leading-relaxed outline-none transition-shadow focus:ring-2 focus:ring-(--color-primary-gold)"
          style={{
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-input)',
          }}
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <p className="text-sm" style={{ color: 'var(--color-red)' }}>
          {error}
        </p>
      )}

      {/* 提交按钮 */}
      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className="w-full h-11 text-base font-semibold"
        style={{
          backgroundColor:
            rating === 0 ? 'var(--color-border)' : 'var(--color-primary-gold)',
          color: '#fff',
          borderRadius: 'var(--radius-button)',
        }}
      >
        {isSubmitting ? '提交中...' : '提交反馈'}
      </Button>
    </div>
  )
}
