import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Link Preview Test App',
  description: 'Testing @nmsn/link-preview-ui components with @nmsn/link-preview-api',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
