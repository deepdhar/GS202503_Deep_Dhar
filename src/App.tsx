import { Navigate, Outlet } from 'react-router-dom';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';
import './App.css'
import { useEffect } from 'react';
import { initializePlanningData } from './features/planning/planningSlice';
import { useAppDispatch, useAppSelector } from './app/store';
import { fetchStores } from './features/stores/storeSlice';
import { fetchSKUs } from './features/skus/skuSlice';

const App = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { items: stores, status: storesStatus } = useAppSelector((state) => state.stores);
  const { items: skus, status: skusStatus } = useAppSelector((state) => state.skus);

  const storesLoaded = storesStatus === 'succeeded' && stores.length > 0;
  const skusLoaded = skusStatus === 'succeeded' && skus.length > 0;

  useEffect(() => {
    if (storesLoaded && skusLoaded) {
      dispatch(initializePlanningData());
    }
  }, [dispatch, storesLoaded, skusLoaded]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchStores());
      dispatch(fetchSKUs());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vh' }}>
      <TopNav />
      <Sidebar />

      {/* Content Container */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          marginLeft: '240px',
          right: '45px',
          height: 'calc(100vh - 64px)',
          width: 'calc(100vw - 240px)',
          position: 'relative',
          p: 3,
          backgroundColor: 'background.paper'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default App