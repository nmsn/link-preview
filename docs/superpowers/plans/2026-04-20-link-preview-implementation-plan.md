# Link Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a monorepo with @link-preview/ui (React component) and @link-preview/api (Express + Cheerio) packages.

**Architecture:** Two independent packages - UI package is a React Client Component that calls an API service. API service uses Express + Cheerio to fetch and parse HTML metadata.

**Tech Stack:** React 19, Tailwind CSS v4, TypeScript, Vite, Express, Cheerio, pnpm workspace

---

## File Structure

```
link-preview/
├── pnpm-workspace.yaml                    # Workspace 配置
├── package.json                           # 根目录 scripts
├── tsconfig.base.json                     # 共享 TS 配置
│
├── packages/
│   ├── ui/                               # React UI 包
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts                 # Vite 构建配置
│   │   ├── src/
│   │   │   ├── index.ts                   # 导出入口
│   │   │   ├── LinkPreview.tsx            # 主组件
│   │   │   ├── LinkPreviewCard.tsx        # 卡片展示
│   │   │   ├── LinkPreviewSkeleton.tsx    # 加载骨架
│   │   │   ├── LinkPreviewError.tsx       # 错误展示
│   │   │   ├── fetchPreview.ts            # API 请求
│   │   │   └── types.ts                  # 类型定义
│   │   └── styles/
│   │       └── main.css                  # Tailwind v4
│   │
│   └── api/                              # API 服务包
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts                  # 服务入口
│       │   ├── fetchMetadata.ts          # 爬虫核心
│       │   ├── parseHtml.ts              # HTML 解析
│       │   ├── routes/
│       │   │   └── preview.ts            # 路由
│       │   └── utils/
│       │       ├── cache.ts              # 缓存
│       │       └── validate.ts           # URL 验证
│       └── tsconfig.json
│
└── docs/
    └── specs/
        └── 2026-04-20-link-preview-design.md
```

---

## Phase 1: 项目初始化

### Task 1: 创建 Monorepo 基础结构

**Files:**

- Create: `link-preview/package.json`
- Create: `link-preview/pnpm-workspace.yaml`
- Create: `link-preview/tsconfig.base.json`

- [ ] **Step 1: 创建根目录**

```bash
mkdir -p link-preview
cd link-preview
```

- [ ] **Step 2: 创建 package.json**

```json
{
  "name": "link-preview",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "clean": "pnpm -r clean"
  }
}
```

- [ ] **Step 3: 创建 pnpm-workspace.yaml**

```yaml
packages:
  - 'packages/*'
```

- [ ] **Step 4: 创建 tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

- [ ] **Step 5: 创建 packages 目录结构**

```bash
mkdir -p packages/ui/src packages/ui/styles
mkdir -p packages/api/src/routes packages/api/src/utils
```

---

### Task 2: 初始化 @link-preview/api

**Files:**

- Create: `packages/api/package.json`
- Create: `packages/api/tsconfig.json`

- [ ] **Step 1: 创建 packages/api/package.json**

```json
{
  "name": "@link-preview/api",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "cheerio": "^1.0.0",
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "node-cache": "^5.1.2"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/cors": "^2.8.17",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: 创建 packages/api/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

---

### Task 3: 初始化 @link-preview/ui

**Files:**

- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/vite.config.ts`

- [ ] **Step 1: 创建 packages/ui/package.json**

```json
{
  "name": "@link-preview/ui",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build && tsc --emitDeclarationOnly",
    "clean": "rm -rf dist",
    "preview": "vite preview"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: 创建 packages/ui/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: 创建 packages/ui/vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LinkPreview',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
```

- [ ] **Step 4: 创建 packages/ui/styles/main.css**

```css
@import 'tailwindcss';

@theme inline {
  --color-card-bg: oklch(100% 0 0);
  --color-card-border: oklch(93% 0 0);
  --color-card-text: oklch(15% 0 0);
  --color-card-muted: oklch(50% 0 0);
  --radius-card: 0.75rem;
}
```

---

## Phase 2: API 服务实现

### Task 4: 实现 URL 验证工具

**Files:**

- Create: `packages/api/src/utils/validate.ts`
- Create: `packages/api/src/utils/__tests__/validate.test.ts`

