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
      <section className="flex flex-col items-center px-6 pt-16 pb-6">
        {/* Logo / Icon */}
        <div className="w-32 h-32 mb-6 pointer-events-none">
          <img 
            src="/src/assets/logo.png" 
            alt="企微星" 
            className="w-full h-full object-contain"
          />
        </div>

        {/* 产品名 */}
        <h1
          className="text-3xl font-light tracking-[0.2em] mb-8"
          style={{ color: 'var(--color-primary)' }}
        >
          智财通
        </h1>

        {/* Slogan / Editorial Quote */}
        <div
          className="relative mt-2 mb-10 px-8 py-4 text-center border-y border-[var(--color-border)]"
        >
          <p
            className="text-base font-light italic leading-loose tracking-widest"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            “时至不行，反受其殃”
          </p>
          <p
            className="text-[10px] mt-2 opacity-60 tracking-[0.3em] uppercase"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            — 智财通 · 财务风险预警 —
          </p>
        </div>
      </section>

      {/* 行业选择 */}
      <section className="px-2 pb-6">
        <IndustrySelector
          selected={selectedIndustry}
          onSelect={setSelectedIndustry}
        />
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
