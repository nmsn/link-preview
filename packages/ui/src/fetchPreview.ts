import { fetchMetadata } from '@nmsn/link-preview-core';
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