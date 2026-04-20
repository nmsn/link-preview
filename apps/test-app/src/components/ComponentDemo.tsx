import type { ReactNode } from 'react';

interface ComponentDemoProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ComponentDemo({ title, description, children }: ComponentDemoProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <div className="flex items-center justify-center">{children}</div>
    </div>
  );
}