- [ ] **Step 1: 安装测试框架**

```bash
cd packages/api
pnpm add -D vitest @vitest/ui
```

- [ ] **Step 2: 创建 vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

- [ ] **Step 3: 更新 package.json scripts**

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist",
    "test": "vitest"
  }
}
```

- [ ] **Step 4: 创建 packages/api/src/utils/validate.ts**

````typescript
export interface ValidateResult {
  valid: boolean;
  error?: {
    code: string;
    message: string;
  };
}

const PRIVATE_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^0\.\d+\.\d+\.\d+$/,
  /^::1$/,
  /^fe80:/i,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
];

export function validateUrl(urlString: string): ValidateResult {
  if (!urlString) {
    return {
      valid: false,
      error: {
        code: 'MISSING_URL',
        message: 'URL parameter is required',
      },
    };
  }

  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return {
      valid: false,
      error: {
        code: 'INVALID_URL',
        message: 'Invalid URL format',
      },
    };
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return {
      valid: false,
      error: {
        code: 'INVALID_PROTOCOL',
        message: 'Only HTTP and HTTPS protocols are allowed',
      },
    };
  }

  const hostname = url.hostname.toLowerCase();
  for (const pattern of PRIVATE_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        valid: false,
        error: {
          code: 'BLOCKED_HOST',
          message: 'Private and localhost URLs are not allowed',
        },
      };
    }
  }

  return { valid: true };
}

- [ ] **Step 2: 创建测试文件**

```typescript
import { validateUrl } from '../validate';

describe('validateUrl', () => {
  it('should return valid for normal HTTPS URL', () => {
    const result = validateUrl('https://github.com');
    expect(result.valid).toBe(true);
  });

  it('should return error for missing URL', () => {
    const result = validateUrl('');
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe('MISSING_URL');
  });

  it('should return error for localhost', () => {
    const result = validateUrl('http://localhost:3000');
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe('BLOCKED_HOST');
  });

  it('should return error for private IP', () => {
    const result = validateUrl('http://192.168.1.1');
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe('BLOCKED_HOST');
  });

  it('should return error for non-http protocol', () => {
    const result = validateUrl('file:///etc/passwd');
    expect(result.valid).toBe(false);
    expect(result.error?.code).toBe('INVALID_PROTOCOL');
  });
});
````

- [ ] **Step 3: 运行测试**

```bash
cd packages/api && pnpm test
```

---

### Task 5: 实现缓存工具

**Files:**

- Create: `packages/api/src/utils/cache.ts`

- [ ] **Step 1: 创建 packages/api/src/utils/cache.ts**

```typescript
import NodeCache from 'node-cache';

const DEFAULT_TTL = 3600; // 1 hour

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class PreviewCache {
  private cache: NodeCache;

  constructor(ttl: number = DEFAULT_TTL) {
    this.cache = new NodeCache({
      stdTTL: ttl,
      checkperiod: Math.min(ttl / 2, 300),
      useClones: true,
    });
  }

  get<T>(key: string): { data: T; hit: boolean } | null {
    const value = this.cache.get<T>(key);
    if (value === undefined) {
      return null;
    }
    return { data: value, hit: true };
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, data);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

// Global cache instance
export const previewCache = new PreviewCache();
```

---

### Task 6: 实现 HTML 解析器

**Files:**

- Create: `packages/api/src/parseHtml.ts`
- Create: `packages/api/src/__tests__/parseHtml.test.ts`

- [ ] **Step 1: 创建 packages/api/src/parseHtml.ts**

