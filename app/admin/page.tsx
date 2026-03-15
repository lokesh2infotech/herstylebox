'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import AdminProductForm from '@/components/AdminProductForm'
import AdminProductList from '@/components/AdminProductList'
import { FiPlus, FiPackage, FiLogOut } from 'react-icons/fi'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' })
      const data = await res.json()
      setAuthenticated(data.authenticated === true)
      if (data.authenticated) fetchProducts()
      else setLoading(false)
    } catch {
      setAuthenticated(false)
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { credentials: 'include' })
      const data = await res.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) {
        setAuthenticated(true)
        fetchProducts()
      } else {
        setLoginError('Incorrect password')
      }
    } catch {
      setLoginError('Login failed')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setAuthenticated(false)
  }

  const handleSave = () => {
    fetchProducts()
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.status === 401) {
        setAuthenticated(false)
        return
      }
      fetchProducts()
    } catch (error) {
      alert('Failed to delete product')
    }
  }

  // Loading auth state
  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Login form
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-transparent dark:border-gray-700 p-8 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Login</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your password to manage inventory.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Admin password"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your inventory and products</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowForm(true)
                setEditingProduct(null)
              }}
              className="flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <FiPlus className="mr-2" />
              Add Product
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              title="Log out"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-transparent dark:border-gray-700 transition-colors">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingProduct(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <AdminProductForm
                  product={editingProduct}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700 rounded-lg transition-colors">
            <FiPackage className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first product!</p>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingProduct(null)
              }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <AdminProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
}
