import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import Providers from './provider'

import './globals.css'

export const metadata: Metadata = {
  description: 'Allen Library',
  title: 'Library',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='zh-CN'>
      <body className={`antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  )
}