```typescript
import * as cheerio from 'cheerio';

export interface ParsedMetadata {
  title: string;
  description: string;
  image: string;
  favicon: string;
  publisher: string;
}

const METADATA_SELECTORS = {
  title: ['meta[property="og:title"]', 'meta[name="twitter:title"]', 'title'],
  description: [
    'meta[property="og:description"]',
    'meta[name="twitter:description"]',
    'meta[name="description"]',
  ],
  image: [
    'meta[property="og:image"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:src"]',
  ],
  favicon: ['link[rel="icon"]', 'link[rel="shortcut icon"]', 'link[rel="apple-touch-icon"]'],
  publisher: ['meta[property="og:site_name"]', 'meta[name="application-name"]'],
};

function extractFirst($: cheerio.CheerioAPI, selectors: string[]): string {
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length) {
      // Try content attribute first
      const content = element.attr('content');
      if (content) return content.trim();

      // For title element
      const text = element.text();
      if (text) return text.trim();
    }
  }
  return '';
}

function resolveUrl(baseUrl: string, relativeUrl: string): string {
  if (!relativeUrl) return '';
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
}

export function parseHtml(html: string, baseUrl: string): ParsedMetadata {
  const $ = cheerio.load(html);

  const title = extractFirst($, METADATA_SELECTORS.title) || baseUrl;
  const description = extractFirst($, METADATA_SELECTORS.description) || '';
  const image = resolveUrl(baseUrl, extractFirst($, METADATA_SELECTORS.image));
  const favicon = resolveUrl(baseUrl, extractFirst($, METADATA_SELECTORS.favicon));
  const publisher = extractFirst($, METADATA_SELECTORS.publisher) || '';

  return {
    title,
    description,
    image,
    favicon,
    publisher,
  };
}

export function getFallbackFavicon(url: string): string {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return '';
  }
}
```

- [ ] **Step 5: 创建测试文件**

```typescript
import { parseHtml, getFallbackFavicon } from '../parseHtml';

describe('parseHtml', () => {
  it('should parse og metadata', () => {
    const html = `
      <html>
        <head>
          <meta property="og:title" content="OG Title">
          <meta property="og:description" content="OG Description">
          <meta property="og:image" content="/image.png">
          <meta property="og:site_name" content="My Site">
        </head>
      </html>
    `;
    const result = parseHtml(html, 'https://example.com');

    expect(result.title).toBe('OG Title');
    expect(result.description).toBe('OG Description');
    expect(result.image).toBe('https://example.com/image.png');
    expect(result.publisher).toBe('My Site');
  });

  it('should fallback to twitter metadata', () => {
    const html = `
      <html>
        <head>
          <meta name="twitter:title" content="Twitter Title">
          <meta name="twitter:description" content="Twitter Description">
        </head>
      </html>
    `;
    const result = parseHtml(html, 'https://example.com');

    expect(result.title).toBe('Twitter Title');
    expect(result.description).toBe('Twitter Description');
  });

  it('should fallback to html title', () => {
    const html = `
      <html>
        <head><title>HTML Title</title></head>
      </html>
    `;
    const result = parseHtml(html, 'https://example.com');
    expect(result.title).toBe('HTML Title');
  });

  it('should return empty strings when no metadata', () => {
    const html = '<html><head></head></html>';
    const result = parseHtml(html, 'https://example.com');
    expect(result.description).toBe('');
    expect(result.image).toBe('');
  });
});

describe('getFallbackFavicon', () => {
  it('should return google favicon URL', () => {
    const result = getFallbackFavicon('https://github.com/user');
    expect(result).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=64');
  });

  it('should return empty for invalid URL', () => {
    const result = getFallbackFavicon('not-a-url');
    expect(result).toBe('');
  });
});
```

---

### Task 7: 实现爬虫核心 fetchMetadata

**Files:**

- Create: `packages/api/src/fetchMetadata.ts`

- [ ] **Step 1: 创建 packages/api/src/fetchMetadata.ts**

```typescript
import { parseHtml, getFallbackFavicon } from './parseHtml.js';
import { previewCache } from './utils/cache.js';

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  publisher: string;
}

export interface FetchMetadataOptions {
  timeout?: number;
  headers?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 10000;
const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://example.com/bot)';

function generateCacheKey(url: string): string {
  // Use URL as-is as cache key (same as router)
  return `preview:${url}`;
}

export async function fetchMetadata(
  url: string,
  options: FetchMetadataOptions = {}
): Promise<LinkPreviewData> {
  const cacheKey = generateCacheKey(url);

  // Check cache first
  const cached = previewCache.get<LinkPreviewData>(cacheKey);
  if (cached) {
    return cached.data;
  }

  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const headers = {
    'User-Agent': DEFAULT_USER_AGENT,
    Accept: 'text/html,application/xhtml+xml',
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const baseUrl = response.url || url;

    const parsed = parseHtml(html, baseUrl);

    const result: LinkPreviewData = {
      url: baseUrl,
      title: parsed.title || baseUrl,
      description: parsed.description,
      image: parsed.image,
      favicon: parsed.favicon || getFallbackFavicon(baseUrl),
      publisher: parsed.publisher || new URL(baseUrl).hostname,
    };

    // Cache the result
    previewCache.set(cacheKey, result);

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }

    throw new Error('Unknown error occurred');
  }
}
```

