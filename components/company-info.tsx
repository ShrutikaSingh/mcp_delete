"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
} from "lucide-react";

interface CompanyInfo {
  companyName: string;
  companyDescription: string;
  productName: string;
  productDescription: string;
  keyFeatures: string[];
  companyType: string;
  userType: string;
  location: string;
  websiteUrl: string;
  logo?: string;
}

interface CompanyInfoData {
  type: "company_info";
  data: {
    companyInfo: CompanyInfo;
  };
}

interface CompanyInfoProps {
  data: CompanyInfoData | null;
}

export function CompanyInfo({ data }: CompanyInfoProps) {
  if (!data) {
    return <CompanyInfoSkeleton />;
  }

  const { companyInfo } = data.data;

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader className="flex flex-row items-center space-x-4 pb-8">
          <div>
            <CardTitle className="text-2xl font-bold">
              {companyInfo.companyName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {companyInfo.companyDescription}
            </p>
            <br />
            <p className="text-sm text-muted-foreground  mt-1">
              Website:{" "}
              <a href={companyInfo.websiteUrl} className="text-blue-500">
                {companyInfo.websiteUrl}
              </a>
            </p>
            <p className="text-sm  text-muted-foreground mt-1">
              Location: {companyInfo.location}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {companyInfo.productName && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Product</h3>
              <h4 className="font-medium">{companyInfo.productName}</h4>
              <p className="text-sm text-muted-foreground">
                {companyInfo.productDescription}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companyInfo.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="size-5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t">
            <Badge variant="outline" className="text-sm">
              {companyInfo.companyType}
            </Badge>
          </div>
        </CardContent>
      </Card>
      {/* <div className="pt-6 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-foreground">Is this correct?</div>
        </div>
      </div> */}
    </>
  );
}

function CompanyInfoSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg animate-pulse">
      <CardHeader className="flex flex-row items-center space-x-4 pb-8">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="h-6 w-32 bg-muted rounded mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-2">
                <div className="size-5 bg-muted rounded-full mt-0.5 shrink-0" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="size-5 bg-muted rounded" />
              <div>
                <div className="h-4 w-24 bg-muted rounded mb-1" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="h-6 w-24 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
