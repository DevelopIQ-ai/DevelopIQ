"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
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
        // Use the imported blogData instead of fetching
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

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Button asChild>
            <Link href="/blog">Back to All Blogs</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <section
          className="flex flex-col justify-start px-4 min-h-screen section transition-all duration-500"
        >
          <div className="w-full flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb navigation */}
            <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-8 mt-16">
              <Link href="/blog" className="hover:text-primary transition-colors">
                All Blogs
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium truncate">{blog.title}</span>
            </nav>

            <article className="prose prose-lg max-w-none">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{blog.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-8">
                <span>{blog.date}</span>
                <span className="mx-2">•</span>
                <span>{blog.author}</span>
              </div>
              
              {/* Render markdown content */}
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    h1: ({...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                    h2: ({...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
                    h3: ({...props}) => <h3 className="text-lg font-bold my-2" {...props} />,
                    p: ({...props}) => <p className="my-2" {...props} />,
                    ul: ({...props}) => <ul className="list-disc pl-6 my-3" {...props} />,
                    ol: ({...props}) => <ol className="list-decimal pl-6 my-3" {...props} />,
                    li: ({...props}) => <li className="my-1" {...props} />,
                    a: ({...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3" {...props} />,
                    }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
              
              <div className="mt-12 pt-6 border-t">
                <Button asChild className="p-6 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 rounded-xl shadow-md border-2 border-black text-gray-700 font-medium hover:bg-gradient-to-r hover:from-orange-200 hover:via-amber-200 hover:to-orange-200 text-md">
                  <Link href="/blog">
                    ← Back to All Blogs
                  </Link>
                </Button>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

