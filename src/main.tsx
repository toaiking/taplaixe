import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if ('caches' in window) {
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((k) => k !== 'gplx-600-v5')
              .map((k) => caches.delete(k))
          )
        )
        .catch(() => {});
    }

    navigator.serviceWorker
      .register('/sw.js?v=5', { updateViaCache: 'none' })
      .then((reg) => {
        reg.update().catch(() => {});
      })
      .catch(() => {
        // Ignore SW registration failure in unsupported environments
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
