import TrackParcel from "@/components/pages/search-track";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Tracking Pro - Track',
  description: 'Test Description'
}


export default function Page(){
  return <TrackParcel />
}