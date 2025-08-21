import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import chalk from 'chalk';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const requiredVars = ['VITE_CONTROL_ACCESS', 'VITE_PRODUCTION', 'VITE_BASEURL'];
  requiredVars.forEach((key) => {
    if (!env[key]) {
      throw new Error(chalk.red(`A variável de ambiente ${chalk.bold(key)} não está definida.`));
    }
  });

  return {
    plugins: [
      react(),
      svgr()
    ],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@actions': path.resolve(__dirname, './src/actions'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@routes': path.resolve(__dirname, './src/routes'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@pages': path.resolve(__dirname, './src/pages')
      },
    },
    build: {
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html')
        },
        output: {
          chunkFileNames: 'assets/chunks/[name]-[hash].js',
          entryFileNames: 'assets/entries/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0];
            }
          },
        },
      },
    },
    publicDir: 'public',
    server: {
      port: 7100
    }
  };
});
