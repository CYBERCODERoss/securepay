import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  TextField, 
  InputAdornment, 
  IconButton, 
  Tabs,
  Tab,
  Chip,
  Divider,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Share as ShareIcon,
  ShoppingCart as CartIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// Mock data for products
const mockProducts = [
  {
    id: 'prod_1',
    name: 'Premium Payment Gateway',
    description: 'Advanced payment processing solution with lower transaction fees',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    category: 'Services',
    status: 'Active'
  },
  {
    id: 'prod_2',
    name: 'Invoicing Add-on',
    description: 'Create and manage professional invoices with automated reminders',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1589561253898-768105ca91a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    category: 'Add-ons',
    status: 'Active'
  },
  {
    id: 'prod_3',
    name: 'Subscription Manager',
    description: 'Manage recurring billing and subscriptions with ease',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1565371767810-ef913291533d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    category: 'Add-ons',
    status: 'Active'
  },
  {
    id: 'prod_4',
    name: 'SecurePay Terminal',
    description: 'Hardware payment terminal for in-person transactions',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    category: 'Hardware',
    status: 'Active'
  },
  {
    id: 'prod_5',
    name: 'Custom Payment Page',
    description: 'Branded payment pages to match your company identity',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1565371767810-ef913291533d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    category: 'Services',
    status: 'Active'
  },
  {
    id: 'prod_6',
    name: 'Fraud Protection Plus',
    description: 'Enhanced security features for high-risk transactions',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    category: 'Services',
    status: 'Active'
  },
];

// Shop catalog categories
const categories = ['All', 'Services', 'Add-ons', 'Hardware'];

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSort = (sortKey) => {
    setSortBy(sortKey);
    handleSortClose();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter products based on search term and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price_low') {
      return a.price - b.price;
    } else if (sortBy === 'price_high') {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Shop Catalog
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{
              borderRadius: '8px',
              boxShadow: 'none',
            }}
          >
            Add Product
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<ShareIcon />}
            sx={{
              borderRadius: '8px',
            }}
          >
            Share Catalog
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <TextField
              fullWidth
              placeholder="Search products..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ 
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth variant="outlined" sx={{ backgroundColor: 'white' }}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  sx={{ 
                    borderRadius: '8px',
                  }}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                onClick={handleSortClick}
                sx={{ 
                  minWidth: isTablet ? '50px' : '120px',
                  borderRadius: '8px',
                }}
                startIcon={<FilterIcon />}
              >
                {!isTablet && 'Sort'}
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
              >
                <MenuItem onClick={() => handleSort('name')} selected={sortBy === 'name'}>
                  Name
                </MenuItem>
                <MenuItem onClick={() => handleSort('price_low')} selected={sortBy === 'price_low'}>
                  Price: Low to High
                </MenuItem>
                <MenuItem onClick={() => handleSort('price_high')} selected={sortBy === 'price_high'}>
                  Price: High to Low
                </MenuItem>
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="All Products" />
          <Tab label="My Products" />
          <Tab label="Draft" />
        </Tabs>
      </Box>
      
      {sortedProducts.length > 0 ? (
        <Grid container spacing={3}>
          {sortedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: '12px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }
              }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.category} 
                      size="small"
                      color={
                        product.category === 'Services' ? 'primary' :
                        product.category === 'Add-ons' ? 'success' : 'secondary'
                      }
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<CartIcon />}
                    color="primary"
                    sx={{ ml: 'auto' }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px', 
          border: '1px dashed #ccc',
          borderRadius: '8px',
          backgroundColor: 'rgba(0,0,0,0.02)'
        }}>
          <Typography variant="body1" color="text.secondary">
            No products found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Shop; 