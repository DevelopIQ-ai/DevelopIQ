import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"

export const Footer = () => {
  return (
    <footer className="w-full bg-white pt-12 pb-8 border-t mt-auto">
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div className="col-span-1">
            <Link href="/">
              <Image src="/logos/developiq_logo_large.png" alt="DevelopIQ Logo" width={150} height={50} />
            </Link>
            <p className="mt-4 text-gray-600 text-sm">
              Empowering businesses with innovative technology solutions.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-gray-900 text-sm">Blog</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link></li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-gray-600 space-y-2">
              <p>3500 West Springwood Court</p>
              <p>Bloomington, IN 47404</p>
              <p className="mt-2">evan@developiq.com</p>
              <p>(561) 789-8905</p>
            </address>
          </div>
          
          {/* Connect */}
          <div className="col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              {/* Social icons - you can replace with actual icons */}
              <a href="https://www.linkedin.com/company/developiqai" target="_blank" className="text-gray-600 hover:text-gray-900">LinkedIn</a>
            </div>
            <Link href="/contact">
              <Button className="bg-black text-white hover:bg-gray-800">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Copyright bar */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © DevelopIQ 2025. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {/* <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</Link>
              <Link href="/cookies" className="text-gray-600 hover:text-gray-900 text-sm">Cookie Policy</Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
