import LoginPage from "@/components/pages/home"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'CourierTrack Pro - Home',
  description: 'Streamline your delivery operations with real-time tracking, route optimization, and comprehensive management tools.'
}


export default function Page(){
  return <LoginPage />
}