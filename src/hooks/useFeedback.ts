import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface FeedbackData {
  rating: number
  comment: string
  industry: string
  totalScore: number
}

/**
 * 反馈提交 Hook。
 *
 * 向 Supabase feedback 表插入一条记录。
 * 错误会被捕获并存入 error 状态，不会 throw 出去影响 UI。
 */
export function useFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitFeedback = useCallback(async (data: FeedbackData) => {
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)

    try {
      const { error: supabaseError } = await supabase.from('feedback').insert({
        rating: data.rating,
        comment: data.comment,
        industry: data.industry,
        total_score: data.totalScore,
        user_agent: navigator.userAgent,
      })

      if (supabaseError) {
        throw supabaseError
      }

      setIsSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : '提交失败，请稍后再试'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { submitFeedback, isSubmitting, isSuccess, error }
}
