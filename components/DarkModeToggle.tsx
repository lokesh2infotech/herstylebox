'use client'

import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'

export default function DarkModeToggle() {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDark(true)
            document.documentElement.classList.add('dark')
        }
    }, [])

    const toggle = () => {
        const next = !dark
        setDark(next)
        if (next) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }

    return (
        <button
            onClick={toggle}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle dark mode"
        >
            {dark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
    )
}
