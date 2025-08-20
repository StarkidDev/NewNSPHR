import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search,
  CheckCircle,
  Schedule,
  Cancel,
  Info,
  Email,
  CalendarToday,
  Assignment,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { checkStatus, clearStatusCheck, clearError } from '../../store/slices/appointmentSlice';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

type FormData = {
  email: string;
};

const StatusCheckPage: React.FC = () => {
  const dispatch = useDispatch();
  const { statusCheck, loading, error } = useSelector((state: RootState) => state.appointments);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    dispatch(clearError());
    dispatch(checkStatus(data.email) as any);
  };

  const handleClear = () => {
    dispatch(clearStatusCheck());
    dispatch(clearError());
    reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'DECLINED':
        return 'error';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'PENDING':
        return 'info';
      case 'REQUIRES_INFO':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle color="success" />;
      case 'DECLINED':
        return <Cancel color="error" />;
      case 'UNDER_REVIEW':
        return <Schedule color="warning" />;
      case 'PENDING':
        return <Schedule color="info" />;
      case 'REQUIRES_INFO':
        return <Info color="warning" />;
      default:
        return <Schedule />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNextSteps = (status: string) => {
    switch (status) {
      case 'PENDING':
        return [
          'Your application is in the review queue',
          'HR team will review within 3-5 business days',
          'You will receive an email notification with the decision',
        ];
      case 'UNDER_REVIEW':
        return [
          'Your application is currently being reviewed by HR',
          'Decision expected within 1-2 business days',
          'You will receive an email notification with the decision',
        ];
      case 'APPROVED':
        return [
          'Congratulations! Your application has been approved',
          'Check your email for login credentials',
          'Complete your profile setup in the NSP portal',
          'Wait for department assignment and supervisor allocation',
        ];
      case 'DECLINED':
        return [
          'Unfortunately, your application was not approved',
          'Check the review notes for specific reasons',
          'You may reapply in the next application cycle',
          'Contact HR for clarification if needed',
        ];
      case 'REQUIRES_INFO':
        return [
          'Additional information is required for your application',
          'Check the review notes for specific requirements',
          'Submit the required information promptly',
          'Your application will be re-reviewed once information is provided',
        ];
      default:
        return [];
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        Check Application Status
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
        Enter your email address to check the status of your NSP appointment application
      </Typography>

      <Paper sx={{ p: 4, mb: 4 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    placeholder="Enter the email used for your application"
                    disabled={loading}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
              >
                {loading ? 'Checking...' : 'Check Status'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {statusCheck && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Typography variant="h5" gutterBottom>
                  {statusCheck.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Reference: <strong>{statusCheck.submission_reference}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Program: {statusCheck.program_display}
                </Typography>
              </Box>
              <Chip
                icon={getStatusIcon(statusCheck.status)}
                label={statusCheck.status_display}
                color={getStatusColor(statusCheck.status) as any}
                variant="filled"
                size="large"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Submitted
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(statusCheck.created_at)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {statusCheck.reviewed_at && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Assignment sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Reviewed
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(statusCheck.reviewed_at)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {statusCheck.decision_date && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CheckCircle sx={{ mr: 1, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Decision Made
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(statusCheck.decision_date)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Next Steps
            </Typography>
            <List dense>
              {getNextSteps(statusCheck.status).map((step, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={step} 
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>

            {statusCheck.status === 'APPROVED' && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Congratulations!</strong> Your application has been approved. 
                  Check your email for login credentials to access your NSP portal.
                </Typography>
              </Alert>
            )}

            {statusCheck.status === 'DECLINED' && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  If you have questions about the decision, please contact the HR department 
                  at <strong>hr@gnpcghana.com</strong> or <strong>+233 (0) 302 666 000</strong>.
                </Typography>
              </Alert>
            )}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                startIcon={<Search />}
              >
                Check Another Application
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card sx={{ bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Info color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
            Important Information
          </Typography>
          <List dense>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Email color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Use the same email address you used when submitting your application"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Schedule color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Applications are typically reviewed within 3-5 business days"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ pl: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircle color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="You will receive email notifications for all status changes"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StatusCheckPage;