---

### Task 8: 实现 API 路由

**Files:**

- Create: `packages/api/src/routes/preview.ts`

- [ ] **Step 1: 创建 packages/api/src/routes/preview.ts**

```typescript
import { Router, Request, Response } from 'express';
import { fetchMetadata } from '../fetchMetadata.js';
import { validateUrl } from '../utils/validate.js';
import { previewCache } from '../utils/cache.js';

const router = Router();

interface PreviewQuery {
  url?: string;
  timeout?: string;
}

router.get('/preview', async (req: Request, res: Response) => {
  const { url, timeout } = req.query as PreviewQuery;

  // Validate URL
  const validation = validateUrl(url);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: {
        code: validation.error?.code || 'INVALID_URL',
        message: validation.error?.message || 'Invalid URL',
      },
    });
  }

  // Parse timeout
  const timeoutMs = timeout ? parseInt(timeout, 10) : undefined;

  try {
    const data = await fetchMetadata(url!, { timeout: timeoutMs });

    // Check if this was a cache hit
    const cacheKey = `preview:${url}`;
    const isCacheHit = previewCache.has(cacheKey);

    return res.json({
      success: true,
      data,
      meta: {
        cached: isCacheHit,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message,
      },
    });
  }
});

export default router;
```

---

### Task 9: 实现服务入口

**Files:**

- Create: `packages/api/src/index.ts`

- [ ] **Step 1: 创建 packages/api/src/index.ts**

```typescript
import express from 'express';
import cors from 'cors';
import previewRouter from './routes/preview.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '0.1.0',
    uptime: process.uptime(),
  });
});

// Routes
app.use('/api', previewRouter);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Link Preview API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
```

---

## Phase 3: UI 组件实现

### Task 10: 实现类型定义

**Files:**

- Create: `packages/ui/src/types.ts`

- [ ] **Step 1: 创建 packages/ui/src/types.ts**

```typescript
export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  publisher: string;
}

export interface LinkPreviewError {
  code: string;
  message: string;
}

export interface LinkPreviewResponse {
  success: boolean;
  data?: LinkPreviewData;
  error?: LinkPreviewError;
  meta?: {
    cached?: boolean;
  };
}

export type LinkPreviewSize = 'sm' | 'md' | 'lg' | 'full';

export interface LinkPreviewProps {
  url: string;
  apiUrl: string;
  size?: LinkPreviewSize;
  className?: string;
  fallback?: React.ReactNode;
}

export type LinkPreviewStatus = 'idle' | 'loading' | 'success' | 'error';
```

---

### Task 11: 实现 API 请求

**Files:**

- Create: `packages/ui/src/fetchPreview.ts`

- [ ] **Step 1: 创建 packages/ui/src/fetchPreview.ts**

```typescript
import type { LinkPreviewResponse } from './types';

export async function fetchPreview(url: string, apiUrl: string): Promise<LinkPreviewResponse> {
  const fullUrl = `${apiUrl.replace(/\/$/, '')}/preview?url=${encodeURIComponent(url)}`;

  const response = await fetch(fullUrl);
  const data = await response.json();

  return data as LinkPreviewResponse;
}
```

---

### Task 12: 实现 LinkPreviewSkeleton

**Files:**

- Create: `packages/ui/src/LinkPreviewSkeleton.tsx`

- [ ] **Step 1: 创建 packages/ui/src/LinkPreviewSkeleton.tsx**

