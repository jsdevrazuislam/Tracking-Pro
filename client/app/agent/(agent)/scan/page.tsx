import ScannerPage from "@/components/pages/parcel-scan-agent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Tracking Pro - Parcel Scan',
    description: 'Test Description'
}

export default function Page(){
    return <ScannerPage />
}