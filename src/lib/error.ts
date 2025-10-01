import { setMessage } from './utils';

/**
 * Custom error class for application-specific errors.
 * @param {string} message - The internal error message.
 * @param {string} code - A unique error code.
 * @param {string} [userMessage] - A user-friendly message to display in the UI.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly userMessage?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Global error handler for the application.
 * Logs the error to the console and displays a user-friendly message.
 * @param {unknown} error - The error to handle.
 */
export function errorHandler(error: unknown): void {
  if (error instanceof AppError) {
    console.error(`[${error.code}]`, error.message);
    setMessage(error.userMessage || 'An unexpected error occurred.', 'error');
  } else if (error instanceof Error) {
    console.error('[UNHANDLED_ERROR]', error.message);
    setMessage('An unexpected error occurred. Please check the console.', 'error');
  } else {
    console.error('[UNKNOWN_ERROR]', error);
    setMessage('An unknown error occurred.', 'error');
  }
}