# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo for link preview functionality. Three publishable packages with a test app:

- **@nmsn/link-preview-core** - Core metadata fetching logic (Node.js)
- **@link-preview/ui** - React components (Vite, Tailwind CSS, Base UI)
- **@link-preview/api** - Express server for proxy/parsing
- **test-app** - Next.js app for local development testing

## Common Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development
pnpm dev                    # Start all packages in parallel
pnpm dev:test-app           # Start only test-app (Next.js)

# Code quality
pnpm lint
pnpm lint:fix
pnpm format

# Release (run locally or CI handles it)
pnpm release                # build + changeset version + publish
pnpm changeset              # Create a new changeset (run before committing changes)
```

## Architecture

```
packages/
  core/         # fetchMetadata.ts, parseHtml.ts - pure Node.js logic
  ui/           # React components importing from core
  api/          # Express server

apps/
  test-app/     # Next.js consuming all packages via workspace:*
```

Package dependencies (managed by changesets):
- `ui` depends on `core` via `workspace:*`
- `test-app` depends on all three packages

Each package has independent versioning - no fixed grouping.

## Release Process

This repo uses [changesets](https://pnpm.io/using-changesets) for versioning and publishing.

1. Make code changes
2. Run `pnpm changeset` to describe the change (creates `.changeset/*.md`)
3. Commit code + changeset files
4. CI automatically:
   - Builds all packages
   - Runs `changeset version` to bump versions and update internal deps
   - Runs `changeset publish` to npm
   - Creates GitHub Release

The `fixed` array in `.changeset/config.json` groups packages for atomic versioning.

## Package Notes

- **core**: Builds with plain `tsc`, outputs to `dist/`
- **ui**: Builds with `vite build && tsc --emitDeclarationOnly`
- **api**: Builds with `tsc`, uses Express + Cheerio

Core exports use `.js` extension in exports map (not `.mjs`) for Node.js ESM compatibility.
