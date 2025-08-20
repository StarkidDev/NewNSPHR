import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Assessment } from '@mui/icons-material';

const MonthlyReportPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Monthly Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit and track your monthly activity reports
        </Typography>
      </Box>
      {/* Monthly report form and list will be implemented */}
    </Container>
  );
};

export default MonthlyReportPage;