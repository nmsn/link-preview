# Link Preview Test App Design

## Overview

Create a Next.js 16 test application to validate and showcase the `@link-preview/ui` components and `@link-preview/api` functionality.

## Project Context

**Existing Packages:**
- `@link-preview/api` — Express server (port 3001) with `GET /api/preview?url=...` endpoint
- `@link-preview/ui` — React components: `LinkPreview`, `LinkPreviewCard`, `LinkPreviewSkeleton`, `LinkPreviewError`

**User Requirements:**
- New pnpm workspace package at `apps/test-app`
- Multi-component showcase displaying all UI states (success, loading, error)
- Server component architecture integrating client component + API

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 App                          │
│                     (apps/test-app)                          │
├─────────────────────────────────────────────────────────────┤
│  app/page.tsx (Server Component)                            │
│  ├── app/api/preview/route.ts (API Route)                  │
│  │   └── Reuses @link-preview/api logic                    │
│  │       - fetchMetadata()                                  │
│  │       - validateUrl()                                    │
│  │       - node-cache (optional, disabled for test)         │
│  └── components/PreviewShowcase.tsx (Client Component)      │
│      ├── URL Input + Fetch Button                           │
│      ├── LinkPreview (real component)                       │
│      ├── PreviewSkeleton (demo)                             │
│      └── PreviewError (demo)                                │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
apps/test-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with React 19
│   │   ├── page.tsx                # Main showcase page
│   │   ├── globals.css             # Tailwind imports
│   │   └── api/
│   │       └── preview/
│   │           └── route.ts        # API route (server-side)
│   ├── components/
│   │   ├── PreviewShowcase.tsx     # Interactive showcase
│   │   └── ComponentDemo.tsx       # Demo wrapper for states
│   └── lib/
│       ├── fetchMetadata.ts        # Forked from @link-preview/api
│       └── validate.ts             # Forked from @link-preview/api
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## Design Decisions

### 1. API Route Integration

Instead of calling the external Express server directly, the test app reuses the core logic from `@link-preview/api`:

- **`fetchMetadata.ts`** — Copied from `packages/api/src/fetchMetadata.ts`
- **`validate.ts`** — Copied from `packages/api/src/utils/validate.ts`
- **Cache disabled** — No NodeCache in API route (simpler for testing)

**Why:** Avoids CORS issues, allows testing in isolation, faster development iteration.

### 2. Component Showcase

The main page (`app/page.tsx`) displays three parallel sections:

| Component | Purpose | Data Source |
|-----------|---------|-------------|
| `LinkPreview` | Real component with real API call | API Route → real fetch |
| `PreviewSkeleton` | Loading state demo | Static/demo |
| `PreviewError` | Error state demo | Static/demo |

### 3. State Management

- **URL Input** — Text field to enter any URL
- **Fetch Trigger** — Button to refresh/prefetch
- **Live Demo** — `LinkPreview` component makes actual API calls
- **Static Demos** — Skeleton and Error always visible for comparison

### 4. Styling

- Uses Tailwind CSS v4 (already in `@link-preview/ui`)
- Dark/light neutral theme to not distract from component testing
- Responsive grid layout for component showcase

## Implementation Phases

### Phase 1: Project Scaffold
- Create `apps/test-app` with Next.js 16
- Configure TypeScript, Tailwind, pnpm workspace
- Copy shared API logic

### Phase 2: API Route
- Implement `GET /api/preview?url=...`
- Add timeout query parameter support
- Proper error handling

### Phase 3: Showcase Page
- URL input component
- `LinkPreview` integration
- Static skeleton and error demos

### Phase 4: Polish
- Responsive layout
- Error boundary
- Loading states

## Dependencies

**Shared with workspace:**
- `@link-preview/ui` — React components under test
- `tailwindcss` — Styling

**Test app specific:**
- `next` — Framework
- `@types/node` — TypeScript support

## Out of Scope

- Production deployment
- Authentication/authorization
- Rate limiting
- Full E2E test suite
