import { Outlet } from 'react-router-dom';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';

const App = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vh' }}>
      <TopNav />
       <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', backgroundColor: '#ffffff', maxWidth: 200 }}>
        <Sidebar />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflow: 'auto',
            marginLeft: '240px'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default App;