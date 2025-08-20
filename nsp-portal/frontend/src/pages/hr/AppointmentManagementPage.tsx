import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Assignment } from '@mui/icons-material';

const AppointmentManagementPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Appointment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and process NSP appointment submissions
        </Typography>
      </Box>
      {/* Appointment management interface will be implemented */}
    </Container>
  );
};

export default AppointmentManagementPage;