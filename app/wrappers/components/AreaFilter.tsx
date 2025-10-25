'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function AreaFilter({ areas }: { areas: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentArea = searchParams.get('area') || ''

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value) {
      router.push(`/wrappers?area=${value}`)
    } else {
      router.push('/wrappers')
    }
  }

  return (
    <div className="mb-6">
      <label htmlFor="area-filter" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Area
      </label>
      <select
        id="area-filter"
        className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        value={currentArea}
        onChange={handleChange}
      >
        <option value="">All Areas</option>
        {areas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    </div>
  )
}
