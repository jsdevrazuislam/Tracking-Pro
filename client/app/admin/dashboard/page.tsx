import AdminDashboard from "@/components/pages/admin-dashboard"
import { Metadata } from "next"

export const metadata:Metadata = {
  title: 'Tracking Pro - Admin',
  description: 'Test description'
}

const Page = () => {
  return (
    <AdminDashboard />
  )
}

export default Page