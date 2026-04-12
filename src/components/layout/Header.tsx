import { ChevronLeft } from 'lucide-react'

interface HeaderProps {
  /** 是否显示左侧返回按钮 */
  showBack?: boolean
  /** 返回按钮点击回调 */
  onBack?: () => void
}

/**
 * 顶部导航栏。
 *
 * 深棕背景 (#4E3629)，白色文字，固定高度 56px。
 * 左侧 logo + 产品名"智财通"，可选右侧返回按钮。
 */
export default function Header({ showBack = false, onBack }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-4"
      style={{
        backgroundColor: 'var(--color-primary)',
        height: '56px',
      }}
    >
      {/* 左侧：返回按钮 或 Logo */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 -ml-1 rounded-lg transition-colors"
            style={{ color: '#FFFFFF' }}
            aria-label="返回"
          >
            <ChevronLeft size={24} />
          </button>
        ) : null}
        <h1
          className="text-lg font-bold tracking-wide"
          style={{ color: '#FFFFFF' }}
        >
          智财通
        </h1>
      </div>

      {/* 右侧预留空间 */}
      <div className="w-9" />
    </header>
  )
}
