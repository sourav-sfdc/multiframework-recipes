import type { RouteObject } from 'react-router';
import AppLayout from '@/appLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Hello from './pages/Hello';
import ReadData from './pages/ReadData';
import ModifyData from './pages/ModifyData';
import SalesforceAPIs from './pages/SalesforceAPIs';
import Authentication from './pages/Authentication';
import ErrorHandling from './pages/ErrorHandling';
import Styling from './pages/Styling';
import Routing, { RouteParametersPage, NestedRoutesPage } from './pages/Routing';
import Integration from './pages/Integration';
import Diagrams from './pages/Diagrams';
import KitchenSinkApp from './pages/KitchenSinkApp';
import { RouteParametersDetail } from './recipes/routing/RouteParameters';
import NestedRoutes, {
  NestedRoutesIndex,
  NestedRoutesDetail,
} from './recipes/routing/NestedRoutes';

export const routes: RouteObject[] = [
  // Full-screen route — deliberately outside AppLayout so no navbar or page
  // chrome renders. The kitchen-sink editor takes over the viewport.
  {
    path: '/jointjs-kitchsink-app',
    element: <KitchenSinkApp />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'hello',
        element: <Hello />,
        handle: { showInNavigation: true, label: 'Hello' },
      },
      {
        path: 'read-data',
        element: <ReadData />,
        handle: { showInNavigation: true, label: 'Read Data' },
      },
      {
        path: 'modify-data',
        element: <ModifyData />,
        handle: { showInNavigation: true, label: 'Modify Data' },
      },
      {
        path: 'salesforce-apis',
        element: <SalesforceAPIs />,
        handle: { showInNavigation: true, label: 'Salesforce APIs' },
      },
      {
        path: 'authentication',
        element: <Authentication />,
        handle: { showInNavigation: true, label: 'Authentication' },
      },
      {
        path: 'error-handling',
        element: <ErrorHandling />,
        handle: { showInNavigation: true, label: 'Error Handling' },
      },
      {
        path: 'styling',
        element: <Styling />,
        handle: { showInNavigation: true, label: 'Styling' },
      },
      {
        path: 'routing',
        element: <Routing />,
        handle: { showInNavigation: true, label: 'Routing' },
      },
      {
        path: 'route-parameters',
        element: <RouteParametersPage />,
        handle: { showInNavigation: true, label: 'Route Parameters' },
        children: [{ path: ':accountId', element: <RouteParametersDetail /> }],
      },
      {
        path: 'nested-routes',
        element: <NestedRoutesPage />,
        handle: { showInNavigation: true, label: 'Nested Routes' },
        children: [
          {
            element: <NestedRoutes />,
            children: [
              { index: true, element: <NestedRoutesIndex /> },
              { path: ':accountId', element: <NestedRoutesDetail /> },
            ],
          },
        ],
      },
      {
        path: 'integration',
        element: <Integration />,
        handle: { showInNavigation: true, label: 'Integration' },
      },
      {
        path: 'diagrams',
        element: <Diagrams />,
        handle: { showInNavigation: true, label: 'Diagrams' },
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];
