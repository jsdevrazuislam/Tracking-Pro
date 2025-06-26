import AdminBookingList from "@/components/pages/admin-bookings";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Tracking Pro - All bookings',
    description: 'test description'
}

export default function Page(){
    return <AdminBookingList />
}