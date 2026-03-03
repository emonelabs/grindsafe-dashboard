import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { AdminView } from './views/AdminView';
import { PlayerView } from './components/PlayerView';
import { SessionsView } from './components/SessionsView';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        Component: AdminView,
      },
      {
        path: 'player',
        Component: PlayerView,
      },
      {
        path: 'player/sessions',
        Component: SessionsView,
      },
    ],
  },
]);