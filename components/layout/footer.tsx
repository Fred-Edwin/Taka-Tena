import Link from "next/link"
import { Github, Twitter, Mail, Heart, Recycle } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-forest-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Recycle className="w-8 h-8 text-sage-400" />
              <h3 className="text-2xl font-bold">TakaTena</h3>
            </div>
            <p className="text-forest-200 mb-6 max-w-md">
              Transforming waste into opportunity. Join Kenya's leading marketplace for sustainable material exchange and build a circular economy together.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-300 hover:text-sage-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-forest-300 hover:text-sage-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@takatena.co.ke"
                className="text-forest-300 hover:text-sage-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/browse"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Browse Materials
                </Link>
              </li>
              <li>
                <Link
                  href="/listings/create"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Post Listing
                </Link>
              </li>
              <li>
                <Link
                  href="/impact"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Our Impact
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/safety"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Safety Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-forest-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-forest-200 text-sm">
                © {currentYear} TakaTena. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <Link
                  href="/privacy"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-forest-200 hover:text-sage-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-forest-200 text-sm mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>for a sustainable Kenya</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}