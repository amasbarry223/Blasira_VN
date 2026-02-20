import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  /** Nom du module qui a échoué (pour meilleur debugging) */
  moduleName?: string;
  /** Callback personnalisé pour le retry */
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
  isRetrying: boolean;
}

/**
 * Constantes pour la configuration
 */
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE_MS = 1000;

/**
 * Détecte si une erreur est liée au chargement de module
 */
function isModuleLoadError(error: Error): boolean {
  return (
    error.message.includes('Failed to fetch dynamically imported module') ||
    error.message.includes('Loading chunk') ||
    error.message.includes('ChunkLoadError') ||
    error.name === 'ChunkLoadError' ||
    error.name === 'TypeError'
  );
}

/**
 * ErrorBoundary spécialisé pour capturer les erreurs de chargement de modules dynamiques
 * Offre une meilleure UX avec retry automatique et options de récupération
 */
class LazyLoadErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LazyLoadErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Logger l'erreur pour le debugging
    if (process.env.NODE_ENV === 'development') {
      console.group('🔴 Erreur de chargement de module');
      console.error('Module:', this.props.moduleName || 'Inconnu');
      console.error('Erreur:', error);
      console.error('Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  componentWillUnmount() {
    // Nettoyer le timeout si le composant est démonté
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;

    if (retryCount >= MAX_RETRIES) {
      // Après plusieurs tentatives, recharger complètement la page
      this.handleFullReload();
      return;
    }

    this.setState({ isRetrying: true });

    // Appeler le callback personnalisé si fourni
    if (this.props.onRetry) {
      try {
        this.props.onRetry();
      } catch (error) {
        console.error('Error in onRetry callback:', error);
      }
    }

    // Attendre un peu avant de réessayer avec délai progressif
    const delay = RETRY_DELAY_BASE_MS * (retryCount + 1);
    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
        isRetrying: false,
      });
    }, delay);
  };

  handleFullReload = () => {
    // Vider le cache et recharger la page
    if ('caches' in window && 'serviceWorker' in navigator) {
      caches.keys()
        .then((names) => {
          return Promise.all(names.map((name) => caches.delete(name)));
        })
        .catch((error) => {
          console.error('Error clearing cache:', error);
        })
        .finally(() => {
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    });
  };

  render() {
    if (this.state.hasError) {
      const { error, retryCount, isRetrying } = this.state;
      const isModuleError = error ? isModuleLoadError(error) : false;

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <CardTitle>Erreur de chargement</CardTitle>
              </div>
              <CardDescription>
                {isModuleError
                  ? 'Impossible de charger le module demandé. Cela peut être dû à un problème de réseau ou de cache.'
                  : 'Une erreur s\'est produite lors du chargement de la page.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {this.props.moduleName && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-semibold">Module:</p>
                  <p className="text-muted-foreground">{this.props.moduleName}</p>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && error && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-semibold text-destructive">{error.name}</p>
                  <p className="mt-1 text-muted-foreground">{error.message}</p>
                  {this.state.errorInfo && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs">Stack trace</summary>
                      <pre className="mt-2 max-h-40 overflow-auto text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              {retryCount > 0 && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="text-muted-foreground">
                    Tentative {retryCount} sur {MAX_RETRIES}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Button 
                  onClick={this.handleRetry} 
                  disabled={isRetrying}
                  className="w-full"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Nouvelle tentative...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Réessayer
                    </>
                  )}
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={this.handleFullReload}
                    className="flex-1"
                  >
                    Recharger la page
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = '/')}
                    className="flex-1"
                  >
                    Retour à l'accueil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadErrorBoundary;