```typescript
import type { LinkPreviewSize } from './types';

interface SkeletonProps {
  size?: LinkPreviewSize;
}

const sizeClasses: Record<LinkPreviewSize, string> = {
  sm: 'w-[320px]',
  md: 'w-[400px]',
  lg: 'w-[500px]',
  full: 'w-full',
};

const imageSizes: Record<LinkPreviewSize, string> = {
  sm: 'w-[80px] h-[80px]',
  md: 'w-[120px] h-[120px]',
  lg: 'w-[160px] h-[160px]',
  full: 'w-[160px] h-[160px]',
};

export function LinkPreviewSkeleton({ size = 'md' }: SkeletonProps) {
  return (
    <div className={`flex gap-3 p-3 bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-[var(--radius-card)] ${sizeClasses[size]}`}>
      <div className={`${imageSizes[size]} bg-[var(--color-card-border)] rounded-md animate-pulse shrink-0`} />
      <div className="flex-1 flex flex-col gap-2 py-1">
        <div className="h-4 bg-[var(--color-card-border)] rounded animate-pulse w-3/4" />
        <div className="h-3 bg-[var(--color-card-border)] rounded animate-pulse w-full" />
        <div className="h-3 bg-[var(--color-card-border)] rounded animate-pulse w-2/3" />
      </div>
    </div>
  );
}
```

---

### Task 13: 实现 LinkPreviewError

**Files:**

- Create: `packages/ui/src/LinkPreviewError.tsx`

- [ ] **Step 1: 创建 packages/ui/src/LinkPreviewError.tsx**

```typescript
import type { LinkPreviewSize } from './types';
import type { LinkPreviewError as ErrorType } from './types';

interface ErrorProps {
  error: ErrorType;
  size?: LinkPreviewSize;
  fallback?: React.ReactNode;
}

const sizeClasses: Record<LinkPreviewSize, string> = {
  sm: 'w-[320px]',
  md: 'w-[400px]',
  lg: 'w-[500px]',
  full: 'w-full',
};

export function LinkPreviewError({ error, size = 'md', fallback }: ErrorProps) {
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`p-3 bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-[var(--radius-card)] ${sizeClasses[size]}`}>
      <div className="flex items-center gap-2 text-[var(--color-card-muted)]">
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-sm truncate">{error.message}</span>
      </div>
    </div>
  );
}
```

---

### Task 14: 实现 LinkPreviewCard

**Files:**

- Create: `packages/ui/src/LinkPreviewCard.tsx`

- [ ] **Step 1: 创建 packages/ui/src/LinkPreviewCard.tsx**

```typescript
import type { LinkPreviewData, LinkPreviewSize } from './types';

interface CardProps {
  data: LinkPreviewData;
  size?: LinkPreviewSize;
  className?: string;
}

const sizeClasses: Record<LinkPreviewSize, string> = {
  sm: 'w-[320px]',
  md: 'w-[400px]',
  lg: 'w-[500px]',
  full: 'w-full',
};

const imageSizes: Record<LinkPreviewSize, { container: string; img: string }> = {
  sm: { container: 'w-[80px] h-[80px]', img: 'w-[80px] h-[80px]' },
  md: { container: 'w-[120px] h-[120px]', img: 'w-[120px] h-[120px]' },
  lg: { container: 'w-[160px] h-[160px]', img: 'w-[160px] h-[160px]' },
  full: { container: 'w-[160px] h-[160px]', img: 'w-[160px] h-[160px]' },
};

const descriptionLines: Record<LinkPreviewSize, number> = {
  sm: 2,
  md: 2,
  lg: 3,
  full: 3,
};

export function LinkPreviewCard({ data, size = 'md', className = '' }: CardProps) {
  const { title, description, image, favicon, publisher, url } = data;
  const lines = descriptionLines[size];
  const hostname = typeof window !== 'undefined' ? new URL(url).hostname : url;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        flex gap-3 p-3
        bg-[var(--color-card-bg)] border border-[var(--color-card-border)]
        rounded-[var(--radius-card)]
        hover:border-[var(--color-card-muted)] transition-colors duration-200
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {image && (
        <div className={`${imageSizes[size].container} shrink-0 overflow-hidden rounded-md`}>
          <img
            src={image}
            alt=""
            className={`${imageSizes[size].img} object-cover`}
            loading="lazy"
          />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1 py-1">
        <h3 className="text-sm font-medium text-[var(--color-card-text)] truncate">
          {title}
        </h3>

        {description && (
          <p
            className="text-xs text-[var(--color-card-muted)] line-clamp-[var(--lines)]"
            style={{ '--lines': lines } as React.CSSProperties}
          >
            {description}
          </p>
        )}

        <div className="flex items-center gap-1.5 mt-auto">
          {favicon && (
            <img
              src={favicon}
              alt=""
              className="w-4 h-4"
              loading="lazy"
            />
          )}
          <span className="text-xs text-[var(--color-card-muted)] truncate">
            {publisher || hostname}
          </span>
        </div>
      </div>
    </a>
  );
}
```

