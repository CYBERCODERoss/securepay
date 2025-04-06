import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

/**
 * A simple placeholder page for sections that aren't fully implemented yet
 */
const PlaceholderPage = ({ title = 'Page Coming Soon' }) => {
  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom 
        fontWeight="bold"
        sx={{ mb: 4 }}
      >
        {title}
      </Typography>

      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid #eaeaea',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              This section is under development
            </Typography>
            <Typography variant="body1" color="textSecondary">
              We're working on implementing the {title.toLowerCase()} functionality. 
              This feature will be available in the next update.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Placeholder content blocks */}
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: `rgba(25, 118, 210, 0.0${item})`,
                  border: '1px dashed rgba(25, 118, 210, 0.3)',
                }}
              >
                <Typography variant="h6" align="center" color="primary">
                  {title} Feature {item}
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary" sx={{ mt: 1 }}>
                  Coming soon
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PlaceholderPage; 