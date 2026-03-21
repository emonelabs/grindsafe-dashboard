import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { AdminView } from './views/AdminView';
import { PlayerView } from './components/PlayerView';
import MessagesView from './views/MessagesView';
import { LoginView } from './views/LoginView';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter(
  [
    {
    path: '/login',
    Component: LoginView,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedEmails={['joao@emonelabs.com']}>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requireRole="admin" allowedEmails={['joao@emonelabs.com']}>
            <AdminView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'player',
        element: (
          <ProtectedRoute requireRole="player" allowedEmails={['joao@emonelabs.com']}>
            <PlayerView />
          </ProtectedRoute>
        ),
      },
      {
        path: 'messages',
        Component: MessagesView,
      },
    ],
  },
],
{ basename: '/' });