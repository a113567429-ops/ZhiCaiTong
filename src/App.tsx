import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import HomePage from '@/pages/HomePage'
import QuestionnairePage from '@/pages/QuestionnairePage'
import ReportPage from '@/pages/ReportPage'
import FeedbackPage from '@/pages/FeedbackPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
