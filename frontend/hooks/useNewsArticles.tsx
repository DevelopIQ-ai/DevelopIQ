import { useState, useEffect } from 'react';
import { PropertyReportHandler } from "@/lib/report-handler";
import { NewsArticle } from "@/schemas/views/research-agent-schema";

interface NewsArticlesResult {
    newsArticles: NewsArticle[];
    newsArticlesLoading: boolean;
    newsArticlesError: string | null;
}

export const useNewsArticles = (reportHandler: PropertyReportHandler | null): NewsArticlesResult => {
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [newsArticlesLoading, setNewsArticlesLoading] = useState(true);
    const [newsArticlesError, setNewsArticlesError] = useState<string | null>(null);
    const [attemptCount, setAttemptCount] = useState(0);

    useEffect(() => {
        // Don't fetch if we already have articles
        if (newsArticles.length > 0) {
            return;
        }

        let isMounted = true;
        let timeoutId: NodeJS.Timeout;

        async function fetchNewsData() {
            if (!reportHandler) {
                // Schedule another attempt if no articles yet
                if (isMounted && newsArticles.length === 0) {
                    timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                }
                return;
            }

            const generalInfo = reportHandler.getGeneralInfo();
            if (!generalInfo) {
                // Schedule another attempt if no general info yet
                if (isMounted && newsArticles.length === 0) {
                    timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                }
                return;
            }

            try {
                setNewsArticlesLoading(true);
                const geospatialInfo = generalInfo["Property Identification & Legal Framework"]?.["Geospatial Information"];
                const locality = geospatialInfo?.locality?.value || null;
                
                if (!locality) {
                    setNewsArticlesError("No locality found in general info");
                    setNewsArticlesLoading(false);
                    // Schedule another attempt if no locality yet
                    if (isMounted && newsArticles.length === 0) {
                        timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                    }
                    return;
                }
                
                const response = await fetch('/api/agents', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ location: locality }),
                });
                const data = await response.json();
                
                if (data.status === 'success' && data.output && data.output.news) {
                    if (isMounted) {
                        setNewsArticles(data.output.news);
                        // Don't schedule another attempt if we got articles
                    }
                } else {
                    if (isMounted) {
                        setNewsArticles([]);
                        if (data.status === 'failed') {
                            setNewsArticlesError(data.error || "Failed to retrieve news articles");
                        }
                        // Schedule another attempt if no articles retrieved
                        if (newsArticles.length === 0) {
                            timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching news articles:", error);
                if (isMounted) {
                    setNewsArticlesError(error instanceof Error ? error.message : "An unexpected error occurred");
                    // Schedule another attempt on error if no articles yet
                    if (newsArticles.length === 0) {
                        timeoutId = setTimeout(() => setAttemptCount(prev => prev + 1), 2000);
                    }
                }
            } finally {
                if (isMounted) {
                    setNewsArticlesLoading(false);
                }
            }
        }

        fetchNewsData();

        return () => {
            isMounted = false;
            clearTimeout(timeoutId);
        };

    }, [reportHandler, attemptCount, newsArticles.length]);

    return { newsArticles, newsArticlesLoading, newsArticlesError };
}