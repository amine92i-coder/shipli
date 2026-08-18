import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LangProvider } from './i18n/LangContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Outside the router: the language survives navigation, and every route
        including the 404 renders in the visitor's chosen language. */}
    <LangProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LangProvider>
  </StrictMode>,
);
