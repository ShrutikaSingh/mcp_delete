import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface CoreThemeData {
  theme: string;
  keywords: string[];
  reasoning: string;
}

interface CoreThemeProps {
  data: { data: CoreThemeData } | null;
}

export function CoreTheme({ data }: CoreThemeProps) {
  if (!data) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Core Theme Analysis</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 bg-muted rounded w-20" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { theme, keywords, reasoning } = data.data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Core Theme Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Recommended Theme</h3>
          <p className="text-lg text-muted-foreground">{theme}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Reasoning</h3>
          <p className="text-muted-foreground">{reasoning}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
