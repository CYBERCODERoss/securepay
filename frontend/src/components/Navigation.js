import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  List, 
  ListItem,
  ListItemIcon, 
  ListItemText, 
  Box, 
  Divider,
  Tooltip,
  alpha,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  ReceiptLong as TransactionsIcon,
  Subscriptions as SubscriptionsIcon,
  ShoppingCart as ShopIcon,
  Security as SecurityIcon,
  Shield as FraudProtectionIcon,
  SettingsOutlined as SettingsIcon,
  CreditCard as BillingIcon,
  VerifiedUser as ComplianceIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  Book as DocsIcon,
  EventNote as BookDemoIcon,
  MailOutline as ContactIcon,
  Analytics as AnalyticsIcon,
  CachedOutlined as CacheIcon,
  MonetizationOn as BillingAnalyticsIcon
} from '@mui/icons-material';

// Enhanced navigation item with dark theme styling inspired by Blacksmith UI
const NavItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: '6px 8px',
  padding: '8px 12px',
  transition: 'all 0.2s ease',
  backgroundColor: active ? 
    alpha(theme.palette.primary.main, 0.15) : 
    'transparent',
  
  '&:hover': {
    backgroundColor: active ? 
      alpha(theme.palette.primary.main, 0.2) : 
      alpha(theme.palette.common.white, 0.05),
  },
  
  '& .MuiListItemIcon-root': {
    minWidth: 36,
    color: active ? 
      theme.palette.primary.main : 
      alpha(theme.palette.common.white, 0.7),
  },
  
  '& .MuiListItemText-primary': {
    fontWeight: active ? 600 : 500,
    fontSize: '0.875rem',
    color: active ? 
      theme.palette.primary.main : 
      theme.palette.text.primary,
    opacity: 1,
  }
}));

// Styled container for the entire navigation
const NavContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

// Styled section title
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: alpha(theme.palette.common.white, 0.5),
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  padding: theme.spacing(0, 2),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

// Status indicator component
const StatusIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginTop: 'auto',
  '& .dot': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
    marginRight: theme.spacing(1),
  },
  '& .text': {
    fontSize: '0.75rem',
    color: alpha(theme.palette.common.white, 0.7),
  }
}));

const Navigation = ({ compact = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Navigation sections with their items
  const sections = [
    {
      items: [
        { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, highlight: true },
      ]
    },
    {
      items: [
        { title: 'Migration Wizard', path: '/migration-wizard', icon: <AnalyticsIcon />, highlight: true },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { title: 'Analytics', path: '/analytics', icon: <AnalyticsIcon /> },
        { title: 'Cache', path: '/cache', icon: <CacheIcon /> },
      ]
    },
    {
      title: 'Payment Services',
      items: [
        { title: 'Payments', path: '/payments', icon: <PaymentIcon /> },
        { title: 'Transactions', path: '/transactions', icon: <TransactionsIcon /> },
        { title: 'Subscriptions', path: '/subscriptions', icon: <SubscriptionsIcon /> },
        { title: 'Shop', path: '/shop', icon: <ShopIcon /> },
      ]
    },
    {
      title: 'Security',
      items: [
        { title: 'Security', path: '/security', icon: <SecurityIcon /> },
        { title: 'Fraud Protection', path: '/fraud-protection', icon: <FraudProtectionIcon /> },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Usage & Billing', path: '/billing', icon: <BillingAnalyticsIcon /> },
        { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
      ]
    },
    {
      title: 'Resources',
      items: [
        { title: 'Docs', path: '/docs', icon: <DocsIcon /> },
        { title: 'Book a demo', path: '/book-demo', icon: <BookDemoIcon /> },
        { title: 'Contact support', path: '/contact', icon: <ContactIcon /> },
      ]
    }
  ];
  
  // Render a navigation section
  const renderSection = (section, index) => (
    <React.Fragment key={index}>
      {section.title && !compact && (
        <SectionTitle variant="overline">
          {section.title}
        </SectionTitle>
      )}
      
      <List sx={{ p: compact ? 1 : '0' }}>
        {section.items.map((item) => renderNavItem(item))}
      </List>
      
      {index < sections.length - 1 && section.title && <Divider sx={{ my: 1, opacity: 0.1 }} />}
    </React.Fragment>
  );
  
  // Render a navigation item
  const renderNavItem = (item) => {
    const isActive = currentPath === item.path;
    const navItem = (
      <NavItem
        button
        component={RouterLink}
        to={item.path}
        active={isActive ? 1 : 0}
        sx={{ 
          justifyContent: compact ? 'center' : 'flex-start',
          px: compact ? 1.5 : 2,
          backgroundColor: item.highlight && !isActive ? alpha('#1976d2', 0.05) : undefined,
        }}
      >
        <ListItemIcon sx={{ mr: compact ? 0 : 1.5 }}>
          {item.icon}
        </ListItemIcon>
        {!compact && <ListItemText primary={item.title} />}
      </NavItem>
    );
    
    // Wrap with tooltip if compact
    return compact ? (
      <Tooltip title={item.title} placement="right" key={item.path}>
        {navItem}
      </Tooltip>
    ) : (
      <Box key={item.path}>{navItem}</Box>
    );
  };
  
  // Render the logout button separately
  const renderLogout = () => {
    const navItem = (
      <NavItem
        button
        component={RouterLink}
        to="/logout"
        sx={{ 
          justifyContent: compact ? 'center' : 'flex-start',
          px: compact ? 1.5 : 2,
        }}
      >
        <ListItemIcon sx={{ mr: compact ? 0 : 1.5 }}>
          <LogoutIcon />
        </ListItemIcon>
        {!compact && <ListItemText primary="Logout" />}
      </NavItem>
    );
    
    return compact ? (
      <Tooltip title="Logout" placement="right" key="logout">
        {navItem}
      </Tooltip>
    ) : (
      <Box key="logout">{navItem}</Box>
    );
  };
  
  return (
    <NavContainer>
      <Box>
        {sections.map(renderSection)}
      </Box>
      <Box>
        <StatusIndicator>
          <Box className="dot" />
          <Box className="text">All systems operational</Box>
        </StatusIndicator>
        {renderLogout()}
      </Box>
    </NavContainer>
  );
};

export default Navigation; 