import { createRoot } from 'react-dom/client';
import { I18nProvider } from '@sehv-oss/i18n-react';
import { i18n } from './i18n';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <I18nProvider i18n={i18n}>
    <App />
  </I18nProvider>
);
