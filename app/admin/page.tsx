'use client'

import { useState, useEffect } from 'react'

interface Wrapper {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  areasServed: string[]
  portfolioImages: string[]
  createdAt: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [wrappers, setWrappers] = useState<Wrapper[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    areasServed: '',
    portfolioImages: '',
  })

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
      fetchWrappers()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Simple password check - in production, this should be more secure
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      sessionStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      fetchWrappers()
    } else {
      setError('Incorrect password')
    }
  }

  const fetchWrappers = async () => {
    try {
      const response = await fetch('/api/admin/wrappers')
      const data = await response.json()
      setWrappers(data.wrappers || [])
    } catch (error) {
      console.error('Failed to fetch wrappers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      areasServed: formData.areasServed.split(',').map((s) => s.trim()).filter(Boolean),
      portfolioImages: formData.portfolioImages.split('\n').map((s) => s.trim()).filter(Boolean),
    }

    try {
      const url = editingId ? `/api/admin/wrappers?id=${editingId}` : '/api/admin/wrappers'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        fetchWrappers()
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save wrapper:', error)
    }
  }

  const handleEdit = (wrapper: Wrapper) => {
    setFormData({
      name: wrapper.name,
      email: wrapper.email,
      phone: wrapper.phone,
      bio: wrapper.bio,
      areasServed: wrapper.areasServed.join(', '),
      portfolioImages: wrapper.portfolioImages.join('\n'),
    })
    setEditingId(wrapper.id)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this wrapper?')) return

    try {
      const response = await fetch(`/api/admin/wrappers?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchWrappers()
      }
    } catch (error) {
      console.error('Failed to delete wrapper:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      bio: '',
      areasServed: '',
      portfolioImages: '',
    })
    setEditingId(null)
    setIsEditing(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <button
          onClick={() => {
            sessionStorage.removeItem('admin_authenticated')
            setIsAuthenticated(false)
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Edit Wrapper' : 'Add New Wrapper'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Areas Served (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="M1, M2, M3, Salford"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.areasServed}
                  onChange={(e) => setFormData({ ...formData, areasServed: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio Images (one URL per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="https://example.com/image1.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.portfolioImages}
                  onChange={(e) => setFormData({ ...formData, portfolioImages: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingId ? 'Update Wrapper' : 'Add Wrapper'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Existing Wrappers ({wrappers.length})
            </h2>
            <div className="space-y-4">
              {wrappers.map((wrapper) => (
                <div key={wrapper.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{wrapper.name}</h3>
                  <p className="text-sm text-gray-600">{wrapper.email}</p>
                  <p className="text-sm text-gray-600">{wrapper.phone}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {wrapper.areasServed.map((area) => (
                      <span key={area} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(wrapper)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(wrapper.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {wrappers.length === 0 && (
                <p className="text-gray-500 text-center py-8">No wrappers yet. Add your first one!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
