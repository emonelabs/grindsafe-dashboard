import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { AdminView } from './views/AdminView';
import { PlayerView } from './components/PlayerView';
import MessagesView from './views/MessagesView';
import { LoginView } from './views/LoginView';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginView,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
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
        path: 'messages',
        Component: MessagesView,
      },
    ],
  },
]);