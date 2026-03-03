import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { AdminView } from './views/AdminView';
import { TeamsView } from './views/TeamsView';
import { OrganizationView } from './views/OrganizationView';
import { SplitsView } from './views/SplitsView';
import { WalletsView } from './views/WalletsView';
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
        path: 'admin/teams',
        Component: TeamsView,
      },
      {
        path: 'admin/organization',
        Component: OrganizationView,
      },
      {
        path: 'admin/splits',
        Component: SplitsView,
      },
      {
        path: 'admin/wallets',
        Component: WalletsView,
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