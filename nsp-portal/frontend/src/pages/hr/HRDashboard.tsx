import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Dashboard } from '@mui/icons-material';

const HRDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          HR Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage NSP appointments, permissions, and operations
        </Typography>
      </Box>
      {/* Dashboard content will be implemented */}
    </Container>
  );
};

export default HRDashboard;