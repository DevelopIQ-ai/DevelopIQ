"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Box } from "@/components/ui/box"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { ChevronRight } from "lucide-react"
import blogData from '../blogs.json'

type Blog = {
  id: string
  title: string
  date: string
  author: string
  content: string
}

export default function BlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const foundBlog = blogData.blogs.find((blog: Blog) => blog.id === params.id)
        setBlog(foundBlog || null)
      } catch (error) {
        console.error('Error processing blog data:', error)
        setBlog(null)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p className="font-mono">Loading...</p>
        </main>
        <div className="w-full h-48 flex items-center">
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="font-mono text-2xl mb-4">BLOG NOT FOUND</h1>
          <Link href="/blog">
            <Button variant="secondary">BACK TO ALL BLOGS</Button>
          </Link>
        </main>
        <div className="w-full h-48 flex items-center">
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col px-4">
        <Box>
          <div className="text-center py-8">
            <div className="flex items-center justify-center gap-2 font-mono text-sm mb-8">
              <Link href="/blog" className="hover:text-[#e86c24] transition-colors">
                ALL BLOGS
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="truncate">{blog.title}</span>
            </div>

            <h1 className="font-mono text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-center font-mono text-sm space-x-2 mb-8">
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.author}</span>
            </div>
          </div>
        </Box>

        <Box variant="blank" className="mt-8 mb-72 md:mb-32">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  h1: ({...props}) => <h1 className="font-mono text-2xl font-bold my-4" {...props} />,
                  h2: ({...props}) => <h2 className="font-mono text-xl font-bold my-3" {...props} />,
                  h3: ({...props}) => <h3 className="font-mono text-lg font-bold my-2" {...props} />,
                  p: ({...props}) => <p className="font-mono my-4" {...props} />,
                  ul: ({...props}) => <ul className="font-mono list-disc pl-6 my-3" {...props} />,
                  ol: ({...props}) => <ol className="font-mono list-decimal pl-6 my-3" {...props} />,
                  li: ({...props}) => <li className="font-mono my-1" {...props} />,
                  a: ({...props}) => <a className="font-mono text-[#e86c24] hover:underline" {...props} />,
                  blockquote: ({...props}) => <blockquote className="font-mono border-l-4 border-[#e86c24] pl-4 italic my-3" {...props} />,
                }}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
            
            <div className="mt-16 text-center">
              <Link href="/blog">
                <Button variant="secondary" size="large">BACK TO ALL BLOGS</Button>
              </Link>
            </div>
          </div>
        </Box>
      </main>
      <div className="w-full h-48 flex items-center">
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </div>
  )
}

