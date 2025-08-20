import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Assignment,
  EventNote,
  Assessment,
  Message,
  ExitToApp,
  Home,
  Login,
  CheckCircle,
  PostAdd,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/slices/authSlice';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleProfileMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getNavigationItems = () => {
    if (!isAuthenticated || !user) {
      return [
        { text: 'Home', icon: <Home />, path: '/' },
        { text: 'Submit Application', icon: <PostAdd />, path: '/submit-appointment' },
        { text: 'Check Status', icon: <CheckCircle />, path: '/check-status' },
        { text: 'Login', icon: <Login />, path: '/login' },
      ];
    }

    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: `/${user.user_type.toLowerCase()}/dashboard` },
      { text: 'Messages', icon: <Message />, path: '/messages' },
    ];

    switch (user.user_type) {
      case 'NSP':
        return [
          ...baseItems,
          { text: 'Permission Requests', icon: <EventNote />, path: '/nsp/permissions' },
          { text: 'Monthly Reports', icon: <Assessment />, path: '/nsp/reports' },
          { text: 'Complaints', icon: <Assignment />, path: '/nsp/complaints' },
        ];
      case 'HR':
      case 'ADMIN':
        return [
          ...baseItems,
          { text: 'Appointments', icon: <Assignment />, path: '/hr/appointments' },
          { text: 'NSP Management', icon: <AccountCircle />, path: '/hr/nsps' },
          { text: 'Permission Reviews', icon: <EventNote />, path: '/hr/permissions' },
        ];
      case 'SUPERVISOR':
        return [
          ...baseItems,
          { text: 'Evaluations', icon: <Assessment />, path: '/supervisor/evaluations' },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" component="div">
          GNPC NSP Portal
        </Typography>
        {user && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {user.first_name} {user.last_name}
          </Typography>
        )}
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            GNPC NSP Portal
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {!isAuthenticated ? (
                <>
                  <Button color="inherit" onClick={() => navigate('/')}>
                    Home
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/submit-appointment')}>
                    Submit Application
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/check-status')}>
                    Check Status
                  </Button>
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{ ml: 1 }}
                  >
                    Login
                  </Button>
                </>
              ) : (
                <>
                  {navigationItems.slice(0, -1).map((item) => (
                    <Button
                      key={item.text}
                      color="inherit"
                      onClick={() => navigate(item.path)}
                      sx={{
                        bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                      }}
                    >
                      {item.text}
                    </Button>
                  ))}
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </Avatar>
                  </IconButton>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ExitToApp sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Navbar;