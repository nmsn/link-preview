import { PreviewShowcase } from '../components/PreviewShowcase';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Link Preview Test App
        </h1>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Testing @nmsn/link-preview-ui components with @nmsn/link-preview-api
        </p>

        <PreviewShowcase />
      </div>
    </main>
  );
}