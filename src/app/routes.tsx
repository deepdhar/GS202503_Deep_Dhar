import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import StoreList from '../features/stores/StoreList';
import PlanningGrid from '../features/planning/PlanningGrid';
import GMChart from '../features/chart/GMChart';
import SKUList from '../features/skus/SKUList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'stores', element: <StoreList /> },
      { path: 'skus', element: <SKUList /> },
      { path: 'planning', element: <PlanningGrid /> },
      { path: 'chart', element: <GMChart /> }
    ]
  }
]);

export default router;