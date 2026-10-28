import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n';
import { PantryProvider } from './hooks/usePantry';
import { CalculatorProvider } from './hooks/usePastaCalculator';
import './index.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <I18nProvider>
      <PantryProvider>
        <CalculatorProvider>
          <App />
        </CalculatorProvider>
      </PantryProvider>
    </I18nProvider>
  </StrictMode>,
);

// Service worker only in production builds — avoids stale caches during `npm run dev`.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((err: unknown) => {
      console.error('Service worker registration failed', err);
    });
  });
}
