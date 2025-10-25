import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vinyl Wrapper Marketplace - Manchester',
  description: 'Find professional vinyl wrapper services in Manchester and surrounding areas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  Vinyl Wrapper Manchester
                </a>
              </div>
              <div className="flex space-x-4">
                <a href="/wrappers" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Find Wrappers
                </a>
                <a href="/admin" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Vinyl Wrapper Manchester. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
