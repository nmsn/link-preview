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
