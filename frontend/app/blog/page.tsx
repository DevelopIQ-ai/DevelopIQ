"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { Box } from "@/components/ui/box"
import blogData from './blogs.json'

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Load blog posts directly from the imported data
    setBlogPosts(blogData.blogs || []);
    
    // Animation observer code
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NavBar />
      <main className="flex-1 flex flex-col px-4">
        <Box>
          <div className="text-center py-8">
            <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight">
              INSIGHTS & ARTICLES
              <div className="flex items-center justify-center gap-1">
                <div className="relative">
                  <span className="relative z-10">FROM OUR TEAM.</span>
                  <div className="absolute bottom-1.5 left-0 w-full h-[45%] bg-[#e86c24] z-[1]"></div>
                </div>
              </div>
            </h1>
            
            <p className="font-mono mt-8 text-lg">
              LATEST UPDATES FROM THE DEVELOPIQ TEAM
            </p>
          </div>
        </Box>

        <Box variant="blank" className="mt-16 mb-72 md:mb-32">
          <div className="text-center py-12">            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {blogPosts.map((post) => (
                <Box key={post.id} variant="primary" className="relative">
                  <div className="text-center p-8">
                    <h3 className="font-mono text-lg mb-4">{post.title}</h3>
                    <div className="flex justify-center text-sm font-mono mb-4 space-x-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                    <p className="font-mono text-sm mb-8">
                      {post.content.substring(0, 120)}...
                    </p>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="secondary" size="small">READ MORE</Button>
                    </Link>
                  </div>
                </Box>
              ))}
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

