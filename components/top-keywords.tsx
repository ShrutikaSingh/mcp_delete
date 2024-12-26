import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface AdGroup {
  theme: string;
  keywords: Array<{
    keyword: string;
    searchVolume: number;
    cpc: number;
  }>;
  avgSearchVolume: number;
  avgCpc: number;
}

interface TopKeywordsResult {
  type: 'selected_keywords';
  data: {
    adGroups: AdGroup[];
    metrics: {
      totalKeywords: number;
      avgSearchVolume: number;
      avgCpc: number;
    };
  };
}

export function TopKeywords({ data }: { data: TopKeywordsResult | null }) {
  if (!data) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle>Analyzing keywords...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Selected Keywords by Theme</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.data.adGroups.map((group, index) => (
          <div key={index} className="space-y-4">
            <h3 className="font-medium">Theme: {group.theme}</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Search Volume</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.keywords.map((keyword, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{keyword.keyword}</TableCell>
                    <TableCell className="text-right">{keyword.searchVolume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${keyword.cpc.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 