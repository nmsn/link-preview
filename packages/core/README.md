# @nmsn/link-preview-core

Node.js library for fetching URL metadata (title, description, image, favicon).

## Install

```bash
npm install @nmsn/link-preview-core
```

## Usage

```ts
import { fetchMetadata } from '@nmsn/link-preview-core';

const metadata = await fetchMetadata('https://example.com');
// {
//   title: "Example Domain",
//   description: "...",
//   image: "https://example.com/og-image.jpg",
//   favicon: "https://example.com/favicon.ico",
//   url: "https://example.com"
// }
```

## API

### `fetchMetadata(url: string, options?: FetchMetadataOptions): Promise<MetadataResult>`

Fetches Open Graph and HTML meta information from a URL.

**Parameters:**
- `url` - The URL to fetch metadata from
- `options.cacheTTL` - Cache TTL in seconds (default: 86400, i.e., 24 hours)
- `options.userAgent` - Custom User-Agent header
- `options.timeout` - Request timeout in milliseconds (default: 10000)

**Returns:** `MetadataResult` object with `title`, `description`, `image`, `favicon`, `url`

### `validateUrl(url: string): boolean`

Validates if a string is a valid absolute URL.

## Requirements

- Node.js >= 18
