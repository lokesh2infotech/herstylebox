'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi'
import Logo from './Logo'
import DarkModeToggle from './DarkModeToggle'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      if (typeof window !== 'undefined') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartCount(cart.length)
      }
    }

    updateCartCount()
    window.addEventListener('cartUpdated', updateCartCount)
    return () => window.removeEventListener('cartUpdated', updateCartCount)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo - Top Left */}
          <Logo />

          <div className="flex-1 flex justify-end md:justify-between items-center ml-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm uppercase tracking-wider">
                Home
              </Link>
              <Link href="/products" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm uppercase tracking-wider">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm uppercase tracking-wider">
                About
              </Link>
              <Link href="/admin" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium text-sm uppercase tracking-wider">
                Admin
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <FiShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                    {cartCount}
                  </span>
                )}
              </Link>
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <button
              className="p-2 text-gray-700 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
            <Link href="/" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Home
            </Link>
            <Link href="/products" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Shop
            </Link>
            <Link href="/about" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              About
            </Link>
            <Link href="/admin" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Admin
            </Link>
            <Link href="/cart" className="block text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
              Cart ({cartCount})
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
