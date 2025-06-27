import AssignParcels from "@/components/pages/assign-parcel";
import { Metadata } from "next";

export const metadata:Metadata = {
  title: 'Tracking Pro - Assign Parcel',
  description: 'test description'
}

const Page = () => {
  return (
    <AssignParcels />
  )
}

export default Page