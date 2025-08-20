import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { EventNote } from '@mui/icons-material';

const PermissionReviewPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <EventNote sx={{ mr: 1, verticalAlign: 'middle' }} />
          Permission Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve NSP permission requests
        </Typography>
      </Box>
      {/* Permission review interface will be implemented */}
    </Container>
  );
};

export default PermissionReviewPage;