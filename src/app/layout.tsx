import type { Metadata } from 'next'
import './globals.css'
import ClientRoot from './ClientRoot'

export const metadata: Metadata = {
  title: 'NCIP Mobile App',
  description: 'National Child Identification Program - Protecting Children, Empowering Communities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1a365d" />
      </head>
      <body>
        <ClientRoot>
          {children}
        </ClientRoot>
      </body>
    </html>
  )
}
