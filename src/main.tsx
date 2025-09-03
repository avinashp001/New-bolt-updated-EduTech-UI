import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import { router } from './router';
import './index.css';
import 'leaflet/dist/leaflet.css';
import 'katex/dist/katex.min.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <ThemeProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
            </NotificationProvider>
          </ThemeProvider>
        </ClerkProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
