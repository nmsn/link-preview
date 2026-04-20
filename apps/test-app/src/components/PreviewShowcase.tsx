'use client';

import { useState } from 'react';
import { LinkPreview, LinkPreviewSkeleton, LinkPreviewErrorComponent } from '@link-preview/ui';
import type { LinkPreviewError } from '@link-preview/ui';
import { ComponentDemo } from './ComponentDemo';

export function PreviewShowcase() {
  const [url, setUrl] = useState('https://example.com');

  return (
    <div className="flex flex-col gap-6">
      {/* URL Input */}
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to preview"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        />
      </div>

      {/* Component Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Real LinkPreview Component */}
        <ComponentDemo
          title="LinkPreview Component"
          description="Real component with API call"
        >
          <LinkPreview url={url} />
        </ComponentDemo>

        {/* Skeleton Demo */}
        <ComponentDemo
          title="Loading State"
          description="Skeleton animation"
        >
          <LinkPreviewSkeleton className="w-full max-w-sm" />
        </ComponentDemo>

        {/* Error Demo */}
        <ComponentDemo
          title="Error State"
          description="With simulated error"
        >
          <LinkPreviewErrorComponent
            error={{ code: 'DEMO_ERROR', message: 'This is a demo error state' } as LinkPreviewError}
            className="w-full max-w-sm"
          />
        </ComponentDemo>
      </div>
    </div>
  );
}