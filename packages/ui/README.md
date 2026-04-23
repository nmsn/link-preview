# @nmsn/link-preview-ui

React components for displaying link previews.

## Install

```bash
npm install @nmsn/link-preview-ui
```

**Peer dependencies:** React 19+, React DOM 19+

## Components

### `<LinkPreview url="https://example.com" />`

Fetches and displays metadata for a URL. Handles loading, error, and success states automatically.

```tsx
import { LinkPreview } from '@nmsn/link-preview-ui';

function App() {
  return <LinkPreview url="https://example.com" />;
}
```

### `<LinkPreviewCard metadata={...} />`

Standalone card component that displays link metadata. Does not fetch data.

```tsx
import { LinkPreviewCard } from '@nmsn/link-preview-ui';

const metadata = await fetchMetadata('https://example.com');
<LinkPreviewCard metadata={metadata} />;
```

### `<LinkPreviewSkeleton />`

Loading placeholder with animated skeleton UI.

### `<LinkPreviewErrorComponent />`

Error state component displayed when fetching fails.

## Requirements

- Node.js >= 18
- React 19+
- React DOM 19+
