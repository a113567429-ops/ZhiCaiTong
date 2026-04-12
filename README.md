# 智财通 - 企业财务健康体检

「智财通」是一款轻量级、无需注册的移动端财务健康检查小程序（H5）。提供类似心理测试的顺滑交互体验，只需输入几项核心数据，30秒瞬间生成专业的企业财务健康报告与风险建议。目前已内置针对“酒店管理”行业的深度财务指标模型。

## ⭐️ 核心特性

- **现代 UI 体验设计**：采用典雅柔和的羊皮纸金融色调及磨砂质感，配备丝滑过场动画。
- **纯前端极速分析引擎**：直接在客户端高速计算各项关键财务指标 (利润率、现金流动维持月数、各种资金比例)，本地运算带来 0 延迟守护。
- **动态基准体系**：内置不同体量的行业基准点 (目前实装"酒店管理")，根据当前收入支出水平智能判定绿/黄/红状态风险。
- **响应式交互与移动优先**：专为原生手机与移动端布局（不超过480px限宽）。

## 🛠️ 技术栈

- 框架：React v19 + TypeScript + Vite
- 样式/UI组件库积木：Tailwind CSS (v4) + shadcn/ui + class-variance-authority + tailwind-merge
- 图表组件库引擎：Recharts (绘制动态定制化多维雷达图、环形高光温度表)
- 全局状态管理机制：React `useReducer` + `Context` 的轻量封装
- 动画交互：tw-animate-css 
- 反馈投递服务引擎：Supabase

## 🚀 本地运行指南

1. **配置环境变量**：复制 `.env.example` 到 `.env.local`。并将所需的 Supabase Key 配置完毕。
   ```bash
   cp .env.example .env.local
   ```
2. **安装依赖资源**：
   ```bash
   pnpm install
   ```
3. **启动开发服务器**：
   ```bash
   pnpm dev
   ```
4. **编译与预览** (部署前检查)：
   ```bash
   pnpm build      # 输出优化产物至 dist
   pnpm preview    # 预览构建的静态打包结果
   ```

## 🌍 Vercel 部署发布

项目已内置针对 `Vercel` 运行专门配置的 `vercel.json`。
你可以直接在 Vercel 中 Import 项目，无需任何额外环境配置，Vercel 会自动解析 Vite 指令生成 SPA 单页缓存加速链路（配合 `rewrites` 方案应对所有二级路由回源）。
- 环境变量: 请勿忘记在 Vercel 面板将 `VITE_SUPABASE_URL` 及 `VITE_SUPABASE_ANON_KEY` 加回！

## 📄 LICENSE

PRIVATE
