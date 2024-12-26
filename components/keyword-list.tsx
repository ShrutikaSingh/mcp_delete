'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { Search, BarChart2 } from 'lucide-react';

interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  relevanceScore: number;
}

interface KeywordListResult {
  type: 'keyword_suggestions';
  data: {
    suggestions: KeywordSuggestion[];
    businessInfo: {
      name: string;
      description: string;
      industry: string;
    };
  };
  error?: string;
}

interface KeywordListProps {
  data: KeywordListResult | null;
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function KeywordList({ data }: KeywordListProps) {
  if (!data) {
    return <KeywordListSkeleton />;
  }

  if (data.error) {
    return <KeywordListError error={data.error} />;
  }

  if (!data.data?.suggestions?.length) {
    return <NoKeywordSuggestions />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Keyword Suggestions</CardTitle>
        <p className="text-sm text-muted-foreground">
          For: {data.data.businessInfo.name} ({data.data.businessInfo.industry})
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Search size={14} />
                    Search Volume
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <BarChart2 size={14} />
                    Relevance
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.suggestions.map((suggestion, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{suggestion.keyword}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(suggestion.searchVolume)}
                  </TableCell>
                  <TableCell className="text-right">
                    {suggestion.relevanceScore.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function KeywordListError({ error }: { error: string }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-red-600">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{error}</p>
      </CardContent>
    </Card>
  );
}

function NoKeywordSuggestions() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>No Keyword Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          No keyword suggestions were found. Try adjusting your search criteria.
        </p>
      </CardContent>
    </Card>
  );
}

function KeywordListSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px] mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 