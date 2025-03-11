import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GoogleSearchResult {
  items?: {
    title: string;
    link: string;
  }[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
}

export const googleCustomSearchTool = createTool({
  id: 'google-custom-search',
  description: 'Search for information about a specific location using Google Custom Search',
  inputSchema: z.object({
    searchQuery: z.union([
      z.string().describe('The search query to search for information about'),
      z.array(z.string()).describe('A list of search queries to search for information about')
    ]),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      title: z.string(),
      link: z.string(),
    }).catchall(z.any())),
    searchInformation: z.object({
      totalResults: z.string(),
      searchTime: z.number(),
    }).optional(),
  }),
  execute: async ({ context }) => {
    const { searchQuery } = context;
    // console.log('searchQuery', searchQuery);
    // Convert searchQuery to array if it's a string
    const queries = Array.isArray(searchQuery) ? searchQuery : [searchQuery];
    return await searchMultipleQueries(queries);
  },
});

const searchMultipleQueries = async (queries: string[]) => {
  // Run all searches in parallel
  const searchPromises = queries.map(query => searchLocation(query));
  const searchResults = await Promise.all(searchPromises);
  
  // Combine all results into a single response
  const combinedResults = {
    results: searchResults.flatMap(result => result.results),
    searchInformation: {
      totalResults: searchResults.reduce((total, result) => 
        (parseInt(result.searchInformation?.totalResults || '0') + parseInt(total || '0')).toString(), '0'),
      searchTime: searchResults.reduce((total, result) => 
        total + (result.searchInformation?.searchTime || 0), 0),
    }
  };
  
  return combinedResults;
};

const searchLocation = async (searchQuery: string) => {
  console.log('searchQuery', searchQuery);
  const apiKey = process.env.GOOGLE_API_KEY;
  const searchEngineId = process.env.GOOGLE_CSE_ID;
  
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is not set');
  }
  
  if (!searchEngineId) {
    throw new Error('GOOGLE_CSE_ID environment variable is not set');
  }

  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.append('key', apiKey);
  url.searchParams.append('cx', searchEngineId);
  url.searchParams.append('q', searchQuery);
  url.searchParams.append('dateRestrict', 'm6');
  url.searchParams.append('num', '10');
  
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url.toString(), requestOptions);
  
  if (!response.ok) {
    throw new Error(`Google Custom Search API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json() as GoogleSearchResult;
  const pageInfo = data.items?.map(item => ({
    title: item.title,
    link: item.link
  })) || [];
  console.log('pageInfo', pageInfo);

  return {
    results: pageInfo,
    searchInformation: data.searchInformation,
  };
};
