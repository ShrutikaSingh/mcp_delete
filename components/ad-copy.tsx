'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AdGroup {
  name: string;
  keywords: string[];
  headlines: string[];
  descriptions: string[];
  displayPaths: string[];
}

interface AdCopyResult {
  type: 'ad_copy';
  data: {
    adGroups: AdGroup[];
    recommendations: {
      budget: string;
      bidStrategy: string;
      targeting: string;
    };
  };
}

interface AdCopyProps {
  data: AdCopyResult | null;
}

export function AdCopy({ data }: AdCopyProps) {
  if (!data?.data?.adGroups) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Google Ads Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            Generating ad copy...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-3xl mx-auto")}>
      <CardHeader>
        <CardTitle>Google Ads Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {data.data.adGroups.map((group, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold text-lg mb-4">{group.name}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Keywords</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.keywords.map((keyword, idx) => (
                        <span key={idx} className="px-2 py-1 bg-secondary rounded-md text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Headlines</h4>
                    <div className="space-y-2">
                      {group.headlines.map((headline, idx) => (
                        <div key={idx} className="text-sm">
                          {headline}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Descriptions</h4>
                    <div className="space-y-2">
                      {group.descriptions.map((desc, idx) => (
                        <div key={idx} className="text-sm">
                          {desc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Display URL Path</h4>
                    <div className="text-sm">
                      {group.displayPaths.join('/')}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">Campaign Recommendations</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Budget:</span> {data.data.recommendations.budget}</p>
                <p><span className="font-medium">Bid Strategy:</span> {data.data.recommendations.bidStrategy}</p>
                <p><span className="font-medium">Targeting:</span> {data.data.recommendations.targeting}</p>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
} 