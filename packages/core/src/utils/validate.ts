export interface ValidateResult {
  valid: boolean;
  error?: {
    code: string;
    message: string;
  };
}

const PRIVATE_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^0\.\d+\.\d+\.\d+$/,
  /^::1$/,
  /^fe80:/i,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,
];

export function validateUrl(urlString: string): ValidateResult {
  if (!urlString) {
    return {
      valid: false,
      error: {
        code: 'MISSING_URL',
        message: 'URL parameter is required',
      },
    };
  }

  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return {
      valid: false,
      error: {
        code: 'INVALID_URL',
        message: 'Invalid URL format',
      },
    };
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    return {
      valid: false,
      error: {
        code: 'INVALID_PROTOCOL',
        message: 'Only HTTP and HTTPS protocols are allowed',
      },
    };
  }

  const hostname = url.hostname.toLowerCase();
  for (const pattern of PRIVATE_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        valid: false,
        error: {
          code: 'BLOCKED_HOST',
          message: 'Private and localhost URLs are not allowed',
        },
      };
    }
  }

  return { valid: true };
}