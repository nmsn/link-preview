import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface LinkPreviewSkeletonProps {
  className?: string;
}

export const LinkPreviewSkeleton = memo(function LinkPreviewSkeleton({
  className = '',
}: LinkPreviewSkeletonProps) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-xl border border-border overflow-hidden font-sans animate-pulse',
        className
      )}
      role="status"
      aria-label="Loading link preview"
    >
      {/* Image placeholder */}
      <div className="w-full h-50 bg-border" />

      <div className="p-4">
        {/* Publisher row */}
        <div className="flex items-center gap-2 mb-2">
          {/* Favicon placeholder */}
          <div className="w-4 h-4 rounded-sm bg-border shrink-0" />
          {/* Publisher placeholder */}
          <div className="w-20 h-3 rounded bg-border" />
        </div>

        {/* Title placeholder */}
        <div className="w-3/4 h-4 rounded bg-border mb-2" />

        {/* Description placeholders */}
        <div className="w-full h-3 rounded bg-border mb-1.5" />
        <div className="w-3/5 h-3 rounded bg-border" />
      </div>
    </div>
  );
});