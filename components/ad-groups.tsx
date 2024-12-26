import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AdGroup {
  name: string;
  keywords: string[];
}

interface AdGroupsData {
  type: "ad_groups";
  data: {
    adGroups: AdGroup[];
  };
}

interface AdGroupsProps {
  data: AdGroupsData | null;
}

export function AdGroups({ data }: AdGroupsProps) {
  const [showAll, setShowAll] = useState(false);

  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ad Groups</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 bg-muted rounded w-20" />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const displayedGroups = showAll
    ? data.data.adGroups
    : data.data.adGroups.slice(0, 3);
  const hasMoreGroups = data.data.adGroups.length > 3;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ad Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayedGroups.map((group, index) => (
          <div key={index} className="space-y-2">
            <h3 className="font-semibold">{group.name}</h3>
            <div className="flex flex-wrap gap-2">
              {group.keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {hasMoreGroups && (
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowAll(!showAll)}
          >
            <span className="flex items-center gap-2">
              {showAll
                ? "Show less"
                : `Show ${data.data.adGroups.length - 3} more`}
              <ChevronDown
                className={`size-4 transition-transform ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
