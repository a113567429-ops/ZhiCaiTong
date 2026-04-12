import type { ReactNode } from 'react'

interface MobileContainerProps {
  children: ReactNode
}

/**
 * 移动端居中容器。
 *
 * 外层铺满屏幕（暖棕底色），内层限宽 480px 白色区域。
 * PC 端两侧露出底色，手机端满屏白卡。
 */
export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div
      className="min-h-screen flex justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div
        className="w-full max-w-md min-h-screen shadow-sm"
        style={{ backgroundColor: 'var(--color-card)' }}
      >
        {children}
      </div>
    </div>
  )
}
