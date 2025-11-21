import React from 'react';
import {
  Box, Drawer, Toolbar, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider
} from '@mui/material';
import BlenderIcon from '@mui/icons-material/Blender'; // A fitting icon for ingredients
import { Link, useLocation } from 'react-router-dom';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/ingredients"
              selected={location.pathname.startsWith('/ingredients')}
            >
              <ListItemIcon>
                <BlenderIcon />
              </ListItemIcon>
              <ListItemText primary="Sastojci" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <ListItem disablePadding>
            <ListItemButton
                component={Link}
                to="/dishes"
                selected={location.pathname.startsWith('/dishes')}
            >
                <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
                <ListItemText primary="Jela" />
            </ListItemButton>
        </ListItem>
          <Divider />
          <ListItem disablePadding>
              <ListItemButton
                  component={Link}
                  to="/meals"
                  selected={location.pathname.startsWith('/meals')}
              >
                  <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
                  <ListItemText primary="Obroci" />
              </ListItemButton>
          </ListItem>
          <Divider />
        <ListItem disablePadding>
          <ListItemButton
              component={Link}
              to="/weekly-plan"
              selected={location.pathname.startsWith('/weekly-plan')}
          >
              <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
              <ListItemText primary="Tjedni plan" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
}
