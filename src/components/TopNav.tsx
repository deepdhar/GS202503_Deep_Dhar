// components/TopNav.tsx
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ReactComponent as Logo} from '../assets/logo.svg'

const TopNav = () => {
  return (
    <AppBar 
      position="static"
      sx={{ 
        width: '100vw',
        position: 'static',
        paddingRight: 2,
        paddingLeft: 2,
        transform: 'none !important',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          padding: '0 !important',
          minHeight: '64px !important',
        }}
      >
        {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Data Viewer
        </Typography> */}
        <Logo
          style={{ 
            height: '80px', 
            width: 'auto', 
            marginRight: '20px' 
          }} 
        />
        <Button color="inherit">Sign In</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopNav;