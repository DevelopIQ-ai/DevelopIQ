"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import "@/styles/report.css";
import { NewsArticle } from "@/schemas/views/research-agent-schema";

export function NewsArticlesTab({ newsArticles, newsLoading, newsError }: { newsArticles: NewsArticle[], newsLoading: boolean, newsError: string | null }) {

  if (newsLoading) {
    return (
      <p>Loading...</p>
    );
  }

  if (newsError) {
    return (
        <p>Error: {newsError}</p>
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