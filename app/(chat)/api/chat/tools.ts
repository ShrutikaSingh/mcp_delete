import { z } from 'zod';
import { generateObject, tool, generateText, type Message } from 'ai';
import { customModel } from '@/lib/ai';
import { createOpenAI } from '@ai-sdk/openai';
import * as cheerio from 'cheerio';

export type AllowedTools = 'search' | 'researchCompanyOrProduct' | 'brainstormKeywords' | 'getKeywordData' | 'analyzeKeywords' | 'draftSearchCampaign' | 'scrapeWebsite';

export const allTools: AllowedTools[] = [
  'search',
  'researchCompanyOrProduct',
  'brainstormKeywords',
  'getKeywordData',
  'analyzeKeywords',
  'draftSearchCampaign',
  'scrapeWebsite'
];

const CONFIG = {
  MODELS: {
    DEFAULT: 'claude-3-5-sonnet-latest',
    STRUCTURED_OUTPUT: 'gpt-4o-mini',
  },
  API: {
    SCRAPING_BEE_URL: 'https://app.scrapingbee.com/api/v1',
    NOMINATIM_URL: 'https://nominatim.openstreetmap.org/search',
    DATAFORSEO_URL: 'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live',
  },
  BATCH_SIZES: {
    KEYWORDS: 100,
  }
} as const;

interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  competition: number | null;
  cpc: number;
  monthlyTrends: number[];
}

interface GroupedMetrics {
  groupName: string;
  keywords: KeywordMetrics[];
  averageSearchVolume: number;
  averageCpc: number;
  totalSearchVolume: number;
}

async function generateStructuredOutput<T extends z.ZodType>(schema: T, prompt: string) {
  try {
    const { object } = await generateObject({
      model: customModel(CONFIG.MODELS.STRUCTURED_OUTPUT),
      schema,
      prompt,
    });
    return object;
  } catch (error) {
    console.error('Error generating structured output:', error);
    throw error;
  }
}

async function getCoordinates(location: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${CONFIG.API.NOMINATIM_URL}?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'Rita/1.0' }
      }
    );
    const data = await response.json();
    
    if (data?.[0]?.lat && data?.[0]?.lon) {
      return `${data[0].lat},${data[0].lon}`;
    }
    return null;
  } catch (error) {
    console.error('Error getting coordinates:', error);
    return null;
  }
}

async function shouldUseLocation(messages: Message[]): Promise<boolean> {
  const schema = z.object({
    isLocationSpecific: z.boolean(),
    reasoning: z.string(),
  });

  try {
    const result = await generateStructuredOutput(schema, `
      Based on the conversation history and company/product information, determine if location-specific data should be used.
      
      Return true if EITHER:
      1. The business/product is location-specific:
         - Is primarily offered in specific locations
         - Has different offerings by region
         - Targets local customers (e.g., local services, retail stores)
      
      OR
      
      2. The user explicitly requests or needs location-specific data:
         - Specifically asks for data from a certain location
         - Wants to compare different locations
         - Needs regional insights
      
      Return false if:
      - It's a digital/online-only product AND user hasn't requested location data
      - It's available globally AND user hasn't requested location data
      - Location doesn't affect the product/service AND user hasn't requested location data
      
      Conversation history: ${JSON.stringify(messages)}
    `);

    return result.isLocationSpecific;
  } catch (error) {
    console.error('Error determining location relevance:', error);
    return false;
  }
}

