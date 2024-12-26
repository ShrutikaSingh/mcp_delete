'use client';

import PostHogPageView from '@/app/_posthog/PostHogPageView';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: '/ingest',
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      capture_pageleave: true,
      ui_host: 'https://us.i.posthog.com',
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
