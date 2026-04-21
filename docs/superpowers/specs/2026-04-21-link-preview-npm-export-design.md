# Link Preview NPM Export Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan.

**Goal:** 拆分为两个独立的 npm 包，支持在 React/Next.js 项目中作为组件使用。

**Architecture:**
- `@link-preview/core` - 纯 JS 方法包，无服务端依赖，提供 `fetchMetadata` 和 `validateUrl`
- `@link-preview/ui` - React 组件包，内部直接 import core 包的方法

**Tech Stack:** TypeScript, React 19, pnpm workspace

---

## Package Structure

### `@link-preview/core`

**Purpose:** 纯方法封装，供 SSR/Client 直接调用

**Exports:**
```typescript
export { fetchMetadata, type LinkPreviewData, type FetchMetadataOptions } from './fetchMetadata';
export { validateUrl, type ValidateResult } from './utils/validate';
```

**Files to keep:**
- `src/fetchMetadata.ts` - 核心抓取方法
- `src/parseHtml.ts` - HTML 解析
- `src/utils/validate.ts` - URL 验证
- `src/utils/cache.ts` - 内存缓存

**Files to remove:**
- `src/routes/preview.ts` - Express 路由（删除）
- `src/index.ts` 中的 Express 相关代码（删除）
- `cors`, `express` 依赖（删除）

**New package.json:**
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
  }
}
```

### `@link-preview/ui`

**Changes:**
- `src/fetchPreview.ts` 改为直接 import core 包
- 不再需要通过 HTTP 调用 API

**New fetchPreview.ts:**
```typescript
import { fetchMetadata } from '@link-preview/core';

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

---

## Implementation Tasks

### Task 1: Create @link-preview/core package

1. Create `packages/core/package.json`
2. Create `packages/core/tsconfig.json`
3. Move `fetchMetadata.ts`, `parseHtml.ts` to `packages/core/src/`
4. Move `utils/validate.ts`, `utils/cache.ts` to `packages/core/src/utils/`
5. Create `packages/core/src/index.ts`（仅导出方法，无 Express）
6. Update `packages/api/package.json` → 删除，保留备份参考

### Task 2: Update @link-preview/ui package

1. 修改 `fetchPreview.ts` 直接 import `@link-preview/core`
2. 更新 `package.json` 添加 core 为 peerDependency（可选 dependency）
3. 更新 `tsconfig.json` 确保 path alias 正确

### Task 3: Update workspace configuration

1. 更新 `pnpm-workspace.yaml`（如需要）
2. 验证两个包可以正确相互引用
3. 更新根 `package.json` 的 scripts（如有）

### Task 4: Build and verify

1. `pnpm build` - 构建两个包
2. 类型检查通过
3. 在 test-app 中验证导入正常
