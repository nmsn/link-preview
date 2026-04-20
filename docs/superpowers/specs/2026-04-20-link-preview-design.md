# Link Preview 组件设计文档

**日期：** 2026-04-20  
**状态：** 设计中  
**版本：** 0.1.0

---

## 1. 项目概述

### 1.1 项目背景

用户希望开发一个 Link Preview 组件，类似 @microlink/react 的功能，但使用以下技术栈：

- React 19
- Tailwind CSS v4
- Cheerio（服务端 HTML 解析）
- pnpm workspace + monorepo 结构

### 1.2 核心目标

1. **完全自托管** - 不依赖 microlink.io 等第三方服务
2. **可复用** - 打包为 npm 包，支持在其他项目中复用
3. **轻量级** - 使用 cheerio 解析静态 HTML，仅在必要时使用 Playwright

### 1.3 架构决策

| 决策     | 选择             | 原因                           |
| -------- | ---------------- | ------------------------------ |
| 数据获取 | 自建 API 服务    | 避免 CORS 问题，支持服务端爬虫 |
| 渲染模式 | Client Component | 支持 React 19，可打包为 npm    |
| 样式方案 | Tailwind CSS v4  | 最新版本，CSS-first 配置       |
| Monorepo | pnpm workspace   | 用户偏好                       |

---

## 2. 项目结构

```
link-preview/
├── pnpm-workspace.yaml
├── package.json                    # 根目录 workspace 配置
├── tsconfig.base.json              # 共享 TypeScript 配置
│
├── packages/
│   ├── ui/                        # React UI 组件包
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts          # 构建配置
│   │   ├── src/
│   │   │   ├── index.ts            # 导出入口
│   │   │   ├── LinkPreview.tsx     # 主组件
│   │   │   ├── LinkPreviewCard.tsx # 卡片展示
│   │   │   ├── LinkPreviewSkeleton.tsx
│   │   │   ├── LinkPreviewError.tsx
│   │   │   ├── fetchPreview.ts     # 客户端数据请求
│   │   │   └── types.ts
│   │   ├── styles/
│   │   │   └── main.css            # Tailwind v4 入口
│   │   └── README.md
│   │
│   └── api/                        # API 服务包
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts            # 服务入口
│       │   ├── fetchMetadata.ts    # cheerio 爬虫核心
│       │   ├── parseHtml.ts        # HTML 解析工具
│       │   └── routes/
│       │       └── preview.ts      # /api/preview 路由
│       └── README.md
│
└── docs/
    └── specs/
        └── 2026-04-20-link-preview-design.md
```

---

## 3. 包设计

### 3.1 @link-preview/ui

**用途：** React UI 组件包，可在任何 React 项目中使用

**安装：**

```bash
npm install @link-preview/ui
```

**使用：**

```tsx
import { LinkPreview } from '@link-preview/ui';

function App() {
  return <LinkPreview url="https://github.com" apiUrl="http://localhost:3001/api/preview" />;
}
```

**API 配置：**

| Prop        | 类型                             | 默认值 | 说明           |
| ----------- | -------------------------------- | ------ | -------------- |
| `url`       | `string`                         | 必填   | 目标链接       |
| `apiUrl`    | `string`                         | 必填   | API 服务地址   |
| `width`     | `'full' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 卡片宽度       |
| `className` | `string`                         | -      | 自定义样式     |
| `fallback`  | `ReactNode`                      | -      | 自定义降级内容 |

**类型定义：**

```typescript
export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  publisher: string;
}

export interface LinkPreviewProps {
  url: string;
  apiUrl: string;
  width?: 'full' | 'sm' | 'md' | 'lg';
  className?: string;
  fallback?: React.ReactNode;
}
```

**peerDependencies：**

```json
{
  "react": ">=18",
  "react-dom": ">=18"
}
```

---

### 3.2 @link-preview/api

**用途：** Node.js API 服务，提供 Link Preview 数据

**安装：**

```bash
npm install
pnpm --filter @link-preview/api build
```

**运行：**

```bash
cd packages/api
pnpm dev    # 开发模式
pnpm start  # 生产模式
```

**API 接口：**

```
GET /api/preview?url=https://github.com

