import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import type { Industry } from '@/engine/types'
import Header from '@/components/layout/Header'
import MobileContainer from '@/components/layout/MobileContainer'
import IndustrySelector from '@/components/input/IndustrySelector'
import Footer from '@/components/layout/Footer'

/**
 * 首页 — 产品介绍 + 行业选择 + 启动入口。
 *
 * 布局：Header → Hero（logo + 标题 + 副标题 + slogan）→ IndustrySelector → CTA → Footer
 * 选择行业后 CTA 按钮激活，点击后 dispatch SET_INDUSTRY → navigate('/questionnaire')。
 */
export default function HomePage() {
  const navigate = useNavigate()
  const { dispatch } = useApp()
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null)

  function handleStart() {
    if (!selectedIndustry) return
    dispatch({ type: 'SET_INDUSTRY', payload: selectedIndustry })
    navigate('/questionnaire')
  }

  return (
    <MobileContainer>
      <Header />

      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center px-6 pt-10 pb-6">
        {/* Logo / Icon */}
        <div
          className="flex items-center justify-center w-20 h-20 rounded-2xl mb-5"
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-mid) 100%)',
            boxShadow: '0 8px 24px rgba(78, 54, 41, 0.18)',
          }}
        >
          <span className="text-4xl" role="img" aria-label="智财通">
            💰
          </span>
        </div>

        {/* 产品名 */}
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: 'var(--color-primary)' }}
        >
          智财通
        </h1>

        {/* 副标题 */}
        <p
          className="text-base leading-relaxed mb-1"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          企业财务健康体检
        </p>

        {/* Tagline */}
        <p
          className="text-lg font-semibold mb-2"
          style={{ color: 'var(--color-primary-gold)' }}
        >
          30秒了解企业财务健康状况
        </p>

        {/* Slogan / Editorial Quote */}
        <div
          className="relative mt-2 mb-2 px-5 py-3 text-center"
          style={{
            borderLeft: '3px solid var(--color-primary-gold)',
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-input)',
          }}
        >
          <p
            className="text-sm italic leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            "时至不行，反受其殃"
          </p>
          <p
            className="text-xs mt-1 opacity-70"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            — 了解财务风险，防患于未然
          </p>
        </div>
      </section>

      {/* ── 特色亮点 ── */}
      <section className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '⚡', title: '快速体检', desc: '7道题 · 30秒' },
            { icon: '📊', title: '专业分析', desc: '4维度指标' },
            { icon: '💡', title: '通俗易懂', desc: '比喻化解读' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center py-4 px-2 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-primary-light)',
              }}
            >
              <span className="text-2xl mb-2">{item.icon}</span>
              <span
                className="text-sm font-semibold mb-0.5"
                style={{ color: 'var(--color-primary)' }}
              >
                {item.title}
              </span>
              <span
                className="text-xs"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 行业选择 ── */}
      <section className="px-2 pb-2">
        <IndustrySelector
          selected={selectedIndustry}
          onSelect={setSelectedIndustry}
        />
      </section>

      {/* ── CTA 按钮 ── */}
      <section className="px-6 pt-2 pb-4">
        <button
          id="start-btn"
          onClick={handleStart}
          disabled={!selectedIndustry}
          className="w-full py-4 text-lg font-semibold tracking-wide rounded-xl transition-all duration-300"
          style={{
            background: selectedIndustry
              ? 'linear-gradient(135deg, #775a19 0%, #C5A059 100%)'
              : 'var(--color-border)',
            color: selectedIndustry ? '#FFFFFF' : 'var(--color-text-secondary)',
            cursor: selectedIndustry ? 'pointer' : 'not-allowed',
            boxShadow: selectedIndustry
              ? '0 6px 20px rgba(197, 160, 89, 0.35)'
              : 'none',
            minHeight: '52px',
            borderRadius: 'var(--radius-button)',
          }}
        >
          {selectedIndustry ? '开始体检 →' : '请先选择行业'}
        </button>
      </section>

      {/* ── 信任提示 ── */}
      <section className="px-6 pb-6">
        <div className="flex items-center justify-center gap-4">
          {[
            { icon: '🔒', text: '数据不落库' },
            { icon: '🆓', text: '完全免费' },
            { icon: '⏱️', text: '无需注册' },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--color-text-secondary)', opacity: 0.8 }}
            >
              <span>{item.icon}</span> {item.text}
            </span>
          ))}
        </div>
      </section>

      <Footer />
    </MobileContainer>
  )
}
