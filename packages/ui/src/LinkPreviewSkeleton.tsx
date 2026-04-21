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
        'rounded-xl border overflow-hidden font-sans animate-pulse',
        className
      )}
      role="status"
      aria-label="Loading link preview"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Image placeholder */}
      <div
        className="w-full h-50"
        style={{ backgroundColor: 'var(--border)' }}
      />

      <div className="p-4">
        {/* Publisher row */}
        <div className="flex items-center gap-2 mb-2">
          {/* Favicon placeholder */}
          <div
            className="w-4 h-4 rounded-sm shrink-0"
            style={{ backgroundColor: 'var(--border)' }}
          />
          {/* Publisher placeholder */}
          <div
            className="w-20 h-3 rounded"
            style={{ backgroundColor: 'var(--border)' }}
          />
        </div>

        {/* Title placeholder */}
        <div
          className="w-3/4 h-4 rounded mb-2"
          style={{ backgroundColor: 'var(--border)' }}
        />

        {/* Description placeholders */}
        <div
          className="w-full h-3 rounded mb-1.5"
          style={{ backgroundColor: 'var(--border)' }}
        />
        <div
          className="w-3/5 h-3 rounded"
          style={{ backgroundColor: 'var(--border)' }}
        />
      </div>
    </div>
  );
});