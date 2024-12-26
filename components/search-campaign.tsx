import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface KeywordData {
  keyword: string;
  searchVolume: number;
  competition: string | null;
  cpc: number;
}

interface Sitelink {
  name: string;
  descriptions: string[];
}

interface SearchCampaignData {
  type: "search_campaign";
  data: {
    adGroup: string;
    keywords: KeywordData[];
    headlines: string[];
    descriptions: string[];
    sitelinks: Sitelink[];
  };
}

interface SearchCampaignProps {
  data: SearchCampaignData | null;
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

export function SearchCampaign({ data }: SearchCampaignProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.data?.adGroup ? (
          <Accordion
            type="single"
            collapsible
            className="space-y-4"
            defaultValue="item-0"
          >
            <AccordionItem value="item-0">
              <AccordionTrigger className="text-left">
                <div className="flex flex-col items-start">
                  <h3 className="font-semibold">{data.data.adGroup}</h3>
                  <p className="text-sm text-muted-foreground">
                    {data.data.keywords.length} keywords
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Keywords</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Keyword</TableHead>
                        <TableHead className="text-right">
                          Search Volume
                        </TableHead>
                        <TableHead className="text-right">
                          Competition
                        </TableHead>
                        <TableHead className="text-right">CPC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.data.keywords.map((keywordData) => (
                        <TableRow key={keywordData.keyword}>
                          <TableCell className="font-medium">
                            {keywordData.keyword}
                          </TableCell>
                          <TableCell className="text-right">
                            {keywordData.searchVolume}
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                getCompetitionColor(keywordData.competition)
                              )}
                            >
                              {keywordData.competition || "Unknown"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            ${keywordData.cpc.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Headlines</h4>
                  <ul className="grid gap-2">
                    {data.data.headlines.map((headline, index) => (
                      <li key={index} className="text-sm">
                        {headline}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Descriptions</h4>
                  <ul className="grid gap-2">
                    {data.data.descriptions.map((desc, index) => (
                      <li key={index} className="text-sm">
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Sitelinks</h4>
                  <div className="grid gap-4">
                    {data.data.sitelinks.map((sitelink, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-medium text-sm">{sitelink.name}</p>
                        {sitelink.descriptions.length > 0 && (
                          <ul className="space-y-1">
                            {sitelink.descriptions.map((desc, j) => (
                              <li
                                key={j}
                                className="text-sm text-muted-foreground"
                              >
                                {desc}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <div className="skeleton space-y-4">
            <div className="h-20 bg-muted rounded" />
            <div className="h-20 bg-muted rounded" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
