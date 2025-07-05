/**
 * Utility functions for consistent error handling across the application
 */

export const isDevelopment = (): boolean => {
    return process.env.NODE_ENV === 'development';
};

export const logError = (message: string, error: unknown): void => {
    if (isDevelopment()) {
        console.error(message, error);
    } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(message, errorMessage);
    }
};

export const createErrorResponse = (message: string, error?: unknown): { message: string; error?: string } => {
    const response: { message: string; error?: string } = { message };

    if (isDevelopment() && error) {
        response.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return response;
};

export const sanitizeError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error';
}; 