"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import "@/styles/report.css";
import { NewsArticle } from "@/schemas/views/research-agent-schema";

export function NewsArticlesTab({ newsArticles, newsLoading, newsError }: { newsArticles: NewsArticle[], newsLoading: boolean, newsError: string | null }) {

  if (newsLoading) {
    return (
        <div className="container mx-auto max-w-7xl py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(4).fill(0).map((_, index) => (
                    <Card key={index} className="overflow-hidden flex flex-col items-start p-6">
                        <div className="w-24 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-4 self-start loading-skeleton"></div>
                        <CardHeader className="p-0 w-full">
                            <div className="flex justify-between items-start mb-2">
                                <div className="w-3/4 h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded loading-skeleton"></div>
                            </div>
                            <div className="w-32 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-2 mb-3 loading-skeleton"></div>
                            <div className="space-y-2 mb-4 w-full">
                                <div className="w-full h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded loading-skeleton"></div>
                                <div className="w-full h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded loading-skeleton"></div>
                                <div className="w-4/5 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded loading-skeleton"></div>
                            </div>
                        </CardHeader>
                        <div className="space-y-2 mb-4 w-full">
                            <div className="w-full h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded loading-skeleton"></div>
                            <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded loading-skeleton"></div>
                        </div>
                        <div className="w-36 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mt-auto loading-skeleton"></div>
                    </Card>
                ))}
            </div>
        </div>
    );
  }

  if (newsError) {
    return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{newsError}</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl py-6">
          {newsArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {newsArticles.map((article) => (
                      <Card key={article.url} className="overflow-hidden flex flex-col items-start">
                          <p className="text-sm text-muted-foreground mb-4 text-right">{article.source}</p>
                          <CardHeader>
                              <div className="flex justify-between items-start mb-2">
                                  <CardTitle className="text-xl">{article.title}</CardTitle>
                              </div>
                              <span className="text-sm text-muted-foreground whitespace-nowrap">{article.date}</span>
                              <p className="mb-4">{article.summary}</p>
                          </CardHeader>
                              <div className="text-sm text-muted-foreground mb-4 italic">
                                  {article.reasoning}
                              </div>
                              <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline font-medium inline-flex items-center mt-auto"
                                  >
                                  Read full article
                                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                              </a>
                      </Card>
                  ))}
              </div>
          )}
          {newsArticles.length === 0 && (
            <p>No news articles found.</p>
          )}
      </div>
  );
}