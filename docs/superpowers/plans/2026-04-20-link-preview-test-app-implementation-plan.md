# Link Preview Test App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create Next.js 16 test application at `apps/test-app` to validate `@link-preview/ui` components and `@link-preview/api` functionality.

**Architecture:** Next.js 16 App Router with server-side API route that imports core functions from `@link-preview/api`. Client components display LinkPreview, Skeleton, and Error states.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, `@link-preview/api`, `@link-preview/ui`

---

## File Structure

```
apps/test-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Server Component page
│   │   ├── globals.css             # Tailwind imports
│   │   └── api/
│   │       └── preview/
│   │           └── route.ts        # API Route
│   └── components/
│       ├── PreviewShowcase.tsx     # Client Component (interactive)
│       └── ComponentDemo.tsx       # Demo wrapper
├── package.json
├── tsconfig.json
└── next.config.ts
```

**Prerequisite:** Ensure packages are built first:
```bash
pnpm -r build
```

**Dependencies to add in package.json:**
- `next`: ^16.0.0
- `@types/node`: ^20.0.0
- `@link-preview/api`: workspace:*
- `@link-preview/ui`: workspace:*

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: `apps/test-app/package.json`
- Create: `apps/test-app/tsconfig.json`
- Create: `apps/test-app/next.config.ts`
- Create: `apps/test-app/src/app/globals.css`
- Create: `apps/test-app/src/app/layout.tsx`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p apps/test-app/src/app/api/preview
mkdir -p apps/test-app/src/components
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "@link-preview/test-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@link-preview/api": "workspace:*",
    "@link-preview/ui": "workspace:*",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve"
  },
  "include": ["src/**/*", "next.config.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.ts**

```typescript
import type { NextConfig } from 'next';

// Note: turbopack is enabled via --turbopack CLI flag in dev script
const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 5: Create src/app/globals.css**

```css
@import 'tailwindcss';
```

- [ ] **Step 6: Create src/app/layout.tsx**

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Link Preview Test App',
  description: 'Testing @link-preview/ui components with @link-preview/api',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Install dependencies**

```bash
pnpm install
```

---

## Task 2: Create API Route

**Files:**
- Create: `apps/test-app/src/app/api/preview/route.ts`

- [ ] **Step 1: Create API route**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { fetchMetadata } from '@link-preview/api';
import { validateUrl } from '@link-preview/api';

interface PreviewQuery {
  url?: string;
  timeout?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const timeout = searchParams.get('timeout');

  // Validate URL
  const validation = validateUrl(url!);
  if (!validation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: validation.error?.code || 'INVALID_URL',
          message: validation.error?.message || 'Invalid URL',
        },
      },
      { status: 400 }
    );
  }

  // Parse timeout
  const timeoutMs = timeout ? parseInt(timeout, 10) : undefined;

  try {
    const data = await fetchMetadata(url!, { timeout: timeoutMs });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message,
        },
      },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify API route compiles**

```bash
cd apps/test-app && pnpm exec tsc --noEmit
```

---

## Task 3: Create Components

**Files:**
- Create: `apps/test-app/src/components/ComponentDemo.tsx`
- Create: `apps/test-app/src/components/PreviewShowcase.tsx`

- [ ] **Step 1: Create ComponentDemo.tsx**

```typescript
import type { ReactNode } from 'react';

interface ComponentDemoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ComponentDemo({ title, description, children }: ComponentDemoProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create PreviewShowcase.tsx**

```typescript
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
```

- [ ] **Step 3: Verify components compile**

```bash
cd apps/test-app && pnpm exec tsc --noEmit
```

---

## Task 4: Create Page

**Files:**
- Create: `apps/test-app/src/app/page.tsx`

- [ ] **Step 1: Create page.tsx**

```typescript
import { PreviewShowcase } from '../components/PreviewShowcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Link Preview Test App
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Testing @link-preview/ui components with @link-preview/api
        </p>

        <PreviewShowcase />
      </div>
    </main>
  );
}
```

---

## Task 5: Verify Full Build

- [ ] **Step 1: Run full build**

```bash
cd apps/test-app && pnpm build
```

Expected: Successful build with no errors

- [ ] **Step 2: Test lint**

```bash
pnpm lint
```

Expected: No ESLint errors

---

## Task 6: Update Root Scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add test-app dev script**

```json
{
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "clean": "pnpm -r clean",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "dev:test-app": "pnpm --filter @link-preview/test-app dev"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add test-app with Next.js 16 showcase

- Scaffold Next.js 16 project at apps/test-app
- Add API route at /api/preview
- Create PreviewShowcase with LinkPreview, Skeleton, Error demos
- Add workspace scripts for easy dev

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Dependencies Summary

| Package | Source | Purpose |
|---------|--------|---------|
| next | ^16.0.0 | Framework |
| react, react-dom | ^19.0.0 | UI |
| @link-preview/api | workspace:* | Core API logic |
| @link-preview/ui | workspace:* | Components under test |
| tailwindcss | ^4.0.0 | Styling (via @import in CSS) |

## Verification

After implementation:
1. `pnpm dev:test-app` should start Next.js dev server
2. `http://localhost:3000` should show three component demos
3. Entering a URL should trigger real LinkPreview fetch
4. `pnpm build` should succeed without errors
