import { parseHtml, getFallbackFavicon } from './parseHtml';
import { previewCache } from './utils/cache';

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
