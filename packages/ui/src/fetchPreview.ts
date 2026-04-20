import type { LinkPreviewResponse } from './types.js';

/**
 * Fetches link preview data from the API service.
 *
 * @param url - The URL to fetch preview metadata for
 * @param apiUrl - Base URL of the @link-preview/api service (e.g. "http://localhost:3001/api")
 * @returns Parsed API response including success flag and preview data or error details
 */
export async function fetchPreview(url: string, apiUrl: string): Promise<LinkPreviewResponse> {
  const fullUrl = `${apiUrl.replace(/\/$/, '')}/preview?url=${encodeURIComponent(url)}`;

  const response = await fetch(fullUrl);
  const data = await response.json();

  return data as LinkPreviewResponse;
}
