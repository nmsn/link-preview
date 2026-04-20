import { NextRequest, NextResponse } from 'next/server';
import { fetchMetadata, validateUrl } from '@link-preview/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const timeout = searchParams.get('timeout');

  // Validate URL
  const validation = validateUrl(url!);
  if (!validation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: validation.error?.code || 'INVALID_URL',
          message: validation.error?.message || 'Invalid URL',
        },
      },
      { status: 400 }
    );
  }

  // Parse timeout
  const timeoutMs = timeout ? parseInt(timeout, 10) : undefined;
  if (timeout && Number.isNaN(timeoutMs)) {
    return NextResponse.json({ success: false, error: { code: 'INVALID_TIMEOUT', message: 'Timeout must be a number' } }, { status: 400 });
  }

  try {
    const data = await fetchMetadata(url!, timeoutMs !== undefined ? { timeout: timeoutMs } : {});

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message,
        },
      },
      { status: 500 }
    );
  }
}