import type { AnalysisReport } from '@/engine/types'

interface InterpretationProps {
  report: AnalysisReport
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `生成于 ${year}-${month}-${day} ${hour}:${min}`
}

export default function Interpretation({ report }: InterpretationProps) {
  return (
    <div
      className="w-full rounded-2xl px-6 py-6 border"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <p
        className="leading-loose font-light tracking-wide italic"
        style={{ fontSize: '16px', color: 'var(--color-text)' }}
      >
        "{report.summary}"
      </p>

      <p
        className="mt-4 text-[10px] tracking-widest uppercase opacity-50"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {formatTimestamp(report.generatedAt)}
      </p>
    </div>
  )
}
