import Link from "next/link"
import Image from "next/image"
import { Button } from "./ui/button"
import { Box } from "./ui/box"

export const Footer = () => {
  return (
    <div className="w-full p-4">
      <Box>
        {/* Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/">
              <Image src="/logos/developiq_logo_large.png" alt="DevelopIQ Logo" width={150} height={50} />
            </Link>
            <p className="mt-4 text-sm font-mono">
              Empowering businesses with innovative technology solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 font-mono text-sm">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-mono text-sm mb-4">Contact Us</h3>
            <address className="not-italic font-mono text-sm space-y-2">
              <p>3500 West Springwood Court</p>
              <p>Bloomington, IN 47404</p>
              <p className="mt-4">evan@developiq.ai</p>
              <p>(561) 789-8905</p>
            </address>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-mono text-sm mb-4">Connect</h3>
            <div className="space-y-4">
              <div>
                <a 
                  href="https://www.linkedin.com/company/developiqai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-sm"
                >
                  LinkedIn
                </a>
              </div>
              <div>
                <Link href="/contact">
                  <Button 
                    size="small"
                    variant="secondary"
                    className="font-mono"
                  >
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </div>
  )
}

export default Footer
