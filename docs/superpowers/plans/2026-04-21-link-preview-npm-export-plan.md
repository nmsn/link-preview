# Link Preview NPM Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 拆分项目为两个独立 npm 包：`@link-preview/core`（纯方法）和 `@link-preview/ui`（React 组件）

**Architecture:**
- 创建 `@link-preview/core` 包，保留 `fetchMetadata`、`validateUrl` 等纯方法，移除 Express 相关代码
- 更新 `@link-preview/ui` 包，直接 import core 包而非 HTTP 调用
- 保留 `@link-preview/api` 的 Express 服务作为参考，不删除

**Tech Stack:** TypeScript, pnpm workspace, Vite

---

## File Structure

```
packages/
├── core/                    # NEW - 纯方法包
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts         # 导出入口
│       ├── fetchMetadata.ts
│       ├── parseHtml.ts
│       └── utils/
│           ├── validate.ts
│           └── cache.ts
├── ui/                      # EXISTING - 更新 import 方式
│   ├── package.json         # 添加 core peerDep
│   └── src/
│       ├── fetchPreview.ts  # 改为 import core
│       └── ...
└── api/                     # EXISTING - 保留参考，标记废弃
    └── ...
```

---

## Task 1: Create @link-preview/core package

**Files:**
- Create: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/src/index.ts`
- Create: `packages/core/src/fetchMetadata.ts` (从 api 移动)
- Create: `packages/core/src/parseHtml.ts` (从 api 移动)
- Create: `packages/core/src/utils/validate.ts` (从 api 移动)
- Create: `packages/core/src/utils/cache.ts` (从 api 移动)

- [ ] **Step 1: Create packages/core directory structure**

```bash
mkdir -p packages/core/src/utils
```

- [ ] **Step 2: Create packages/core/package.json**

```json
{
  "name": "@link-preview/core",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "cheerio": "^1.0.0",
    "node-cache": "^5.1.2"
  },
  "devDependencies": {
    "@types/node": "^20.19.39",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Create packages/core/tsconfig.json**

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

- [ ] **Step 4: Create packages/core/src/index.ts**

```typescript
export { fetchMetadata, type LinkPreviewData, type FetchMetadataOptions } from './fetchMetadata';
export { validateUrl, type ValidateResult } from './utils/validate';
```

- [ ] **Step 5: Copy fetchMetadata.ts to core**

从 `packages/api/src/fetchMetadata.ts` 复制，移除 Express 注释，保持逻辑不变

- [ ] **Step 6: Copy parseHtml.ts to core**

从 `packages/api/src/parseHtml.ts` 复制

- [ ] **Step 7: Copy utils/validate.ts to core**

从 `packages/api/src/utils/validate.ts` 复制

- [ ] **Step 8: Copy utils/cache.ts to core**

从 `packages/api/src/utils/cache.ts` 复制

- [ ] **Step 9: Build core package**

Run: `cd packages/core && pnpm build`
Expected: 编译成功，生成 dist/

- [ ] **Step 10: Commit**

```bash
git add packages/core
git commit -m "feat(core): create @link-preview/core package with fetchMetadata and validateUrl

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 2: Update @link-preview/ui to use core package

**Files:**
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/src/fetchPreview.ts`

- [ ] **Step 1: Add core as dependency in ui package.json**

在 `packages/ui/package.json` dependencies 中添加:
```json
"@link-preview/core": "workspace:*"
```

- [ ] **Step 2: Update fetchPreview.ts to import from core**

修改 `packages/ui/src/fetchPreview.ts`:

```typescript
import { fetchMetadata } from '@link-preview/core';
import type { LinkPreviewResponse } from './types';

export async function fetchPreview(url: string): Promise<LinkPreviewResponse> {
  try {
    const data = await fetchMetadata(url);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}
```

- [ ] **Step 3: Verify ui package builds**

Run: `cd packages/ui && pnpm build`
Expected: 编译成功

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/fetchPreview.ts packages/ui/package.json
git commit -m "feat(ui): import fetchMetadata from @link-preview/core

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 3: Update workspace and verify integration

**Files:**
- Modify: `pnpm-workspace.yaml` (如需要)

- [ ] **Step 1: Verify workspace references**

Run: `pnpm install`
Expected: 两个包正确链接

- [ ] **Step 2: Verify types export correctly**

Run: `cd packages/core && pnpm build && cd ../ui && pnpm build`
Expected: 无类型错误

- [ ] **Step 3: Commit workspace update**

```bash
git add -A
git commit -m "chore: setup @link-preview/core and update ui to use it

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```

---

## Task 4: Verify in test-app

**Files:**
- Modify: `apps/test-app/` (验证导入)

- [ ] **Step 1: Test import in test-app**

检查 `apps/test-app` 中组件是否正常工作，确认 `import { LinkPreview } from '@link-preview/ui'` 可用

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "test: verify @link-preview/core and ui work in test-app

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
"
```
