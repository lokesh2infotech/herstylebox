import ProductGrid from '@/components/ProductGrid'
import FilterSidebar from '@/components/FilterSidebar'
import { Suspense } from 'react'
import { Product } from '@/types'
import { headers } from 'next/headers'

async function getProducts(): Promise<Product[]> {
  // Use absolute URL for server-side fetch to avoid relative URL issues when hosted
  const headersList = headers()
  const host = headersList.get('host') || 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

  try {
    const res = await fetch(`${protocol}://${host}/api/products`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    console.error('Error fetching products for sidebar:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover beautiful pieces designed for every occasion
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <FilterSidebar products={products} />

          <div className="flex-1">
            <Suspense fallback={<div className="text-center py-12">Loading collection...</div>}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
