import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink } from 'react-router-dom';
import {
  Store as StoreIcon,
  ListAlt as SKUIcon,
  GridOn as PlanningIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';

const Sidebar = () => {
  const navItems = [
    { text: 'Stores', path: '/stores', icon: <StoreIcon /> },
    { text: 'SKUs', path: '/skus', icon: <SKUIcon /> },
    { text: 'Planning', path: '/planning', icon: <PlanningIcon /> },
    { text: 'Chart', path: '/chart', icon: <ChartIcon /> }
  ];

  return (
    <nav>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                '&.active': {
                  backgroundColor: 'action.selected',
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText style={{color: '#000'}} primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </nav>
  );
};

export default Sidebar;