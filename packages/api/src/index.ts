import express, { type Express } from 'express';
import cors from 'cors';
import previewRouter from './routes/preview';

// Re-export core functions for use by other packages
export { fetchMetadata, type LinkPreviewData, type FetchMetadataOptions } from './fetchMetadata';
export { validateUrl, type ValidateResult } from './utils/validate';

// Create Express app - exported for use without starting server
export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      version: '0.1.0',
      uptime: process.uptime(),
    });
  });

  // Routes
  app.use('/api', previewRouter);

  // Error handler
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  });

  return app;
}

// Only start server when run directly (not imported)
const isMain = process.argv[1]?.includes('src/index.ts');
if (isMain) {
  const PORT = process.env.PORT || 3001;
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Link Preview API running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}