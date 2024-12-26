import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface KeywordMetric {
  keyword: string;
  searchVolume: number;
  competition: string | null;
  cpc: number;
  monthlyTrends: number[];
}

interface AdGroupMetrics {
  groupName: string;
  keywords: KeywordMetric[];
  averageSearchVolume: number;
  averageCpc: number;
  totalSearchVolume: number;
}

interface KeywordStatsData {
  type: "keyword_data";
  data: {
    adGroups: AdGroupMetrics[];
    location: number;
    language: string;
  };
}

interface KeywordStatsProps {
  data: KeywordStatsData | null;
}

function getCompetitionColor(competition: string | null): string {
  if (!competition) {
    return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }

  switch (competition.toUpperCase()) {
    case "LOW":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "HIGH":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

export function KeywordStats({ data }: KeywordStatsProps) {
  if (!data) {
    return <KeywordStatsSkeleton />;
  }

  if (!data.data?.adGroups) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-6">
      {data.data?.adGroups?.map((group) => (
        <Card key={group.groupName} className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{group.groupName}</span>
              <span className="text-sm font-normal text-muted-foreground">
                Avg. CPC: ${group.averageCpc.toFixed(2)} | Total Volume:{" "}
                {group.totalSearchVolume.toLocaleString()}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-right">Search Volume</TableHead>
                  <TableHead className="text-center">Competition</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.keywords.map((metric) => (
                  <TableRow key={metric.keyword}>
                    <TableCell className="font-medium">
                      {metric.keyword}
                    </TableCell>
                    <TableCell className="text-right">
                      {metric.searchVolume.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          getCompetitionColor(metric.competition)
                        )}
                      >
                        {metric.competition || "Unknown"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      ${metric.cpc.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KeywordStatsSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-6 w-[80px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
