"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import "@/styles/animations.css"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
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
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in">
      <NavBar />
      <main className="flex-1 flex flex-col">
        <section
          className="flex flex-col justify-start px-4 min-h-screen section transition-all duration-500 mb-20"
        >
          <div className="w-full flex-1 max-w-7xl mx-auto px-4 py-16 md:py-8">
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mt-20">
                <span className="block text-left animate-gradient-text bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] bg-clip-text py-1">
                  Articles
                </span>
              </h1>

              <p className="text-lg text-left text-muted-foreground max-w-2xl my-6 text-[#000000]">
                Latest articles and insights from our team
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-8">
                {blogPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-indigo-100 border-2 border-black">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <div className="flex text-sm text-muted-foreground mb-3">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {post.content.substring(0, 120)}...
                      </p>
                      <Button asChild className="w-full p-6 bg-gradient-to-r from-orange-100 via-amber-100 to-orange-100 rounded-xl shadow-md border-2 border-black text-gray-700 font-medium hover:bg-gradient-to-r hover:from-orange-200 hover:via-amber-200 hover:to-orange-200 text-md">
                        <Link href={`/blog/${post.id}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

