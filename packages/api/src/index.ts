import express from 'express';
import cors from 'cors';
import previewRouter from './routes/preview.js';

// Re-export core functions for use by other packages
export { fetchMetadata, type LinkPreviewData, type FetchMetadataOptions } from './fetchMetadata.js';
export { validateUrl, type ValidateResult } from './utils/validate.js';

const app = express();
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log(`Link Preview API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
