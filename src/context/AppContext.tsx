import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { UserInput, AnalysisReport, Industry } from '@/engine/types'

// ─── State ──────────────────────────────────────────────────────

export interface AppState {
  currentStep: number // 当前问题步骤 (0-indexed)
  industry: Industry | null
  userInput: Partial<UserInput>
  report: AnalysisReport | null
  isAnalyzing: boolean
}

const initialState: AppState = {
  currentStep: 0,
  industry: null,
  userInput: {},
  report: null,
  isAnalyzing: false,
}

// ─── Actions ────────────────────────────────────────────────────

export type AppAction =
  | { type: 'SET_INDUSTRY'; payload: Industry }
  | { type: 'SET_INPUT'; payload: { field: string; value: number } }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_REPORT'; payload: AnalysisReport }
  | { type: 'SET_ANALYZING'; payload: boolean }
  | { type: 'RESET' }

// ─── Reducer ────────────────────────────────────────────────────

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INDUSTRY':
      // 选择行业时重置 userInput，只保留 industry 字段
      return {
        ...state,
        industry: action.payload,
        userInput: { industry: action.payload },
      }

    case 'SET_INPUT':
      // 合并更新对应字段
      return {
        ...state,
        userInput: {
          ...state.userInput,
          [action.payload.field]: action.payload.value,
        },
      }

    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 }

    case 'PREV_STEP':
      // 下界保护，不能低于 0
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) }

    case 'SET_REPORT':
      // 设置报告的同时将 isAnalyzing 置 false
      return { ...state, report: action.payload, isAnalyzing: false }

    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// ─── Context & Provider ─────────────────────────────────────────

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// ─── Hook ───────────────────────────────────────────────────────

/**
 * 访问全局状态。必须在 AppProvider 内部使用，否则抛出错误。
 */
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return ctx
}
