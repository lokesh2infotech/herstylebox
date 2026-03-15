import Link from 'next/link'
import { Suspense } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import ProductGrid from '@/components/ProductGrid'
import fs from 'fs'
import path from 'path'
import { Product } from '@/types'

const CATEGORY_META: Record<string, { icon: string, desc: string }> = {
  'Dresses': { icon: '👗', desc: 'From casual sundresses to evening wear.' },
  'Tops': { icon: '👚', desc: 'Everyday essentials and statement pieces.' },
  'Bottoms': { icon: '👖', desc: 'Skirts, pants, and shorts for any occasion.' },
  'Knitwear': { icon: '🧶', desc: 'Stay warm without sacrificing style.' },
  'Indian': { icon: '🥻', desc: 'Beautiful traditional and contemporary Indian wear.' },
  'Outerwear': { icon: '🧥', desc: 'Layer up with our stylish outerwear collection.' },
  'Accessories': { icon: '👜', desc: 'Complete your look with the perfect accessories.' },
}

const DEFAULT_META = { icon: '✨', desc: 'Explore our beautiful collection for this category.' }

function getTopCategories() {
  try {
    const dataFilePath = path.join(process.cwd(), 'data', 'products.json')
    if (!fs.existsSync(dataFilePath)) return []
    const data = fs.readFileSync(dataFilePath, 'utf-8')
    const products: Product[] = JSON.parse(data)

    const categoryCounts: Record<string, number> = {}
    products.forEach(p => {
      const cat = p.category?.trim()
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      }
    })

    // Sort by count descending and take top 4
    const sorted = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)

    return sorted.map(c => {
      const meta = CATEGORY_META[c.name] || DEFAULT_META
      return {
        id: c.name,
        name: c.name,
        icon: meta.icon,
        desc: meta.desc,
        href: `/products?category=${encodeURIComponent(c.name)}`
      }
    })
  } catch (error) {
    console.error('Failed to load categories', error)
    return []
  }
}

export default function Home() {
  const topCategories = getTopCategories()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Style That Speaks
              <span className="block text-primary-600 dark:text-primary-400 mt-2">Her Way</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover our curated collection of beautiful, minimalistic clothing
              designed for the modern girl.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Shop Now
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Modules */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Quick Categories Banner */}
          {topCategories.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {topCategories.map((category) => (
                <Link key={category.name} href={category.href} className="group flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</span>
                  <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">{category.name}</span>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explore our collections categorized for your perfect fit and style.</p>
          </div>

          <div className="space-y-20">
            {topCategories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No categories found.</div>
            ) : topCategories.map((cat) => (
              <div key={cat.id} className="pt-8 border-t border-gray-100 dark:border-gray-800 first:border-0 first:pt-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cat.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{cat.desc}</p>
                  </div>
                  <Link href={cat.href} className="mt-4 md:mt-0 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium group">
                    View full collection
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <Suspense fallback={<div className="text-center py-12">Loading {cat.name}...</div>}>
                  <ProductGrid limit={4} category={cat.name} />
                </Suspense>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">Carefully selected fabrics and materials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast Shipping</h3>
              <p className="text-gray-600 dark:text-gray-400">Quick and reliable delivery to your door</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Made with Love</h3>
              <p className="text-gray-600 dark:text-gray-400">Every piece designed with care and attention</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
