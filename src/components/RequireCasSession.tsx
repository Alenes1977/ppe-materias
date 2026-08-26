import { type ReactNode, useEffect, useState } from 'react';

/**
 * Cierre de la SPA cuando el backend no intercepta la navegación (Vite en :5173).
 *
 * En producción Express ya redirige al CAS antes de servir `index.html`.
 */
export const RequireCasSession = ({ children }: { children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    const resolve = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        if (!active) return;
        if (response.ok) {
          setReady(true);
          return;
        }
      } catch (error) {
        console.error('[cas] No se ha podido comprobar la sesión:', error);
      }
      if (!active) return;

      const returnTo = `${window.location.pathname}${window.location.search}`;
      const query =
        returnTo.startsWith('/') && !returnTo.startsWith('//')
          ? `?returnTo=${encodeURIComponent(returnTo)}`
          : '';
      window.location.replace(`/api/auth/cas/login${query}`);
    };

    void resolve();
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center text-sm text-gray-500">
        Comprobando sesión…
      </main>
    );
  }

  return children;
};