Response (成功):
{
  "success": true,
  "data": {
    "url": "https://github.com",
    "title": "GitHub",
    "description": "Where the world builds software",
    "image": "https://github.githubassets.com/...",
    "favicon": "https://github.githubassets.com/favicons/favicon.svg",
    "publisher": "GitHub"
  }
}

Response (错误):
{
  "success": false,
  "error": {
    "code": "FETCH_ERROR",
    "message": "Failed to fetch the URL"
  }
}
```

**错误码：**

| 错误码        | 说明             |
| ------------- | ---------------- |
| `MISSING_URL` | 缺少 url 参数    |
| `INVALID_URL` | URL 格式无效     |
| `FETCH_ERROR` | 请求目标页面失败 |
| `PARSE_ERROR` | 解析 HTML 失败   |
| `TIMEOUT`     | 请求超时         |

---

## 4. 数据流

```
┌─────────────────────────────────────────────────────────────────┐
│                           用户端                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  <LinkPreview url="..." apiUrl="...">                     │  │
│  │      │                                                     │  │
│  │      ├── 状态: loading                                    │  │
│  │      │   └── <LinkPreviewSkeleton />                      │  │
│  │      │                                                     │  │
│  │      ├── 状态: success                                    │  │
│  │      │   └── <LinkPreviewCard data={...} />                │  │
│  │      │                                                     │  │
│  │      └── 状态: error                                      │  │
│  │          └── <LinkPreviewError error={...} />             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP GET /api/preview?url=...
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        @link-preview/api                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Express Server                                            │  │
│  │      │                                                     │  │
│  │      └── /api/preview                                      │  │
│  │              │                                             │  │
│  │              ↓                                             │  │
│  │      ┌──────────────────┐                                  │  │
│  │      │ fetchMetadata()  │                                  │  │
│  │      │  - fetch HTML    │                                  │  │
│  │      │  - cheerio parse │                                  │  │
│  │      │  - extract meta  │                                  │  │
│  │      └──────────────────┘                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. 爬虫逻辑 (fetchMetadata.ts)

### 5.1 解析优先级

```typescript
const METADATA_PRIORITY = {
  title: [
    'meta[property="og:title"]', // Open Graph
    'meta[name="twitter:title"]', // Twitter Card
    'title', // HTML title
  ],
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
  favicon: ['link[rel="icon"]', 'link[rel="shortcut icon"]'],
  publisher: ['meta[property="og:site_name"]'],
};
```

### 5.2 实现伪代码

```typescript
async function fetchMetadata(url: string): Promise<LinkPreviewData> {
  // 1. 验证 URL
  validateUrl(url);

  // 2. 获取 HTML
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'LinkPreviewBot/1.0',
      Accept: 'text/html',
    },
    signal: AbortSignal.timeout(10000), // 10s 超时
  });

  // 3. 解析 HTML
  const html = await response.text();
  const $ = cheerio.load(html);

  // 4. 提取 metadata
  return {
    url,
    title: extractFirst($, METADATA_PRIORITY.title),
    description: extractFirst($, METADATA_PRIORITY.description),
    image: resolveUrl(url, extractFirst($, METADATA_PRIORITY.image)),
    favicon: resolveUrl(url, extractFirst($, METADATA_PRIORITY.favicon)),
    publisher: extractFirst($, METADATA_PRIORITY.publisher),
  };
}
```

### 5.3 降级策略

| 字段          | 降级值                                                        |
| ------------- | ------------------------------------------------------------- |
| `title`       | URL 的 hostname + pathname                                    |
| `description` | 空字符串                                                      |
| `image`       | 省略 (卡片不显示图片)                                         |
| `favicon`     | `https://www.google.com/s2/favicons?domain=${hostname}&sz=64` |
| `publisher`   | URL 的 hostname                                               |

