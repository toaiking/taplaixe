import { execSync } from 'node:child_process';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function resolveGitCommit(): string {
  const vercelSha = process.env.VERCEL_GIT_COMMIT_SHA;
  if (vercelSha && vercelSha.trim().length >= 7) {
    return vercelSha.trim().slice(0, 7);
  }
  try {
    const hash = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (hash) return hash;
  } catch {
    // Fallback if git is unavailable
  }
  return 'dev';
}

const APP_COMMIT = resolveGitCommit();
const APP_BUILD_TIME = new Date().toISOString();

function emitVersionPlugin(): Plugin {
  const payload = JSON.stringify({
    commit: APP_COMMIT,
    builtAt: APP_BUILD_TIME,
  });

  return {
    name: 'emit-version-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: payload,
      });
    },
    configureServer(server) {
      server.middlewares.use('/version.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.end(payload);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), emitVersionPlugin()],
  define: {
    __APP_COMMIT__: JSON.stringify(APP_COMMIT),
    __APP_BUILD_TIME__: JSON.stringify(APP_BUILD_TIME),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand'],
          motion: ['framer-motion'],
          icons: ['lucide-react'],
          questions: ['./src/data/questions.json'],
        },
      },
    },
  },
});
