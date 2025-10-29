import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Highland AI Business Calculator',
  description: 'Sole trader compliance tracker for Universal Credit and bankruptcy reporting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Highland AI Business Calculator</h1>
            <p className="text-gray-600 mt-2">Sole Trader Compliance Tracker</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
