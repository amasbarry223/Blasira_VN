import { supabase } from '@/integrations/supabase/client';
import type { PostgrestError } from '@supabase/supabase-js';

/**
 * Centralized error handler for Supabase API calls
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: string,
    public hint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Transform Supabase errors into user-friendly messages
 */
export function handleSupabaseError(error: PostgrestError | Error): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  // Check if it's a Supabase PostgrestError
  if ('code' in error && 'message' in error) {
    const pgError = error as PostgrestError;
    
    // Map common error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      '23505': 'Cette entrée existe déjà',
      '23503': 'Référence invalide',
      '23502': 'Champ requis manquant',
      '42501': 'Permission refusée',
      'PGRST116': 'Aucun résultat trouvé',
    };

    const userMessage = errorMessages[pgError.code || ''] || pgError.message || 'Une erreur est survenue';

    return new ApiError(
      userMessage,
      pgError.code,
      pgError.details || undefined,
      pgError.hint || undefined
    );
  }

  // Generic error
  return new ApiError(error.message || 'Une erreur inconnue est survenue');
}

/**
 * Log error for debugging (only in development)
 */
export function logError(error: Error | ApiError, context?: string) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error]${context ? ` [${context}]` : ''}:`, {
      message: error.message,
      code: 'code' in error ? error.code : undefined,
      details: 'details' in error ? error.details : undefined,
      stack: error.stack,
    });
  }

  // In production, you might want to send to an error tracking service
  // Example: Sentry.captureException(error);
}

/**
 * Wrapper for Supabase queries with error handling
 */
export async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  context?: string
): Promise<T> {
  try {
    const { data, error } = await queryFn();

    if (error) {
      const apiError = handleSupabaseError(error);
      logError(apiError, context);
      throw apiError;
    }

    if (data === null) {
      throw new ApiError('Aucune donnée retournée');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    const apiError = handleSupabaseError(error as Error);
    logError(apiError, context);
    throw apiError;
  }
}

