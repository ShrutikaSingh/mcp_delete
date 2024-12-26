const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content?: string;
  published_date?: string; // only available for "news" topic
}

interface TavilySearchResponse {
  query: string;
  response_time: number;
  results: TavilySearchResult[];
  answer?: string;
  images?: Array<{
    url: string;
    description?: string;
  }>;
}

export const searchWeb = async (query: string) => {
  if (!TAVILY_API_KEY) {
    throw new Error('Tavily API key is not configured');
  }

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TAVILY_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        include_domains: [],
        exclude_domains: [],
        max_results: 5,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Tavily API error details:', errorData);
      throw new Error(`Search API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json() as TavilySearchResponse;
    return data.results;
  } catch (error) {
    console.error('Search API error:', error);
    throw error;
  }
}; 