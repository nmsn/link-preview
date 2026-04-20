import type { ReactNode } from 'react';

export interface LinkPreviewData {
  url: string;
  title: string;
  description: string;
  image: string;
  favicon: string;
  publisher: string;
}

export interface LinkPreviewError {
  code: string;
  message: string;
}

export interface LinkPreviewResponse {
  success: boolean;
  data?: LinkPreviewData;
  error?: LinkPreviewError;
  meta?: {
    cached?: boolean;
  };
}

export type LinkPreviewSize = 'sm' | 'md' | 'lg' | 'full';

export interface LinkPreviewProps {
  url: string;
  apiUrl: string;
  size?: LinkPreviewSize;
  className?: string;
  fallback?: ReactNode;
}

export type LinkPreviewStatus = 'idle' | 'loading' | 'success' | 'error';
