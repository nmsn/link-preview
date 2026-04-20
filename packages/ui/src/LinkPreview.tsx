import { useState, useEffect, useCallback, memo } from 'react';
import { LinkPreviewCard } from './LinkPreviewCard.js';
import { LinkPreviewSkeleton } from './LinkPreviewSkeleton.js';
import { LinkPreviewError as LinkPreviewErrorComponent } from './LinkPreviewError.js';

export interface LinkPreviewError {
  code: string;
  message: string;
}

export interface LinkPreviewResponse {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  publisher: string;
}

export interface LinkPreviewProps {
  url: string;
  className?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ComponentType<{ error: LinkPreviewError }>;
  onPreviewFetched?: (data: LinkPreviewResponse) => void;
  onError?: (error: LinkPreviewError) => void;
}

interface FetchState {
  data: LinkPreviewResponse | null;
  loading: boolean;
  error: LinkPreviewError | null;
}

export const LinkPreview = memo(function LinkPreview({
  url,
  className = '',
  loadingComponent,
  errorComponent: ErrorComponent,
  onPreviewFetched,
  onError,
}: LinkPreviewProps) {
  const [state, setState] = useState<FetchState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchPreview = useCallback(async () => {
    if (!url) {
      setState({
        data: null,
        loading: false,
        error: {
          code: 'MISSING_URL',
          message: 'URL is required',
        },
      });
      return;
    }

    setState({ data: null, loading: true, error: null });

    try {
      const apiUrl = `/api/preview?url=${encodeURIComponent(url)}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (!result.success) {
        const error: LinkPreviewError = {
          code: result.error?.code || 'UNKNOWN_ERROR',
          message: result.error?.message || 'Failed to fetch preview',
        };
        setState({ data: null, loading: false, error });
        onError?.(error);
        return;
      }

      const data = result.data as LinkPreviewResponse;
      setState({ data, loading: false, error: null });
      onPreviewFetched?.(data);
    } catch (err) {
      const error: LinkPreviewError = {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Network request failed',
      };
      setState({ data: null, loading: false, error });
      onError?.(error);
    }
  }, [url, onError, onPreviewFetched]);

  useEffect(() => {
    fetchPreview();
  }, [fetchPreview]);

  if (state.loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return <LinkPreviewSkeleton className={className} />;
  }

  if (state.error) {
    if (ErrorComponent) {
      return <ErrorComponent error={state.error} />;
    }
    return <LinkPreviewErrorComponent error={state.error} className={className} />;
  }

  if (!state.data) {
    return null;
  }

  return (
    <LinkPreviewCard
      url={state.data.url}
      title={state.data.title}
      description={state.data.description}
      image={state.data.image}
      favicon={state.data.favicon}
      publisher={state.data.publisher}
      className={className}
    />
  );
});
