"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, User, LogOut, LayoutDashboard, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        router.push(`/browse?search=${encodeURIComponent(query.trim())}`)
      }
    }, 300),
    [router]
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchVisible(false)
      setIsMobileMenuOpen(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

// Simple debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }) as T
}

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-forest-900 hover:text-forest-700 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="TakaTena homepage"
            >
              TakaTena
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/browse"
                className="text-stone-600 hover:text-forest-700 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 rounded-md"
                aria-label="Browse material listings"
              >
                Browse
              </Link>
              <Link
                href="/impact"
                className="text-stone-600 hover:text-forest-700 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 rounded-md"
                aria-label="View environmental impact"
              >
                Impact
              </Link>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-stone-50 border-stone-200 focus:bg-white focus:ring-forest-500 focus:border-forest-500"
                  aria-label="Search for waste materials"
                />
              </div>
            </form>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:block">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-stone-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-stone-600 hover:text-forest-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center justify-center w-8 h-8 bg-forest-500 text-white rounded-full text-sm font-medium hover:bg-forest-600 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
                    aria-label="Open user menu"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                  >
                    {getUserInitials(session.user.name)}
                  </button>

                  {isUserMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-20">
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-sm font-medium text-stone-900">{session.user.name}</p>
                          <p className="text-xs text-stone-500">{session.user.email}</p>
                        </div>

                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-stone-600 hover:text-forest-700 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="bg-forest-900 hover:bg-forest-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="text-stone-600 hover:text-forest-700 p-2 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 rounded-md"
              aria-label="Toggle search"
              aria-expanded={isSearchVisible}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-600 hover:text-forest-700 p-2 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 rounded-md"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchVisible && (
          <div className="md:hidden border-t border-stone-200 px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 bg-stone-50 border-stone-200 focus:bg-white focus:ring-forest-500 focus:border-forest-500"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/browse"
                className="text-stone-600 hover:text-forest-700 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/impact"
                className="text-stone-600 hover:text-forest-700 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Impact
              </Link>

              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-stone-600 hover:text-forest-700 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4 inline mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-stone-600 hover:text-forest-700 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 inline mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="text-stone-600 hover:text-forest-700 block w-full text-left px-3 py-2 text-base font-medium"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-stone-600 hover:text-forest-700 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-forest-900 hover:bg-forest-700 text-white block px-3 py-2 rounded-xl text-base font-medium transition-colors mx-3 my-2 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}