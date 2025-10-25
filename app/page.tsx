import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Find Professional Vinyl Wrappers
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Connect with expert vinyl wrapper professionals in Manchester and surrounding areas.
          Browse portfolios, compare services, and get quotes.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              href="/wrappers"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              Browse Wrappers
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-3xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Professionals</h3>
            <p className="text-gray-600">
              Browse verified vinyl wrapper professionals with extensive portfolios and experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-3xl mb-4">📍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Local Coverage</h3>
            <p className="text-gray-600">
              Find wrappers serving your specific area in Manchester and surrounding regions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-3xl mb-4">✉️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Contact</h3>
            <p className="text-gray-600">
              Submit your project details and receive responses directly from professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
