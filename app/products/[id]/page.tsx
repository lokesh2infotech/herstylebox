'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Product } from '@/types'
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  const addToCart = () => {
    if (!product) return

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: Product) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('cartUpdated'))
    alert(`${quantity} x ${product.name} added to cart!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h2>
          <Link href="/products" className="text-primary-600 dark:text-primary-400 hover:underline">
            ← Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden transition-colors">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 dark:from-gray-700 dark:to-gray-600">
                <span className="text-primary-400 dark:text-gray-400 text-8xl">👗</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-6">
              ₹{product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
              {product.description || 'Beautiful piece from our collection.'}
            </p>

            {/* Product Details */}
            {(product.size || product.color || product.category) && (
              <div className="mb-8 space-y-2">
                {product.category && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Category:</span> {product.category}
                  </p>
                )}
                {product.size && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Size:</span> {product.size}
                  </p>
                )}
                {product.color && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Color:</span> {product.color}
                  </p>
                )}
                {product.stock !== undefined && (
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">Stock:</span> {product.stock} available
                  </p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCart}
              className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
            >
              <FiShoppingCart className="mr-2" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
