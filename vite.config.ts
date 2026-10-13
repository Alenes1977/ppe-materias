import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const DEFAULT_API_PORT = '8181';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ command, mode, isPreview }) => {
  const localPreview = mode === 'local-preview';
  if (
    localPreview &&
    (command !== 'serve' || isPreview || process.env.NODE_ENV === 'production')
  ) {
    throw new Error(
      'local-preview solo está disponible con npm run dev:local; no se permite en producción ni en builds.',
    );
  }
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT?.trim() || DEFAULT_API_PORT;

  return {
    plugins: [react(), eslintPlugin()],
    define: {
      __LOCAL_PREVIEW__: JSON.stringify(localPreview),
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    server: {
      ...(localPreview ? { host: '127.0.0.1', strictPort: true } : {}),
      port: 5173,
      proxy: localPreview
        ? undefined
        : {
            '/api': `http://127.0.0.1:${apiPort}`,
            '/saml': `http://127.0.0.1:${apiPort}`,
            '/login/metadata': `http://127.0.0.1:${apiPort}`,
          },
    },
  };
});
