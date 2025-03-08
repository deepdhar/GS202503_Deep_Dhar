import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import StoreList from "../features/stores/StoreList";
import PlanningGrid from "../features/planning/PlanningGrid";
import GMChart from "../features/chart/GMChart";
import SKUList from "../features/skus/SKUList";
import Login from "../screens/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>;
  }

  return children;
};


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "stores",
        element: <StoreList />,
      },
      { 
        path: "skus", 
        element: <ProtectedRoute><SKUList /> </ProtectedRoute>
      },
      { 
        path: "planning", 
        element: <ProtectedRoute><PlanningGrid /> </ProtectedRoute>
      },
      { 
        path: "chart", 
        element: <ProtectedRoute><GMChart /> </ProtectedRoute>
      },
      {
        index: true,
        element: <ProtectedRoute><StoreList /></ProtectedRoute>
      },
    ],
  },
]);

export default router;
