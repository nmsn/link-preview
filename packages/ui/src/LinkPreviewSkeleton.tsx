import { memo } from 'react';

export interface LinkPreviewSkeletonProps {
  className?: string;
}

export const LinkPreviewSkeleton = memo(function LinkPreviewSkeleton({
  className = '',
}: LinkPreviewSkeletonProps) {
  return (
    <div
      className={`link-preview-skeleton ${className}`.trim()}
      role="status"
      aria-label="Loading link preview"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-card-border)',
        borderRadius: 'var(--radius-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Image placeholder */}
      <div
        className="link-preview-skeleton-image"
        style={{
          width: '100%',
          height: '200px',
          backgroundColor: 'var(--color-card-border)',
          animation: 'link-preview-pulse 1.5s ease-in-out infinite',
        }}
      />

      <div
        className="link-preview-skeleton-content"
        style={{
          padding: '16px',
        }}
      >
        {/* Publisher row */}
        <div
          className="link-preview-skeleton-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          {/* Favicon placeholder */}
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '2px',
              backgroundColor: 'var(--color-card-border)',
              flexShrink: 0,
              animation: 'link-preview-pulse 1.5s ease-in-out infinite',
            }}
          />
          {/* Publisher placeholder */}
          <div
            style={{
              width: '80px',
              height: '12px',
              borderRadius: '4px',
              backgroundColor: 'var(--color-card-border)',
              animation: 'link-preview-pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Title placeholder */}
        <div
          className="link-preview-skeleton-title"
          style={{
            width: '75%',
            height: '18px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-card-border)',
            marginBottom: '8px',
            animation: 'link-preview-pulse 1.5s ease-in-out infinite',
          }}
        />

        {/* Description placeholders */}
        <div
          className="link-preview-skeleton-description-1"
          style={{
            width: '100%',
            height: '14px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-card-border)',
            marginBottom: '6px',
            animation: 'link-preview-pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          className="link-preview-skeleton-description-2"
          style={{
            width: '60%',
            height: '14px',
            borderRadius: '4px',
            backgroundColor: 'var(--color-card-border)',
            animation: 'link-preview-pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>

      {/* Keyframe animation injected via a style tag */}
      <style>{`
        @keyframes link-preview-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
});