---

### Task 15: 实现 LinkPreview 主组件

**Files:**

- Create: `packages/ui/src/LinkPreview.tsx`

- [ ] **Step 1: 创建 packages/ui/src/LinkPreview.tsx**

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { LinkPreviewProps, LinkPreviewStatus, LinkPreviewData, LinkPreviewError } from './types';
import { fetchPreview } from './fetchPreview';
import { LinkPreviewCard } from './LinkPreviewCard';
import { LinkPreviewSkeleton } from './LinkPreviewSkeleton';
import { LinkPreviewError as ErrorComponent } from './LinkPreviewError';

export function LinkPreview({
  url,
  apiUrl,
  size = 'md',
  className,
  fallback
}: LinkPreviewProps) {
  const [status, setStatus] = useState<LinkPreviewStatus>('idle');
  const [data, setData] = useState<LinkPreviewData | null>(null);
  const [error, setError] = useState<LinkPreviewError | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!url || !apiUrl) {
        setStatus('error');
        setError({ code: 'MISSING_PARAMS', message: 'URL and apiUrl are required' });
        return;
      }

      setStatus('loading');
      setError(null);

      try {
        const response = await fetchPreview(url, apiUrl);

        if (cancelled) return;

        if (response.success && response.data) {
          setData(response.data);
          setStatus('success');
        } else {
          setError(response.error || { code: 'UNKNOWN', message: 'Unknown error' });
          setStatus('error');
        }
      } catch (err) {
        if (cancelled) return;

        setError({
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Network error'
        });
        setStatus('error');
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [url, apiUrl]);

  if (status === 'loading' || status === 'idle') {
    return <LinkPreviewSkeleton size={size} />;
  }

  if (status === 'error') {
    return <ErrorComponent error={error!} size={size} fallback={fallback} />;
  }

  if (status === 'success' && data) {
    return <LinkPreviewCard data={data} size={size} className={className} />;
  }

  return null;
}
```

---

### Task 16: 导出入口文件

**Files:**

- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: 创建 packages/ui/src/index.ts**

```typescript
export { LinkPreview } from './LinkPreview';
export { LinkPreviewCard } from './LinkPreviewCard';
export { LinkPreviewSkeleton } from './LinkPreviewSkeleton';
export { LinkPreviewError } from './LinkPreviewError';

export type {
  LinkPreviewProps,
  LinkPreviewData,
  LinkPreviewError,
  LinkPreviewSize,
  LinkPreviewStatus,
  LinkPreviewResponse,
} from './types';
```

---

## Phase 4: 安装依赖并测试

### Task 17: 安装依赖

- [ ] **Step 1: 在根目录安装依赖**

```bash
cd link-preview
pnpm install
```

- [ ] **Step 2: 安装 API 包依赖**

```bash
cd packages/api
pnpm install
```

- [ ] **Step 3: 安装 UI 包依赖**

```bash
cd packages/ui
pnpm install
```

---

### Task 18: 构建并测试

- [ ] **Step 1: 构建 API 包**

```bash
cd packages/api
pnpm build
```

- [ ] **Step 2: 构建 UI 包**

```bash
cd packages/ui
pnpm build
```

- [ ] **Step 3: 启动 API 服务进行测试**

```bash
cd packages/api
pnpm dev
# 访问 http://localhost:3001/health
# 测试: http://localhost:3001/api/preview?url=https://github.com
```

---

## 实现顺序

1. **Phase 1** (Task 1-3): 项目初始化
2. **Phase 2** (Task 4-9): API 服务
3. **Phase 3** (Task 10-16): UI 组件
4. **Phase 4** (Task 17-18): 测试验证

---

## 验证清单

- [ ] API 服务启动成功
- [ ] `/health` 端点正常
- [ ] `/api/preview?url=...` 返回正确数据
- [ ] UI 组件构建成功
- [ ] 组件正确显示 loading/success/error 状态
