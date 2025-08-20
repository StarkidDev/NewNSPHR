import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Assessment } from '@mui/icons-material';

const EvaluationPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Performance Evaluations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Evaluate and provide feedback on NSP performance
        </Typography>
      </Box>
      {/* Performance evaluation forms will be implemented */}
    </Container>
  );
};

export default EvaluationPage;