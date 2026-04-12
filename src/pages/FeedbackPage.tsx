import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import Header from '@/components/layout/Header'
import MobileContainer from '@/components/layout/MobileContainer'
import FeedbackForm from '@/components/feedback/FeedbackForm'

export default function FeedbackPage() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [countdown, setCountdown] = useState<number | null>(null)

  // 处理提交成功
  const handleSuccess = useCallback(() => {
    setCountdown(3)
  }, [])

  // 倒计时逻辑
  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      navigate('/', { replace: true })
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, navigate])

  return (
    <MobileContainer>
      <Header showBack={countdown === null} onBack={() => navigate(-1)} />
      
      <main className="px-4 py-8 flex flex-col gap-6">
        <div className="text-center mb-4">
          <h1 
            className="text-2xl font-bold mb-2 tracking-wide"
            style={{ color: 'var(--color-primary)' }}
          >
            意见与建议
          </h1>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            你的声音对我们非常重要
          </p>
        </div>

        <FeedbackForm 
          industry={state.industry || '未知行业'}
          totalScore={state.report?.totalScore || 0}
          onSuccess={handleSuccess}
        />

        {countdown !== null && (
          <p 
            className="text-center text-sm animate-in fade-in"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {countdown} 秒后自动返回首页...
          </p>
        )}
      </main>
    </MobileContainer>
  )
}
