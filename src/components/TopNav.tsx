import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ReactComponent as Logo} from '../assets/logo.svg'
import { useAppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar 
      position="static"
      sx={{ 
        width: '100vw',
        position: 'static',
        paddingRight: 2,
        paddingLeft: 2,
        transform: 'none !important',
        backgroundColor: '#fefefe'
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          padding: '0 !important',
          minHeight: '64px !important',
        }}
      >
        
        <Logo
          style={{ 
            height: '80px', 
            width: 'auto', 
            marginRight: 'auto' ,
          }} 
        />
        <Typography variant="h3" component="div" sx={{ color:"#000", mr: 'auto', fontWeight: '600' }}>
          Data Viewer App
        </Typography>
        <Button 
          onClick={()=>handleLogOut()}
          style={{color: '#000', fontSize: 16, fontWeight: '600'}}>Log Out</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;