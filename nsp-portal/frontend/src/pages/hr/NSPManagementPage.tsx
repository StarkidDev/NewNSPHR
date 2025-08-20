import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { People } from '@mui/icons-material';

const NSPManagementPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <People sx={{ mr: 1, verticalAlign: 'middle' }} />
          NSP Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage National Service Personnel profiles and assignments
        </Typography>
      </Box>
      {/* NSP management interface will be implemented */}
    </Container>
  );
};

export default NSPManagementPage;