import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              GNPC NSP Portal
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Streamlining National Service Personnel management at Ghana National Petroleum Corporation.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                GNPC Towers, Tetteh Quarshie Interchange, Accra
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                +233 (0) 302 666 000
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                hr@gnpcghana.com
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
              Home
            </Link>
            <Link href="/submit-appointment" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
              Submit Application
            </Link>
            <Link href="/check-status" color="inherit" sx={{ display: 'block', mb: 1, textDecoration: 'none' }}>
              Check Status
            </Link>
            <Link href="/login" color="inherit" sx={{ display: 'block', textDecoration: 'none' }}>
              Login
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Ghana National Petroleum Corporation. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Developed for efficient NSP management and enhanced service delivery.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;