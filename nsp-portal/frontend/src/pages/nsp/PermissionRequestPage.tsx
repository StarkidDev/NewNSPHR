import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { EventNote } from '@mui/icons-material';

const PermissionRequestPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <EventNote sx={{ mr: 1, verticalAlign: 'middle' }} />
          Permission Requests
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit and manage your permission/off-duty requests
        </Typography>
      </Box>
      {/* Permission request form and list will be implemented */}
    </Container>
  );
};

export default PermissionRequestPage;