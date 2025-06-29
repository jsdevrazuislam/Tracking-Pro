import ManageUsers from "@/components/pages/mange-users";
import { Metadata } from "next";

export const metadata: Metadata ={
  title: 'Tracking Pro - Manage User',
  description: 'Test description'
}

export default function Page(){
  return <ManageUsers />
}