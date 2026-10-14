import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Self-hosted variable font + the four IBM Plex Mono weights used for technical
// labels. Bundled through Fontsource, so the build has zero runtime font
// requests and works offline.
import '@fontsource-variable/space-grotesk/index.css';
import '@fontsource/ibm-plex-mono/300.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import 'lenis/dist/lenis.css';

import './styles/global.css';

import { AppRouter } from './routes/router';

const container = document.getElementById('root');

if (!container) {
  throw new Error('AFTERLIGHT: #root is missing from the document.');
}

createRoot(container).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
