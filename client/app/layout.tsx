import type { Metadata } from 'next'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import { Inter, Noto_Sans } from 'next/font/google';
import ReactQueryProvider from '@/configs/query-provider';
import { Toaster } from "sonner"
import ClientLayout from '@/components/client-layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'My First App',
  description: 'Created with razu islam',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${noto_sans.variable}`}>
      <body>
        <ClientLayout>
          <ReactQueryProvider>
            {children}
            <Toaster />
          </ReactQueryProvider>
        </ClientLayout>
      </body>
    </html>
  )
}
