import { Router, Request, Response } from 'express';
import { fetchMetadata } from '../fetchMetadata.js';
import { validateUrl } from '../utils/validate.js';
import { previewCache } from '../utils/cache.js';

const router: Router = Router();

interface PreviewQuery {
  url?: string;
  timeout?: string;
}

router.get('/preview', async (req: Request, res: Response) => {
  const { url, timeout } = req.query as PreviewQuery;

  // Validate URL
  const validation = validateUrl(url!);
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
