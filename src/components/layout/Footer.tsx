/**
 * 页脚版权信息。
 *
 * 浅灰色文字，12px 字号，居中显示。
 */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="py-6 text-center"
      style={{
        fontSize: '12px',
        color: 'var(--color-text-secondary)',
      }}
    >
      <p>© {year} 智财通 · 企业财务健康体检</p>
      <p className="mt-1 opacity-60">仅供参考，不构成专业财务建议</p>
    </footer>
  )
}
