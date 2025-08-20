import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PostAdd,
  CheckCircle,
  Login,
  Speed,
  Security,
  CloudUpload,
  Notifications,
  Assignment,
  EventNote,
  Assessment,
  Message,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <PostAdd color="primary" sx={{ fontSize: 40 }} />,
      title: 'Digital Appointment Submission',
      description: 'Submit your NSS appointment letter online without prior registration.',
      action: 'Submit Now',
      path: '/submit-appointment',
    },
    {
      icon: <CheckCircle color="primary" sx={{ fontSize: 40 }} />,
      title: 'Real-time Status Tracking',
      description: 'Check your application status instantly using your email address.',
      action: 'Check Status',
      path: '/check-status',
    },
    {
      icon: <Login color="primary" sx={{ fontSize: 40 }} />,
      title: 'Secure Portal Access',
      description: 'Access your personalized dashboard after approval.',
      action: 'Login',
      path: '/login',
    },
  ];

  const benefits = [
    {
      icon: <Speed />,
      title: 'Faster Processing',
      description: 'Streamlined digital workflow reduces processing time significantly.',
    },
    {
      icon: <Security />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security ensures your data is protected.',
    },
    {
      icon: <CloudUpload />,
      title: 'Paperless System',
      description: 'Environmentally friendly digital document management.',
    },
    {
      icon: <Notifications />,
      title: 'Automated Notifications',
      description: 'Get instant email updates on your application status.',
    },
  ];

  const portalFeatures = [
    { icon: <Assignment />, text: 'Digital permission requests' },
    { icon: <EventNote />, text: 'Monthly report submissions' },
    { icon: <Assessment />, text: 'Performance evaluations' },
    { icon: <Message />, text: 'Internal communications' },
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          borderRadius: 3,
          color: 'white',
          mb: 6,
        }}
      >
        <Typography
          variant={isMobile ? 'h3' : 'h2'}
          component="h1"
          gutterBottom
          fontWeight="bold"
        >
          GNPC NSP Portal
        </Typography>
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          component="h2"
          gutterBottom
          sx={{ opacity: 0.9, mb: 4 }}
        >
          Digital Platform for National Service Personnel Management
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 4, opacity: 0.8 }}>
          Streamlined, transparent, and efficient management of NSP appointments, permissions, 
          and communications at Ghana National Petroleum Corporation.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/submit-appointment')}
            startIcon={<PostAdd />}
          >
            Submit Application
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/check-status')}
            startIcon={<CheckCircle />}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Check Status
          </Button>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Get Started
        </Typography>
        <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
          Choose your next step to begin your NSP journey with GNPC
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(feature.path)}
                    fullWidth
                    sx={{ mx: 2 }}
                  >
                    {feature.action}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Benefits Section */}
      <Paper sx={{ p: 4, mb: 6, bgcolor: 'grey.50' }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Why Choose Our Digital Platform?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  {benefit.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Portal Features */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Comprehensive NSP Management
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Our platform provides a complete solution for managing your National Service experience 
            at GNPC, from initial application to service completion.
          </Typography>
          <List>
            {portalFeatures.map((feature, index) => (
              <ListItem key={index} sx={{ pl: 0 }}>
                <ListItemIcon>
                  {feature.icon}
                </ListItemIcon>
                <ListItemText primary={feature.text} />
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 300,
              bgcolor: 'primary.light',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h6" textAlign="center">
              Digital Workflow Visualization
              <br />
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                Streamlined process from application to completion
              </Typography>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Call to Action */}
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'secondary.main',
          color: 'white',
          mb: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Ready to Begin Your NSP Journey?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Join the digital transformation of NSP management at GNPC
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/submit-appointment')}
          startIcon={<PostAdd />}
        >
          Submit Your Application Today
        </Button>
      </Paper>
    </Container>
  );
};

export default HomePage;