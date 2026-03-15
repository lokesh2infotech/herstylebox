'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { FiShoppingCart } from 'react-icons/fi'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item: Product) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem('cart', JSON.stringify(cart))

    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'))

    // Show notification
    alert(`${product.name} added to cart!`)
  }

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm dark:shadow-none border border-transparent dark:border-gray-700 hover:shadow-lg dark:hover:border-gray-600 transition-all">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 dark:from-gray-700 dark:to-gray-600">
              <span className="text-primary-400 dark:text-gray-400 text-4xl">👗</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ₹{Number(product.price).toFixed(2)}
            </span>
            <button
              onClick={addToCart}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              title="Add to cart"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
