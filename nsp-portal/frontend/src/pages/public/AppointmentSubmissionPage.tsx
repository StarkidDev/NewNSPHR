import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Info,
  Person,
  School,
  Assignment,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { appointmentService } from '../../services/appointmentService';

const schema = yup.object({
  full_name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone_number: yup.string().required('Phone number is required').min(10, 'Phone number must be at least 10 digits'),
  nss_id: yup.string().required('NSS ID is required'),
  program: yup.string().required('Program is required'),
  service_year: yup.number().required('Service year is required').min(2020, 'Invalid service year').max(new Date().getFullYear() + 1, 'Invalid service year'),
  institution_attended: yup.string().required('Institution is required'),
  qualification: yup.string().required('Qualification is required'),
  course_of_study: yup.string().required('Course of study is required'),
  nss_appointment_letter: yup.mixed().required('NSS appointment letter is required'),
});

type FormData = {
  full_name: string;
  email: string;
  phone_number: string;
  nss_id: string;
  program: 'REGULAR' | 'TEACHERS' | 'HEALTH' | 'GRADUATE';
  service_year: number;
  institution_attended: string;
  qualification: string;
  course_of_study: string;
  nss_appointment_letter: FileList;
};

const AppointmentSubmissionPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionReference, setSubmissionReference] = useState('');
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      service_year: new Date().getFullYear(),
    },
  });

  const watchFile = watch('nss_appointment_letter');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'nss_appointment_letter' && value && value.length > 0) {
          formData.append(key, value[0]);
        } else if (key !== 'nss_appointment_letter') {
          formData.append(key, value.toString());
        }
      });

      const response = await appointmentService.submitAppointment(formData);
      
      setSubmitSuccess(true);
      setSubmissionReference(response.submission_reference);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'An error occurred while submitting your application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = [
    'Valid NSS appointment letter (PDF, JPG, or PNG format)',
    'Maximum file size: 10MB',
    'Accurate personal and academic information',
    'Valid email address for notifications',
    'Phone number for contact purposes',
  ];

  const steps = [
    'Fill out the application form completely',
    'Upload your NSS appointment letter',
    'Submit and receive confirmation email',
    'Wait for HR review (typically 3-5 business days)',
    'Receive approval notification with login credentials',
  ];

  if (submitSuccess) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom color="success.main">
            Application Submitted Successfully!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Reference Number: <strong>{submissionReference}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Your NSS appointment letter has been submitted for review. You will receive a confirmation 
            email shortly with your reference number.
          </Typography>
          <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong><br />
              1. Check your email for confirmation<br />
              2. Our HR team will review your application within 3-5 business days<br />
              3. You'll receive an email notification with the decision<br />
              4. If approved, you'll receive login credentials to access your portal
            </Typography>
          </Alert>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => {
                setSubmitSuccess(false);
                setSubmissionReference('');
              }}
            >
              Submit Another Application
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.href = '/check-status'}
            >
              Check Application Status
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom textAlign="center">
        NSP Appointment Submission
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" paragraph>
        Submit your NSS appointment letter to begin your National Service at GNPC
      </Typography>

      <Grid container spacing={4}>
        {/* Information Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Info color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Requirements
              </Typography>
              <List dense>
                {requirements.map((requirement, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={requirement} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assignment color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Process Steps
              </Typography>
              <List dense>
                {steps.map((step, index) => (
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
            </CardContent>
          </Card>
        </Grid>

        {/* Form Panel */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Personal Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  <Person color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="full_name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Full Name"
                          error={!!errors.full_name}
                          helperText={errors.full_name?.message}
                          placeholder="Enter your full name as on official documents"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
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
                          placeholder="your.email@example.com"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="phone_number"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Phone Number"
                          error={!!errors.phone_number}
                          helperText={errors.phone_number?.message}
                          placeholder="0XX XXX XXXX"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="nss_id"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="NSS ID"
                          error={!!errors.nss_id}
                          helperText={errors.nss_id?.message}
                          placeholder="Your NSS identification number"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="service_year"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Service Year"
                          type="number"
                          error={!!errors.service_year}
                          helperText={errors.service_year?.message}
                          inputProps={{ min: 2020, max: new Date().getFullYear() + 1 }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Program Information */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  <School color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Program & Academic Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="program"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.program}>
                          <InputLabel>NSS Program</InputLabel>
                          <Select {...field} label="NSS Program">
                            <MenuItem value="REGULAR">Regular National Service</MenuItem>
                            <MenuItem value="TEACHERS">Teachers National Service</MenuItem>
                            <MenuItem value="HEALTH">Health National Service</MenuItem>
                            <MenuItem value="GRADUATE">Graduate National Service</MenuItem>
                          </Select>
                          {errors.program && (
                            <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                              {errors.program.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Controller
                      name="institution_attended"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Institution Attended"
                          error={!!errors.institution_attended}
                          helperText={errors.institution_attended?.message}
                          placeholder="University/College name"
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="qualification"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Qualification"
                          error={!!errors.qualification}
                          helperText={errors.qualification?.message}
                          placeholder="e.g., Bachelor's Degree, HND, etc."
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="course_of_study"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Course of Study"
                          error={!!errors.course_of_study}
                          helperText={errors.course_of_study?.message}
                          placeholder="Your field of study"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Document Upload */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  <CloudUpload color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Document Upload
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Controller
                  name="nss_appointment_letter"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUpload />}
                        fullWidth
                        sx={{ 
                          height: 100, 
                          borderStyle: 'dashed',
                          bgcolor: watchFile && watchFile.length > 0 ? 'success.light' : 'grey.50',
                          color: watchFile && watchFile.length > 0 ? 'success.dark' : 'text.secondary',
                          '&:hover': {
                            bgcolor: watchFile && watchFile.length > 0 ? 'success.light' : 'grey.100',
                          },
                        }}
                      >
                        {watchFile && watchFile.length > 0 
                          ? `Selected: ${watchFile[0].name}` 
                          : 'Click to upload NSS Appointment Letter'
                        }
                        <input
                          {...field}
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => onChange(e.target.files)}
                        />
                      </Button>
                      {errors.nss_appointment_letter && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                          {errors.nss_appointment_letter.message}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Accepted formats: PDF, JPG, PNG (Max size: 10MB)
                      </Typography>
                    </Box>
                  )}
                />
              </Box>

              {/* Submit Button */}
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <Assignment />}
                  sx={{ minWidth: 200 }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppointmentSubmissionPage;