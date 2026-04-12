import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import Header from '@/components/layout/Header'
import MobileContainer from '@/components/layout/MobileContainer'
import ScoreCard from '@/components/report/ScoreCard'
import ScoreGauge from '@/components/report/ScoreGauge'
import RadarChart from '@/components/report/RadarChart'
import IndicatorCard from '@/components/report/IndicatorCard'
import Interpretation from '@/components/report/Interpretation'
import { Loader2, RefreshCw, MessageSquare } from 'lucide-react'

export default function ReportPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const { report, isAnalyzing } = state

  // 路由守卫：如果没有在分析且没有报告，直接重定向回首页
  useEffect(() => {
    if (!isAnalyzing && !report) {
      navigate('/', { replace: true })
    }
  }, [isAnalyzing, report, navigate])

  if (isAnalyzing) {
    return (
      <MobileContainer>
        <Header />
        <div className="flex flex-col items-center justify-center flex-1 min-h-[80vh]">
          <Loader2
            className="w-12 h-12 animate-spin mb-4"
            style={{ color: 'var(--color-primary-gold)' }}
          />
          <h2
            className="text-lg font-medium"
            style={{ color: 'var(--color-primary)' }}
          >
            正在体检中...
          </h2>
          <p
            className="text-sm mt-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            请稍候，正在生成多维度分析报告
          </p>
        </div>
      </MobileContainer>
    )
  }

  if (!report) return null

  return (
    <MobileContainer>
      <Header />

      <main className="px-4 py-6 flex flex-col gap-6">
        <ScoreCard
          score={report.totalScore}
          level={report.level}
          summary={report.summary}
        />

        <div
          className="rounded-2xl px-2 py-6 flex flex-col items-center gap-4"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <h3
            className="text-lg font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            健康仪表盘
          </h3>
          <ScoreGauge score={report.totalScore} level={report.level} />
        </div>

        <div
          className="rounded-2xl px-2 py-6 flex flex-col items-center gap-2"
          style={{ backgroundColor: 'var(--color-card)' }}
        >
          <h3
            className="text-lg font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            指标雷达分析
          </h3>
          <RadarChart indicators={report.indicators} />
        </div>

        <div className="flex flex-col gap-4">
          <h3
            className="text-lg font-bold px-2"
            style={{ color: 'var(--color-primary)' }}
          >
            各项指标诊断详情
          </h3>
          {report.indicators.map((ind) => (
            <IndicatorCard key={ind.key} indicator={ind} />
          ))}
        </div>

        <Interpretation report={report} />
      </main>

      {/* 底部操作区 */}
      <div
        className="sticky bottom-0 px-4 py-4 z-10"
        style={{
          backgroundColor: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.02)',
        }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => {
              dispatch({ type: 'RESET' })
              navigate('/')
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-xl transition-colors"
            style={{
              backgroundColor: 'var(--color-card)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            <RefreshCw size={18} />
            重新测试
          </button>
          <button
            onClick={() => navigate('/feedback')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold rounded-xl transition-shadow"
            style={{
              background: 'linear-gradient(135deg, #775a19 0%, #C5A059 100%)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)',
            }}
          >
            <MessageSquare size={18} />
            提交反馈
          </button>
        </div>
      </div>
    </MobileContainer>
  )
}
