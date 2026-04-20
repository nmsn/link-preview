import { memo } from 'react';

export interface LinkPreviewCardProps {
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  publisher?: string;
  url: string;
  className?: string;
}

export const LinkPreviewCard = memo(function LinkPreviewCard({
  title,
  description,
  image,
  favicon,
  publisher,
  url,
  className = '',
}: LinkPreviewCardProps) {
  const displayTitle = title || url;
  const displayDescription = description;
  const displayPublisher = publisher || new URL(url).hostname;

  return (
    <div
      className={`link-preview-card ${className}`.trim()}
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
      {image && (
        <div
          className="link-preview-card-image"
          style={{
            width: '100%',
            height: '200px',
            overflow: 'hidden',
            backgroundColor: 'var(--color-card-border)',
          }}
        >
          <img
            src={image}
            alt=""
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      <div
        className="link-preview-card-content"
        style={{
          padding: '16px',
        }}
      >
        <div
          className="link-preview-card-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px',
          }}
        >
          {favicon && (
            <img
              src={favicon}
              alt=""
              className="link-preview-card-favicon"
              style={{
                width: '16px',
                height: '16px',
              }}
            />
          )}
          <span
            className="link-preview-card-publisher"
            style={{
              fontSize: '12px',
              color: 'var(--color-card-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {displayPublisher}
          </span>
        </div>

        <a
          href={url}
          className="link-preview-card-link"
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <h3
            className="link-preview-card-title"
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-card-text)',
              margin: '0 0 4px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              lineHeight: '1.4',
            }}
          >
            {displayTitle}
          </h3>

          {displayDescription && (
            <p
              className="link-preview-card-description"
              style={{
                fontSize: '14px',
                color: 'var(--color-card-muted)',
                margin: '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.5',
              }}
            >
              {displayDescription}
            </p>
          )}
        </a>
      </div>
    </div>
  );
});
