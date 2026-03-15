'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from './ProductCard'
import { Product } from '@/types'

interface ProductGridProps {
  limit?: number
  category?: string
  subCategory?: string
  itemType?: string
}

export default function ProductGrid({ limit, category, subCategory, itemType }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const categoryParam = category || searchParams.get('category')
  const subCategoryParam = subCategory || searchParams.get('subCategory')
  const itemTypeParam = itemType || searchParams.get('itemType')

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        let productsList = data
        if (categoryParam) {
          productsList = productsList.filter((p: Product) => p.category === categoryParam)
        }
        if (subCategoryParam) {
          productsList = productsList.filter((p: Product) => p.subCategory === subCategoryParam)
        }
        if (itemTypeParam) {
          productsList = productsList.filter((p: Product) => p.itemType === itemTypeParam)
        }
        productsList = limit ? productsList.slice(0, limit) : productsList
        setProducts(productsList)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [limit, categoryParam, subCategoryParam, itemTypeParam])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 aspect-square rounded-lg mb-4 transition-colors"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 transition-colors"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 transition-colors"></div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors">No products available yet.</p>
        <a href="/admin" className="text-primary-600 dark:text-primary-400 hover:underline transition-colors">
          Add your first product →
        </a>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
