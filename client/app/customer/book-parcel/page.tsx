import BookParcel from '@/components/pages/book-parcel'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: 'CourierTrack Pro - Book Parcel',
  description:'Customer Portal'
}

const Page = () => {
  return (
    <BookParcel />
  )
}

export default Page