**当所有字段都获取不到时：** 返回最小化数据，UI 组件显示 URL 链接 + favicon

### 5.4 API 服务配置

```
GET /api/preview?url=https://github.com&timeout=8000
```

**可选参数：**

| 参数      | 类型     | 默认值  | 说明         |
| --------- | -------- | ------- | ------------ |
| `timeout` | `number` | `10000` | 请求超时(ms) |
| `headers` | `object` | -       | 自定义请求头 |

### 5.5 缓存策略

```typescript
// 使用 node-cache 进行内存缓存
// TTL: 1小时 (3600秒)
// Key: URL 的 MD5 hash

interface CacheEntry {
  data: LinkPreviewData;
  timestamp: number;
}

// 响应头
// X-Cache-Hit: true | false
```

### 5.6 安全配置

```typescript
// URL 验证
const URL_PATTERNS = {
  // 只允许 http/https 协议
  allowedProtocols: ['http:', 'https:'],

  // 拒绝内网 IP (防止 SSRF)
  blockedHosts: [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16',
  ],

  // User-Agent 模拟主流浏览器
  userAgent: 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0; +https://example.com/bot)',
};
```

### 5.7 健康检查端点

```
GET /health

Response:
{
  "status": "ok",
  "version": "0.1.0",
  "uptime": 3600
}
```

### 5.8 API 版本控制

```
当前版本: /api/preview (v1)
未来版本: /api/v2/preview
```

---

## 6. 组件设计

### 6.1 LinkPreviewCard UI

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌─────────┐  标题标题标题标题标题标题标题标题标题标题标题标题标题    │
│  │         │                                                    │
│  │  图片    │  描述描述描述描述描述描述描述描述描述描述描述描述描述  │
│  │         │  描述描述描述描述描述描述描述描述描述描述描述描述描述  │
│  │         │                                                    │
│  └─────────┘                                                    │
│                                                                  │
│  🔗 github.com                               •  3个月前         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 尺寸变体

| Variant | 宽度  | 图片尺寸 | 描述行数 |
| ------- | ----- | -------- | -------- |
| `sm`    | 320px | 80x80    | 2        |
| `md`    | 400px | 120x120  | 2        |
| `lg`    | 500px | 160x160  | 3        |
| `full`  | 100%  | 响应式   | 3        |

### 6.3 Tailwind v4 样式

```css
/* packages/ui/styles/main.css */
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

## 7. 配置

### 7.1 根目录 package.json

```json
{
  "name": "link-preview",
  "private": true,
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint"
  }
}
```

### 7.2 tsconfig.base.json

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
    "forceConsistentCasingInFileNames": true
  }
}
```

### 7.3 pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
```

---

## 8. 实现计划

### Phase 1: 项目初始化

1. 初始化 monorepo 结构
2. 配置 TypeScript
3. 配置 Tailwind v4
4. 配置 Vite 构建

### Phase 2: API 服务

1. 实现 fetchMetadata
2. 实现 parseHtml
3. 创建 Express 路由
4. 测试 API

### Phase 3: UI 组件

1. 实现 LinkPreview 主组件
2. 实现 LinkPreviewCard
3. 实现加载/错误状态
4. 打包构建配置

### Phase 4: 文档与发布

1. 编写 README
2. 添加使用示例
3. 发布到 npm（可选）

---

## 9. 待确认

- [x] ~~是否需要支持 Playwright 解析 JS 渲染页面？~~ **暂不支持，后续可扩展**
- [x] ~~API 服务是否需要缓存机制？~~ **需要，1小时 TTL**
- [x] ~~是否需要速率限制？~~ **暂不需要，后续可扩展**

---

## 10. 参考资料

- [@microlink/react 源码分析](./2026-04-20-microlink-analysis.md)
- [@microlink/mql 源码分析](./2026-04-20-mql-analysis.md)
- [React 19 Server Components](https://react.dev/reference/rsc)
- [Tailwind CSS v4](https://tailwindcss.com/docs/upgrade-guide)
- [Cheerio 文档](https://cheerio.js.org/)
