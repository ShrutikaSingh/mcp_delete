'use client'

interface SearchResult {
  title: string
  content: string
  url: string
}

interface SearchDataResult {
  type: 'search_results'
  data: SearchResult[]
  error?: string
}

interface SearchResultsProps {
  data: SearchDataResult | null
}



import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

export function SearchResults({ data }: SearchResultsProps) {
  if (!data) {
    return <SearchResultsSkeleton />
  }

  if (data.error) {
    return <SearchError error={data.error} />
  }

  if (!data.data?.length) {
    return <NoResults />
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Search Results</CardTitle>
        <p className="text-sm text-muted-foreground">
          Found {data.data.length} relevant results
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid gap-4">
            {data.data.map((result) => (
              <SearchResultItem key={result.url} result={result} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function SearchResultItem({ result }: { result: SearchResult }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline flex items-center gap-1"
            >
              {result.title}
              <ExternalLink size={14} />
            </a>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {result.url}
          </span>
        </div>
        <p className={`text-sm text-muted-foreground mt-2 ${expanded ? '' : 'line-clamp-2'}`}>
          {result.content}
        </p>
      </CardContent>
    </Card>
  )
}

function SearchError({ error }: { error: string }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Search Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{error}</p>
      </CardContent>
    </Card>
  )
}

function NoResults() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>No Results Found</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No search results were found for this query.
        </p>
      </CardContent>
    </Card>
  )
}

function SearchResultsSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