async function scrapeWebsite(url: string) {
  const apiKey = process.env.SCRAPING_BEE_API_KEY;
  if (!apiKey) {
    throw new Error('ScrapingBee API key is missing');
  }

  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const params = new URLSearchParams({
    api_key: apiKey,
    url: normalizedUrl,
    render_js: "true",
  });

  const response = await fetch(`${CONFIG.API.SCRAPING_BEE_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`ScrapingBee API error: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $('script').remove();
  $('style').remove();
  
  return {
    text: $('body').text().replace(/\s+/g, ' ').trim(),
    $,
    normalizedUrl,
  };
}

export const systemPrompt = `You're an expert at marketing like Brain Balfour, Neil Patel, and others. You have access to the following tools:

- Search (Search the internet to get answers to questions you don't know)
- researchCompanyOrProduct (Requires website or product URL. Get detailed information on the company by scraping a webpage. First clarify if they want to research a specific product. If you do not have a URL, ask the user.)
- brainstormKeywords (You're an expert at Google Ads like Ben Heath. Given a company or product info, generate a list of ad groups with keywords that are the most specific and most likely to convert to paying users.)
- getKeywordData (Given a set of keywords, get CPC, competition, and volume. Requires a location and list of keywords.)
- analyzeKeywords (Given a company and a list of keywords. Choose the keywords that are most likely to convert.)
- draftSearchCampaign (You're an expert at copywriting like Harry Dry. Given a list of keywords, a single-themed ad group, and company info, generate the copy for a Google Ads Search Campaign. 15 headlines, 4 descriptions, and 1-4 site links following Google Ads best practices)

After every step, ask the user if they have any feedback before proceeding. 

NEVER SUMMARIZE THE OUTPUT OF THE TOOLS.

Your name is Rita and you're friendly, energetic, and deeply knowledgable. You speak concisely and don't use emojis.`;

export const createTools = (model: { apiIdentifier: string }, messages: Message[]) => ({
  researchCompanyOrProduct: tool({
    description: 'Requires website or product URL. Get detailed information on the company by scraping a webpage. First clarify if they want to research a specific product. If you do not have a URL, ask the user. if there is no url, do not do the request and ask the user for one',
    parameters: z.object({
      query: z.string().describe('Company or product url to search for'),
    }),
    execute: async ({ query }) => {
      try {
        const { text, normalizedUrl } = await scrapeWebsite(query);
        const urlObject = new URL(normalizedUrl);
        const domain = urlObject.hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        const companySchema = z.object({
          companyName: z.string(),
          companyDescription: z.string(),
          productName: z.string().optional(),
          productDescription: z.string().optional(),
          keyFeatures: z.array(z.string()).optional(),
          companyType: z.string(),
          userType: z.string(),
          location: z.string().optional(),
          websiteUrl: z.string(),
        });

        const companyInfo = await generateStructuredOutput(
          companySchema,
          `Analyze this website content and provide details in a structured format:
            ${text}
            
            For the websiteUrl field, use: ${normalizedUrl}`
        );

        return {
          type: 'company_info' as const,
          data: {
            companyInfo: {
              ...companyInfo,
              imageUrl: faviconUrl,
            },
          }
        };
      } catch (error) {
        console.error('Error researching company:', error);
        return { error: 'Failed to research company' };
      }
    },
  }),

  brainstormKeywords: tool({
    description: 'You\'re an expert at Google Ads like Ben Heath. Given a company or product info, generate a list of ad groups with keywords that are the most specific and most likely to convert to paying users.',
    parameters: z.object({
      companyName: z.string(),
      companyDescription: z.string(),
      productName: z.string().optional(),
      productDescription: z.string().optional(),
      keyFeatures: z.array(z.string()).optional(),
      companyType: z.string(),
      userType: z.string(),
      location: z.string().optional(),
      websiteUrl: z.string(),
    }),
    execute: async (params) => {
      try {
        const adGroupSchema = z.object({
          adGroups: z.array(z.object({
            name: z.string(),
            keywords: z.array(z.string()),
          })),
        });

        const result = await generateStructuredOutput(
          adGroupSchema,
          `You're an expert at Google Ads like Ben Heath.
          Given the following information about the company, create me Single Theme Ad Groups (as many as are relevant).
          Each ad group should be focused on a single theme or intent, and the keywords within it should be very closely related.
          Generate as many ad group and keywords as are relevant.
          For each ad group, include 10-20 keywords.
          Make sure each adgroup and its keywords are as specific and extremely relevant as possible to the company/product.
          Company/Product info: ${JSON.stringify(params)}`
        );

        return {
          type: 'ad_groups' as const,
          data: {
            adGroups: result.adGroups,
          }
        };
      } catch (error) {
        console.error('Error generating keywords:', error);
        return { error: 'Failed to generate keywords' };
      }
    }
  }),

  getKeywordData: tool({
    description: 'Given a set of keywords, get CPC, competition, and volume. Optionally specify a location to get location-specific data.',
    parameters: z.object({
      adGroups: z.array(z.object({
        name: z.string(),
        keywords: z.array(z.string()),
      })),
      location: z.string().optional().describe('Optional location to get location-specific keyword data'),
      language_code: z.string().default('en'),
    }),
    execute: async ({ adGroups, location, language_code }) => {
      try {
        const extractedAdGroups = await generateStructuredOutput(
          z.object({
            adGroups: z.array(z.object({
              name: z.string(),
              keywords: z.array(z.string()),
            })),
          }),
          `Extract the relevant ad groups and the keywords from the messages: ${JSON.stringify(messages)}`
        ).catch(() => ({ adGroups }));

        const username = process.env.DATAFORSEO_LOGIN;
        const password = process.env.DATAFORSEO_PASSWORD;

        if (!username || !password) {
          return { error: 'DataForSEO credentials missing' };
        }

        let location_coordinate: string | undefined;
        if (location) {
          const coordinates = await getCoordinates(location);
          if (coordinates && await shouldUseLocation(messages)) {
            location_coordinate = coordinates;
          }
        }

        const allKeywords = extractedAdGroups.adGroups
          ?.flatMap((group: { keywords: string[] }) => group.keywords)
          .map((keyword: string) => keyword
            .replace(/[%]/g, ' percent ')
            .replace(/[^\w\s-]/g, '')
            .trim())
          .filter((keyword: string) => keyword.length > 0);

        if (!allKeywords?.length) {
          return { error: 'No valid keywords found' };
        }

        const keywordBatches = [];
        for (let i = 0; i < allKeywords.length; i += CONFIG.BATCH_SIZES.KEYWORDS) {
          keywordBatches.push(allKeywords.slice(i, i + CONFIG.BATCH_SIZES.KEYWORDS));
        }

        const allResults = [];
        for (const batch of keywordBatches) {
          const requestBody = {
            keywords: batch,
            language_code,
            ...(location_coordinate && { location_coordinate }),
          };

          const response = await fetch(CONFIG.API.DATAFORSEO_URL, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([requestBody]),
          });

          const data = await response.json();
          if (data?.tasks?.[0]?.result) {
            allResults.push(...data.tasks[0].result);
          }
        }

        if (!allResults.length) {
          return { error: 'No keyword data available' };
        }

        const keywordMetricsMap = new Map(
          allResults.map((kw: any) => [
            kw.keyword,
            {
              keyword: kw.keyword,
              searchVolume: kw.search_volume || 0,
              competition: kw.competition || null,
              cpc: kw.cpc || 0,
              monthlyTrends: kw.monthly_searches || [],
            } as KeywordMetrics
          ])
        );

        const groupedMetrics: GroupedMetrics[] = extractedAdGroups.adGroups.map((group: { name: string; keywords: string[] }) => {
          const groupKeywords = group.keywords
            .map((kw: string) => keywordMetricsMap.get(kw))
            .filter((kw): kw is KeywordMetrics => kw !== undefined);

          const totalSearchVolume = groupKeywords.reduce((sum: number, kw: KeywordMetrics) => sum + kw.searchVolume, 0);
          const totalCpc = groupKeywords.reduce((sum: number, kw: KeywordMetrics) => sum + kw.cpc, 0);

          return {
            groupName: group.name,
            keywords: groupKeywords,
            averageSearchVolume: totalSearchVolume / groupKeywords.length,
            averageCpc: totalCpc / groupKeywords.length,
            totalSearchVolume,
          };
        });

        return {
          type: 'keyword_data' as const,
          data: {
            adGroups: groupedMetrics,
            location: location_coordinate ? location : 'Global',
            language: language_code,
          }
        };
      } catch (error) {
        console.error('DataForSEO API error:', error);
        return { error: 'Failed to fetch keyword data' };
      }
    }
  }),

  analyzeKeywords: tool({
    description: 'Choose the keywords that are most likely to convert.',
    parameters: z.object({
      query: z.string().describe('list of keywords to analyze').optional(),
    }),
    execute: async () => {
      try {
        const schema = z.object({
          adGroup: z.string(),
          keywords: z.array(z.string()).min(10).max(20),
          reasoning: z.string(),
        });

        const result = await generateStructuredOutput(
          schema,
          `You're an expert at Google Ads, like Ben Heath. Given these Ad Groups and their traffic data (volume, cpc, etc.) and info about the company/product, suggest the single theme ad group that is most likely to convert and have the highest ROI. Compare across volume, competition, and relevancy.
          For the ad group, choose a minimum of 10 keywords and a maximum of 20 keywords.

          ${JSON.stringify(messages)}

          Return a single ad group with its keywords and a one-sentence reason for choosing it.`
        );

        return {
          type: 'core_theme' as const,
          data: {
            theme: result.adGroup,
            keywords: result.keywords,
            reasoning: result.reasoning
          },
        };
      } catch (error) {
        console.error('Error generating core theme:', error);
        return { error: 'Failed to generate core theme' };
      }
    },
  }),

  draftSearchCampaign: tool({
    description: 'You\'re an expert at copywriting like Harry Dry. Given a list of keywords, a single-themed ad group, and company info, generate the copy for a Google Ads Search Campaign. 15 headlines, 4 descriptions, and 1-4 site links following Google Ads best practices',
    parameters: z.object({
      query: z.string().describe('ad data').optional(),
    }),
    execute: async () => {
      try {
        const { text: campaignIdeas } = await generateText({
          model: customModel(CONFIG.MODELS.DEFAULT),
          prompt: `You're an expert at Google Ads like Harry Dry from marketing examples. Generate the copy for a google search ad using the following information:
          ${JSON.stringify(messages)}

          Guidelines:
          - Add ad group keywords and their search volume, competition (low, medium, high), and cpc
          - 15 unique headlines (max 25 characters each)
          - 4 unique descriptions (around 50 characters each)
          - 4 sitelinks, each with:
            * name (max 20 characters)
            * 2 descriptions (max 30 characters each)
          
          Write your response in a way that can be easily parsed into structured data.`
        });

        const schema = z.object({
          adGroup: z.string(),
          keywords: z.array(z.object({
            keyword: z.string(),
            searchVolume: z.number(),
            competition: z.string().nullable(),
            cpc: z.number(),
          })),
          headlines: z.array(z.string()),
          descriptions: z.array(z.string()),
          sitelinks: z.array(z.object({
            name: z.string(),
            descriptions: z.array(z.string())
          }))
        });

        const result = await generateStructuredOutput(
          schema,
          `Convert this campaign content into a structured format:
          ${campaignIdeas}`
        );

        return {
          type: 'search_campaign' as const,
          data: { ...result }
        };
      } catch (error) {
        console.error('Error generating campaign:', error);
        return { error: 'Failed to generate campaign' };
      }
    }
  }),

  search: tool({
    description: 'Search the internet to get answers to questions you don\'t know',
    parameters: z.object({
      query: z.string().describe('The search query'),
    }),
    execute: async ({ query }) => {
      const perplexity = createOpenAI({
        name: "perplexity",
        apiKey: process.env.PERPLEXITY_API_KEY,
        baseURL: 'https://api.perplexity.ai/',
      });

      const { text: searchResult } = await generateText({
        model: perplexity('llama-3.1-sonar-large-128k-online'),
        prompt: `Find information about ${query}`
      });

      return searchResult;
    },
  }),

  scrapeWebsite: tool({
    description: 'Scrape and analyze website content',
    parameters: z.object({
      url: z.string().describe('Website URL to scrape'),
    }),
    execute: async ({ url }) => {
      try {
        const { text, normalizedUrl } = await scrapeWebsite(url);
        const urlObject = new URL(normalizedUrl);
        const domain = urlObject.hostname;
        const links = new Set<string>();

        const $ = cheerio.load(text);
        $('nav a, main a, [role="main"] a, .main a, #main a, article a').each((_, element) => {
          const href = $(element).attr('href');
          if (!href) return;

          try {
            let fullUrl: string;
            if (href.startsWith('http')) {
              fullUrl = href;
            } else if (href.startsWith('//')) {
              fullUrl = `https:${href}`;
            } else if (href.startsWith('/')) {
              fullUrl = `https://${domain}${href}`;
            } else {
              fullUrl = `https://${domain}/${href}`;
            }

            const normalizedLink = new URL(fullUrl).toString()
              .toLowerCase()
              .replace(/\/$/, '')
              .split('#')[0]
              .split('?')[0];

            if (normalizedLink.includes(domain)) {
              links.add(normalizedLink);
            }
          } catch (error) {
            console.log("Invalid URL, skipping:", href);
          }
        });

        return {
          type: 'scraped_content' as const,
          data: {
            text,
            links: Array.from(links).slice(0, 5),
            url: normalizedUrl,
            faviconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
          }
        };
      } catch (error) {
        console.error('Scraping error:', error);
        throw error;
      }
    }
  }),
}); 