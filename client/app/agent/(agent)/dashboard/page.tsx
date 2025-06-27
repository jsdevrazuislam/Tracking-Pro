import AgentDashboard from '@/components/pages/agent-dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tracking Pro - Agent Dashboard',
  description: 'Test description'
}

const Page = () => {
  return (
    <AgentDashboard />
  )
}

export default Page