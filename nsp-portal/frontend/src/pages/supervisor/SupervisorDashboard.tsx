import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Dashboard } from '@mui/icons-material';

const SupervisorDashboard: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          Supervisor Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and evaluate your assigned NSPs
        </Typography>
      </Box>
      {/* Dashboard content will be implemented */}
    </Container>
  );
};

export default SupervisorDashboard;