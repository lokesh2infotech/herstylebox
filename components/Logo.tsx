import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center py-4">
      <Image
        src="/logo.png"
        alt="HerStyleBox by Purva & Disha"
        width={200}
        height={200}
        className="h-28 w-auto object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
        priority
      />
    </Link>
  )
}
