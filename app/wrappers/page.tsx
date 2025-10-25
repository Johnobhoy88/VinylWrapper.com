import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import AreaFilter from './components/AreaFilter'

export const dynamic = 'force-dynamic'

export default async function WrappersPage({
  searchParams,
}: {
  searchParams: { area?: string }
}) {
  const area = searchParams.area

  // Fetch all wrappers or filter by area
  const wrappers = await prisma.wrapper.findMany({
    where: area
      ? {
          areasServed: {
            has: area,
          },
        }
      : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Get all unique areas for the filter dropdown
  const allWrappers = await prisma.wrapper.findMany({
    select: {
      areasServed: true,
    },
  })

  const allAreas = Array.from(
    new Set(allWrappers.flatMap((w) => w.areasServed))
  ).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Vinyl Wrapper Professionals
        </h1>
        <p className="mt-2 text-gray-600">
          Find experienced vinyl wrapper services in your area
        </p>
      </div>

      <AreaFilter areas={allAreas} />

      {wrappers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No wrappers found{area ? ` in ${area}` : ''}. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wrappers.map((wrapper) => (
            <Link
              key={wrapper.id}
              href={`/wrappers/${wrapper.id}`}
              className="block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {wrapper.portfolioImages[0] ? (
                  <Image
                    src={wrapper.portfolioImages[0]}
                    alt={wrapper.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {wrapper.name}
                </h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {wrapper.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {wrapper.areasServed.slice(0, 3).map((area) => (
                    <span
                      key={area}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {area}
                    </span>
                  ))}
                  {wrapper.areasServed.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{wrapper.areasServed.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
