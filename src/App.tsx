import { Outlet } from 'react-router-dom';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';

const App = () => {
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
            height: 'calc(100vh - 64px)', // Account for TopNav height
            width: 'calc(100vw - 240px)', // Proper width calculation
            position: 'relative',
            p: 3,
            backgroundColor: 'background.paper'
          }}
        >
          <Outlet />
        </Box>
    </Box>

  );
};

export default App;