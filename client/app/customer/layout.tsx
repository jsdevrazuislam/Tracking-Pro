import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import React from 'react'

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardLayout>
        {children}
    </DashboardLayout>
  )
}

export default CustomerLayout