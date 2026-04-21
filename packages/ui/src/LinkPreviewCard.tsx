import { memo } from 'react';
import { cn } from '@/lib/utils';

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
      className={cn(
        'rounded-xl border overflow-hidden font-sans',
        className
      )}
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
      }}
    >
      {image && (
        <div
          className="w-full h-50 overflow-hidden"
          style={{ backgroundColor: 'var(--border)' }}
        >
          <img
            src={image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {favicon && (
            <img
              src={favicon}
              alt=""
              className="w-4 h-4 rounded-sm shrink-0"
            />
          )}
          <span
            className="text-xs overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {displayPublisher}
          </span>
        </div>

        <a
          href={url}
          className="no-underline text-inherit"
        >
          <h3
            className="text-base font-semibold mb-1 overflow-hidden text-ellipsis whitespace-nowrap leading-tight"
            style={{ color: 'var(--card-foreground)' }}
          >
            {displayTitle}
          </h3>

          {displayDescription && (
            <p
              className="text-sm m-0 overflow-hidden text-ellipsis line-clamp-2 leading-relaxed"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {displayDescription}
            </p>
          )}
        </a>
      </div>
    </div>
  );
});