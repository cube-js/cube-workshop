import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { LogoutOutlined, PersonOutlined } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'global_admin':
        return 'error';
      case 'regional_director':
        return 'warning';
      case 'sales_rep':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'global_admin':
        return 'Admin';
      case 'regional_director':
        return 'Director';
      case 'sales_rep':
        return 'Sales Rep';
      default:
        return role;
    }
  };

  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
          <Typography variant="h6" component="div">
            TPC-H Analytics
          </Typography>
        </Box>
        
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <PersonOutlined fontSize="small" />
              <Typography variant="body2">
                {user.name}
              </Typography>
              <Chip 
                label={getRoleLabel(user.role)}
                size="small"
                color={getRoleColor(user.role)}
                variant="outlined"
                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
              />
            </Box>
            
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutOutlined />}
              size="small"
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;