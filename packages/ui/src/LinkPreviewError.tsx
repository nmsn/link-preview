import { memo } from 'react';
import type { LinkPreviewError as LinkPreviewErrorInfo } from './types.js';
import { cn } from '@/lib/utils';

export interface LinkPreviewErrorProps {
  error: LinkPreviewErrorInfo;
  fallback?: React.ReactNode;
  className?: string;
}

// Warning triangle SVG icon
function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export const LinkPreviewError = memo(function LinkPreviewError({
  error,
  fallback,
  className = '',
}: LinkPreviewErrorProps) {
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-xl border border-border overflow-hidden font-sans p-4',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-2 text-muted-foreground">
        <WarningIcon />

        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className="text-sm text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
            {error.message}
          </span>

          {error.code && (
            <span className="text-[11px] text-muted-foreground/70 font-mono">
              {error.code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});