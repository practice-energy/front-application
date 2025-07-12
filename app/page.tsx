"use client"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"
import Image from "next/image"

export default function HomePage() {
  const router = useRouter()

  const handleSearch = (query: string, category?: string) => {
    const searchId = Date.now().toString()
    router.push(`/search/${searchId}?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ""}`)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      {/* Content Area */}
      <main className="flex-grow pb-8 sm:pb-[18px] lg:pb-[20px]">
        {/* Logo Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-16">
              <Image src="/practice-logo.svg" alt="Practice Logo" width={120} height={120} className="mx-auto mb-6" priority />
            </div>
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="px-4 sm:px-6 lg:px-8">
          <SearchBar onSearch={handleSearch} showHeading={false} />
        </section>
      </main>
    </div>
  )
}
