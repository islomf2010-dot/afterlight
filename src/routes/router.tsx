import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/app/AppShell';
import { AppProviders } from '@/app/AppProviders';
import { NotFound } from '@/routes/NotFound';
import { RouteFallback } from '@/app/RouteFallback';

/**
 * Route table.
 *
 * `createBrowserRouter` with a catch-all so unknown paths hit the real 404
 * component. Because the app is served as static files, `vite preview` (and any
 * static host) must rewrite unknown paths to index.html — see the README's
 * deployment note. Refreshing on any nested route works because of that
 * rewrite, not because of anything client-side.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFound />,
    // Rendered while the first lazy chunk streams, so the first paint is the
    // film's own visual language rather than a blank frame.
    HydrateFallback: RouteFallback,
    children: [
      {
        index: true,
        // Lazy: the film is by far the largest bundle and should not be in the
        // critical path of /archive or /credits.
        lazy: async () => {
          const { Home } = await import('@/routes/Home');
          return { Component: Home };
        },
      },
      {
        path: 'lab',
        lazy: async () => {
          const { Lab } = await import('@/routes/Lab');
          return { Component: Lab };
        },
        children: [
          {
            path: ':study',
            lazy: async () => {
              const { Lab } = await import('@/routes/Lab');
              return { Component: Lab };
            },
          },
        ],
      },
      {
        path: 'archive',
        lazy: async () => {
          const { Archive } = await import('@/routes/Archive');
          return { Component: Archive };
        },
      },
      {
        path: 'credits',
        lazy: async () => {
          const { Credits } = await import('@/routes/Credits');
          return { Component: Credits };
        },
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export const AppRouter = () => (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
