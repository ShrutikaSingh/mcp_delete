import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/providers/posthog-provider";

import { PPEditorialNew } from "./_fonts/fonts";

import { Inter } from "next/font/google";

import './globals.css'
import FacebookPixel from "@/components/facebook-pixel";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chat.rava.hq"),
  title: "Rava | ChatGPT for Performance Marketers",
  description:
    "Launch ads 10x faster. ChatGPT with access to Keyword Planner, Company Research, Keyword Analysis, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
      className={`${inter.className} ${PPEditorialNew.variable}`}
    >
      <body className="antialiased">
        <FacebookPixel />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <Toaster position="top-center" />
            {children}
          </PostHogProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
