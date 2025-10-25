import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import LeadForm from './components/LeadForm'

export default async function WrapperProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const wrapper = await prisma.wrapper.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!wrapper) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {wrapper.name}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a href={`mailto:${wrapper.email}`} className="hover:text-blue-600">
                  {wrapper.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <a href={`tel:${wrapper.phone}`} className="hover:text-blue-600">
                  {wrapper.phone}
                </a>
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Areas Served:</h3>
              <div className="flex flex-wrap gap-2">
                {wrapper.areasServed.map((area) => (
                  <span
                    key={area}
                    className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 whitespace-pre-line">{wrapper.bio}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio</h2>
            {wrapper.portfolioImages.length === 0 ? (
              <p className="text-gray-500">No portfolio images available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wrapper.portfolioImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-64 bg-gray-200 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${wrapper.name} portfolio ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Request a Quote
            </h2>
            <LeadForm wrapper={wrapper} />
          </div>
        </div>
      </div>
    </div>
  )
}
