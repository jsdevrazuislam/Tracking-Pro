import CustomerDashboard from '@/components/pages/customer-dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CourierTrack Pro',
  description:'Streamline your delivery operations with real-time tracking, route optimization, and comprehensive management tools.'
}

const Page = () => {
  return (
    <CustomerDashboard />
  )
}

export default Page