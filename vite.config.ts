import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const DEFAULT_API_PORT = '8181';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = env.PORT?.trim() || DEFAULT_API_PORT;

  return {
    plugins: [react(), eslintPlugin()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': `http://127.0.0.1:${apiPort}`,
        '/saml': `http://127.0.0.1:${apiPort}`,
        '/login/metadata': `http://127.0.0.1:${apiPort}`,
      },
    },
  };
});
