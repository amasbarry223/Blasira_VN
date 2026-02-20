import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Options pour la fonction lazyLoad
 */
interface LazyLoadOptions {
  /** Nombre de tentatives en cas d'échec (défaut: 3) */
  retries?: number;
  /** Délai entre les tentatives en millisecondes (défaut: 1000) */
  retryDelay?: number;
  /** Message d'erreur personnalisé */
  errorMessage?: string;
}

/**
 * Fonction utilitaire pour le lazy loading avec gestion d'erreur et retry automatique
 * 
 * @param importFn - Fonction d'import dynamique
 * @param options - Options de configuration
 * @returns Composant lazy avec gestion d'erreur
 * 
 * @example
 * ```tsx
 * const Dashboard = lazyLoad(() => import('./pages/admin/Dashboard'));
 * ```
 */
/**
 * Constantes pour la configuration par défaut
 */
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;
const MIN_RETRIES = 1;
const MAX_RETRIES = 10;
const MIN_RETRY_DELAY_MS = 100;
const MAX_RETRY_DELAY_MS = 30000;

/**
 * Valide et normalise les options de lazyLoad
 */
function validateOptions(options: LazyLoadOptions): Required<Omit<LazyLoadOptions, 'errorMessage'>> & { errorMessage?: string } {
  const retries = Math.max(MIN_RETRIES, Math.min(MAX_RETRIES, options.retries ?? DEFAULT_RETRIES));
  const retryDelay = Math.max(
    MIN_RETRY_DELAY_MS,
    Math.min(MAX_RETRY_DELAY_MS, options.retryDelay ?? DEFAULT_RETRY_DELAY_MS)
  );
  
  return {
    retries,
    retryDelay,
    errorMessage: options.errorMessage,
  };
}

export function lazyLoad<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> {
  if (typeof importFn !== 'function') {
    throw new TypeError('importFn must be a function');
  }

  const { retries, retryDelay, errorMessage } = validateOptions(options);

  // Fonction wrapper avec retry
  const importWithRetry = async (attempt = 1): Promise<{ default: T }> => {
    try {
      const module = await importFn();
      
      // Vérifier que le module a bien un export default
      if (!module || typeof module !== 'object' || !('default' in module) || !module.default) {
        throw new Error(
          errorMessage || 
          'Le module importé ne contient pas d\'export default valide'
        );
      }
      
      return module;
    } catch (error) {
      // Si on a encore des tentatives, réessayer
      if (attempt < retries) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `Échec du chargement du module (tentative ${attempt}/${retries}). Nouvelle tentative dans ${retryDelay * attempt}ms...`,
            error
          );
        }
        
        // Attendre avant de réessayer avec délai progressif
        const delay = retryDelay * attempt;
        await new Promise<void>(resolve => setTimeout(resolve, delay));
        
        // Réessayer avec un compteur incrémenté
        return importWithRetry(attempt + 1);
      }
      
      // Toutes les tentatives ont échoué
      const finalError = error instanceof Error 
        ? error 
        : new Error('Erreur inconnue lors du chargement du module');
      
      if (process.env.NODE_ENV === 'development') {
        console.error(
          errorMessage || 
          `Impossible de charger le module après ${retries} tentatives`,
          finalError
        );
      }
      
      // Re-lancer l'erreur pour qu'elle soit capturée par l'ErrorBoundary
      throw new Error(
        errorMessage || 
        `Échec du chargement du module: ${finalError.message}`
      );
    }
  };

  // Retourner un composant lazy avec la fonction wrapper
  return lazy(() => importWithRetry());
}

/**
 * Helper pour créer un lazy load avec un nom de module (pour meilleur debugging)
 */
export function lazyLoadNamed<T extends ComponentType<unknown>>(
  moduleName: string,
  importFn: () => Promise<{ default: T }>,
  options?: LazyLoadOptions
): LazyExoticComponent<T> {
  if (typeof moduleName !== 'string' || moduleName.trim().length === 0) {
    throw new TypeError('moduleName must be a non-empty string');
  }

  return lazyLoad(importFn, {
    ...options,
    errorMessage: options?.errorMessage || `Impossible de charger le module "${moduleName}"`,
  });
}

