'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { useSearchParams } from 'next/navigation'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'
import { useState } from 'react'

interface FilterSidebarProps {
    products: Product[]
}

// Helper to build a nested tree: category -> subCategory -> itemType
function buildHierarchy(products: Product[]) {
    const tree: Record<string, Record<string, Set<string>>> = {}

    products.forEach(p => {
        const cat = p.category?.trim()
        if (!cat) return

        if (!tree[cat]) tree[cat] = {}

        const subCat = p.subCategory?.trim()
        if (subCat) {
            if (!tree[cat][subCat]) tree[cat][subCat] = new Set()

            const iType = p.itemType?.trim()
            if (iType) {
                tree[cat][subCat].add(iType)
            }
        }
    })

    return tree
}

export default function FilterSidebar({ products }: FilterSidebarProps) {
    const searchParams = useSearchParams()
    const activeCategory = searchParams.get('category')
    const activeSubCategory = searchParams.get('subCategory')
    const activeItemType = searchParams.get('itemType')

    const hierarchy = buildHierarchy(products)
    const categories = Object.keys(hierarchy).sort()

    // State to track expanded categories
    const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {}
        if (activeCategory) initialState[activeCategory] = true
        return initialState
    })

    // State to track expanded subcategories
    const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>(() => {
        const initialState: Record<string, boolean> = {}
        if (activeSubCategory) initialState[activeSubCategory] = true
        return initialState
    })

    const toggleCat = (cat: string) => {
        setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }))
    }

    const toggleSub = (subCat: string) => {
        setExpandedSubs(prev => ({ ...prev, [subCat]: !prev[subCat] }))
    }

    return (
        <div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
                    {(activeCategory || activeSubCategory || activeItemType) && (
                        <Link href="/products" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
                            Clear All
                        </Link>
                    )}
                </div>

                <div className="space-y-4">
                    <Link
                        href="/products"
                        className={`block font-medium ${!activeCategory ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'} transition-colors mb-4`}
                    >
                        All Products
                    </Link>

                    {categories.map(cat => {
                        const subCategories = Object.keys(hierarchy[cat]).sort()
                        const isCatActive = activeCategory === cat
                        const isCatExpanded = expandedCats[cat]

                        return (
                            <div key={cat} className="space-y-1">
                                {/* Level 1: Category */}
                                <div className="flex items-center justify-between group">
                                    <Link
                                        href={`/products?category=${encodeURIComponent(cat)}`}
                                        className={`flex-1 font-medium ${isCatActive && !activeSubCategory ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400'} transition-colors`}
                                    >
                                        {cat}
                                    </Link>
                                    {subCategories.length > 0 && (
                                        <button onClick={() => toggleCat(cat)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                            {isCatExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                        </button>
                                    )}
                                </div>

                                {/* Level 2: SubCategory */}
                                {isCatExpanded && subCategories.length > 0 && (
                                    <div className="pl-4 pt-2 space-y-2 border-l border-gray-100 dark:border-gray-700 ml-2">
                                        {subCategories.map(subCat => {
                                            const itemTypes = Array.from(hierarchy[cat][subCat]).sort()
                                            const isSubActive = activeCategory === cat && activeSubCategory === subCat
                                            const isSubExpanded = expandedSubs[subCat]

                                            return (
                                                <div key={subCat} className="space-y-1">
                                                    <div className="flex items-center justify-between group">
                                                        <Link
                                                            href={`/products?category=${encodeURIComponent(cat)}&subCategory=${encodeURIComponent(subCat)}`}
                                                            className={`flex-1 text-sm ${isSubActive && !activeItemType ? 'text-primary-600 font-medium dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'} transition-colors`}
                                                        >
                                                            {subCat}
                                                        </Link>
                                                        {itemTypes.length > 0 && (
                                                            <button onClick={() => toggleSub(subCat)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                                                {isSubExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Level 3: Item Type */}
                                                    {isSubExpanded && itemTypes.length > 0 && (
                                                        <div className="pl-3 pt-1 space-y-1.5 border-l border-gray-100 dark:border-gray-700 ml-2">
                                                            {itemTypes.map(iType => {
                                                                const isItemActive = isSubActive && activeItemType === iType
                                                                return (
                                                                    <Link
                                                                        key={iType}
                                                                        href={`/products?category=${encodeURIComponent(cat)}&subCategory=${encodeURIComponent(subCat)}&itemType=${encodeURIComponent(iType)}`}
                                                                        className={`block text-xs ${isItemActive ? 'text-primary-600 font-medium dark:text-primary-400' : 'text-gray-500 dark:text-gray-500 hover:text-primary-600 dark:hover:text-primary-400'} transition-colors`}
                                                                    >
                                                                        {iType}
                                                                    </Link>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
