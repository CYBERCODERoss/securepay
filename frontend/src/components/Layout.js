import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Container, 
  useMediaQuery, 
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Badge
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ChevronLeft as ChevronLeftIcon,
  CreditCard as CreditCardIcon,
  ExitToApp as LogoutIcon,
  Store as StoreIcon,
  Security as SecurityIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import useAuth from '../hooks/useAuth';
import Logo from './Logo';

const drawerWidth = 260;

// Styled components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && !isMobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, isMobile }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      backgroundColor: theme.palette.background.default,
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
      border: 'none',
      position: 'relative',
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
  ...(!open && !isMobile && {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    '& .MuiDrawer-paper': {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7),
      backgroundColor: theme.palette.background.default,
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
      border: 'none',
    },
  }),
}));

const StyledMenuItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.8, 1.5),
  padding: theme.spacing(0.8, 2),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  ...(active && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
    
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: theme.palette.common.white,
      fontWeight: 600,
    },
  }),
  
  ...(!active && {
    '&:hover': {
      backgroundColor: theme.palette.primary.light + '20',
      transform: 'translateX(5px)',
      
      '& .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
      
      '& .MuiListItemText-primary': {
        color: theme.palette.primary.main,
      },
    },
  }),
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => !['open', 'isMobile'].includes(prop),
})(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  ...(open && !isMobile && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

  // Menu items data
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/dashboard/payments' },
    { text: 'Transactions', icon: <ReceiptIcon />, path: '/dashboard/transactions' },
    { text: 'Shop', icon: <StoreIcon />, path: '/shop' },
    { text: 'Subscriptions', icon: <CreditCardIcon />, path: '/dashboard/subscriptions' },
    { text: 'Security', icon: <SecurityIcon />, path: '/dashboard/security' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
    { text: 'Fraud Protection', icon: <SecurityIcon />, path: '/dashboard/fraud-protection' },
  ];

  // Handle responsive drawer
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Check if current path matches menu item path
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={open} isMobile={isMobile}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            <Logo variant="horizontal" />
          </Box>
          
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
            <Logo variant="icon" />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" sx={{ mr: 1 }}>
              <NotificationBadge badgeContent={3} color="error">
                <NotificationsIcon />
              </NotificationBadge>
            </IconButton>
            
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                  fontWeight: 600,
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  }
                }
              }}
            >
              <MenuItem component={Link} to="/dashboard/profile" onClick={handleProfileMenuClose}>Profile</MenuItem>
              <MenuItem component={Link} to="/dashboard/settings" onClick={handleProfileMenuClose}>Account Settings</MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleLogout} 
                sx={{ color: theme.palette.error.main }}
              >
                <ListItemIcon sx={{ color: theme.palette.error.main }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Drawer / Sidebar */}
      <StyledDrawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        isMobile={isMobile}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Logo variant={open ? "horizontal" : "icon"} />
          </Box>
          {isMobile && (
            <IconButton onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          )}
        </Box>
        
        <Divider sx={{ mx: 2, my: 1 }} />
        
        <List sx={{ pt: 1 }}>
          {menuItems.map((item, index) => {
            const isActive = isPathActive(item.path);
            return (
              <StyledMenuItem
                key={item.text}
                component={Link}
                to={item.path}
                active={isActive ? 1 : 0}
                sx={{
                  display: !open && !isMobile ? 'flex' : undefined,
                  justifyContent: !open && !isMobile ? 'center' : undefined,
                  px: !open && !isMobile ? 0 : undefined,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.main' : 'primary.light20',
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'white' : 'text.secondary',
                    minWidth: !open && !isMobile ? 0 : 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {(open || isMobile) && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem',
                      color: isActive ? 'white' : 'inherit',
                    }} 
                  />
                )}
              </StyledMenuItem>
            );
          })}
        </List>
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ p: 2 }}>
          <Divider sx={{ my: 1 }} />
          <StyledMenuItem
            component="button"
            onClick={handleLogout}
            sx={{
              width: '100%',
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: !open && !isMobile ? 'flex' : undefined,
              justifyContent: !open && !isMobile ? 'center' : undefined,
              px: !open && !isMobile ? 0 : undefined,
            }}
          >
            <ListItemIcon sx={{ 
              color: 'text.secondary',
              minWidth: !open && !isMobile ? 0 : 40,
            }}>
              <LogoutIcon />
            </ListItemIcon>
            {(open || isMobile) && (
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                  fontSize: '0.95rem',
                }} 
              />
            )}
          </StyledMenuItem>
        </Box>
      </StyledDrawer>

      {/* Main content */}
      <MainContent open={open} isMobile={isMobile}>
        <Toolbar /> {/* Spacer to push content below AppBar */}
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 }, mt: 2 }}>
          <Outlet />
        </Container>
      </MainContent>
    </Box>
  );
};

export default Layout;