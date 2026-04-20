import { memo } from 'react';
import type { LinkPreviewError as LinkPreviewErrorInfo } from './types.js';

export interface LinkPreviewErrorProps {
  error: LinkPreviewErrorInfo;
  fallback?: React.ReactNode;
  className?: string;
}

// Warning triangle SVG icon
function WarningIcon() {
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
      style={{ flexShrink: 0 }}
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
  // If a custom fallback is provided, render it instead
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div
      className={`link-preview-error ${className}`.trim()}
      role="alert"
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-card-border)',
        borderRadius: 'var(--radius-card)',
        borderWidth: '1px',
        borderStyle: 'solid',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '16px',
      }}
    >
      <div
        className="link-preview-error-content"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          color: 'var(--color-card-muted)',
        }}
      >
        <WarningIcon />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            minWidth: 0,
            flex: '1',
          }}
        >
          <span
            className="link-preview-error-message"
            style={{
              fontSize: '14px',
              color: 'var(--color-card-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {error.message}
          </span>

          {error.code && (
            <span
              className="link-preview-error-code"
              style={{
                fontSize: '11px',
                color: 'var(--color-card-muted)',
                opacity: 0.7,
                fontFamily: 'monospace',
              }}
            >
              {error.code}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
