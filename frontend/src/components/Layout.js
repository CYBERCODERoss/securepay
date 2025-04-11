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
  Badge,
  Typography,
  Button,
  Stack,
  Chip,
  Tab,
  Tabs,
  ButtonGroup
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
  Menu as MenuIcon,
  CalendarToday as CalendarIcon,
  Tune as TuneIcon,
  FilterList as FilterIcon,
  ViewDay as ViewDayIcon,
  ViewModule as ViewModuleIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import useAuth from '../hooks/useAuth';
import Logo from './Logo';
import Navigation from './Navigation';

const drawerWidth = 240;

// Styled components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  color: theme.palette.text.primary,
  boxShadow: 'none',
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
  '& .MuiDrawer-paper': {
    border: 'none',
    boxShadow: 'none',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    ...(isMobile && {
      width: drawerWidth,
    }),
    ...(!open && !isMobile && {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
    }),
  },
}));

const MainContent = styled(Box, {
  shouldForwardProp: (prop) => !['open', 'isMobile'].includes(prop),
})(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  padding: 0,
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

const PageHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.5rem',
  color: theme.palette.text.primary,
}));

const FilterButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  color: theme.palette.text.primary,
  textTransform: 'none',
  borderRadius: 6,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(0.75, 2),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  }
}));

const ViewToggleButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  color: theme.palette.text.primary,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  }
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 'none',
}));

const PeriodTab = styled(Tab)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.875rem',
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  '&.Mui-selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  }
}));

const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [periodValue, setPeriodValue] = useState(0);
  const [viewType, setViewType] = useState('table');

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

  const handlePeriodChange = (event, newValue) => {
    setPeriodValue(newValue);
  };

  const handleViewChange = (type) => {
    setViewType(type);
  };

  // Get current page title based on location
  const getPageTitle = () => {
    const path = location.pathname.split('/').filter(x => x)[0] || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <StyledAppBar position="fixed" open={open} isMobile={isMobile}>
        <Toolbar sx={{ px: 2 }}>
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
          
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton sx={{ color: 'text.secondary' }}>
              <SearchIcon />
            </IconButton>
            
            <IconButton color="inherit">
              <Badge 
                badgeContent={3} 
                color="error" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    top: 4, 
                    right: 4,
                    width: 6,
                    height: 6,
                    minWidth: 6,
                    padding: 0
                  } 
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.dark,
                  width: 32,
                  height: 32,
                  fontWeight: 600,
                  fontSize: '0.875rem'
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
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
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
                      borderLeft: '1px solid',
                      borderTop: '1px solid',
                      borderColor: 'divider',
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
          </Stack>
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
        
        <Divider sx={{ opacity: 0.1 }} />
        
        <Navigation compact={!open && !isMobile} />
      </StyledDrawer>

      {/* Main content */}
      <MainContent open={open} isMobile={isMobile}>
        <Toolbar /> {/* Spacer to push content below AppBar */}
        
        {/* Page header */}
        <PageHeader>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <PageTitle>{getPageTitle()}</PageTitle>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterButton startIcon={<DateRangeIcon />} endIcon={<FilterIcon />}>
                Apr 1, 2025 - Apr 11, 2025
              </FilterButton>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs 
              value={periodValue} 
              onChange={handlePeriodChange}
              sx={{ 
                minHeight: 'auto',
                '& .MuiTabs-indicator': { 
                  height: 3,
                  borderRadius: '3px 3px 0 0' 
                }
              }}
            >
              <PeriodTab label="MTD" />
              <PeriodTab label="7D" />
              <PeriodTab label="30D" />
              <PeriodTab label="3M" />
              <PeriodTab label="6M" />
              <PeriodTab label="12M" />
            </Tabs>
            
            <ButtonGroup variant="outlined" size="small" sx={{ '& .MuiButton-root': { borderColor: alpha(theme.palette.divider, 0.2) } }}>
              <Button 
                variant={viewType === 'chart' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('chart')}
              >
                Chart
              </Button>
              <Button 
                variant={viewType === 'table' ? 'contained' : 'outlined'}
                onClick={() => handleViewChange('table')}
              >
                Table
              </Button>
            </ButtonGroup>
          </Box>
        </PageHeader>
        
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContent>
    </Box>
  );
};

export default Layout;