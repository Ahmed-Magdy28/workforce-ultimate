import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import AppProviders from './app/providers';
import './styles/globals.css';
import './app/i18n';

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <AppProviders>
         <App />
      </AppProviders>
   </StrictMode>,
);
