import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  EventNote,
  Add,
  Visibility,
  CheckCircle,
  Schedule,
  Cancel,
  CloudUpload,
  Edit,
  Warning,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const schema = yup.object({
  permission_type: yup.string().required('Permission type is required'),
  start_date: yup.date().required('Start date is required'),
  end_date: yup.date().required('End date is required').min(yup.ref('start_date'), 'End date must be after start date'),
  reason: yup.string().required('Reason is required').min(10, 'Please provide a detailed reason'),
  contact_phone: yup.string().required('Contact phone is required'),
  contact_email: yup.string().email('Invalid email').required('Contact email is required'),
  residential_address: yup.string().required('Residential address is required'),
});

type FormData = {
  permission_type: string;
  start_date: Date | null;
  end_date: Date | null;
  reason: string;
  contact_phone: string;
  contact_email: string;
  residential_address: string;
  supporting_document?: FileList;
};

const PermissionRequestPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const watchFile = watch('supporting_document');

  // Mock data for existing requests
  const [requests] = useState([
    {
      id: 1,
      permission_type: 'SICK_LEAVE',
      permission_type_display: 'Sick Leave',
      start_date: '2024-01-20',
      end_date: '2024-01-22',
      days_requested: 3,
      days_granted: 3,
      reason: 'Medical treatment for fever and flu symptoms',
      status: 'APPROVED',
      status_display: 'Approved',
      reference_number: 'PERM/2024/0001',
      created_at: '2024-01-18T10:30:00Z',
      supervisor_endorsed: true,
      supervisor_comments: 'Approved for medical reasons',
      hr_comments: 'Approved as requested',
    },
    {
      id: 2,
      permission_type: 'PERSONAL_LEAVE',
      permission_type_display: 'Personal Leave',
      start_date: '2024-02-05',
      end_date: '2024-02-05',
      days_requested: 1,
      reason: 'Attend family wedding ceremony',
      status: 'PENDING',
      status_display: 'Pending Review',
      reference_number: 'PERM/2024/0002',
      created_at: '2024-02-01T14:20:00Z',
      supervisor_endorsed: false,
    },
  ]);

  const calculateDays = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // In real app, submit to API
      console.log('Submitting permission request:', data);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      reset();
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'SUPERVISOR_APPROVED': return 'info';
      case 'DECLINED': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle fontSize="small" />;
      case 'DECLINED': return <Cancel fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <EventNote sx={{ mr: 1, verticalAlign: 'middle' }} />
            Permission Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit and manage your permission/off-duty requests using the official GNPC form
          </Typography>
        </Box>

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSubmitSuccess(false)}>
            Permission request submitted successfully! Reference number will be provided via email.
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel Request' : 'New Permission Request'}
          </Button>
        </Box>

        {/* Permission Request Form */}
        {showForm && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Official GNPC Permission/Off-Duty Request Form
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Complete all required fields. Your supervisor will be notified automatically.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  {/* Permission Type */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="permission_type"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={!!errors.permission_type}>
                          <InputLabel>Permission Type</InputLabel>
                          <Select {...field} label="Permission Type">
                            <MenuItem value="SICK_LEAVE">Sick Leave</MenuItem>
                            <MenuItem value="EMERGENCY_LEAVE">Emergency Leave</MenuItem>
                            <MenuItem value="PERSONAL_LEAVE">Personal Leave</MenuItem>
                            <MenuItem value="MEDICAL_APPOINTMENT">Medical Appointment</MenuItem>
                            <MenuItem value="FAMILY_EMERGENCY">Family Emergency</MenuItem>
                            <MenuItem value="ACADEMIC_RELATED">Academic Related</MenuItem>
                            <MenuItem value="OFFICIAL_DUTY">Official Duty</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                          </Select>
                          {errors.permission_type && (
                            <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                              {errors.permission_type.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>

                  {/* Days Calculation Display */}
                  {startDate && endDate && (
                    <Grid item xs={12} md={6}>
                      <Alert severity="info">
                        <Typography variant="body2">
                          <strong>Days Requested: {calculateDays()}</strong>
                        </Typography>
                      </Alert>
                    </Grid>
                  )}

                  {/* Start Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="start_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="Start Date"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.start_date,
                              helperText: errors.start_date?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* End Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="end_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          label="End Date"
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.end_date,
                              helperText: errors.end_date?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Reason */}
                  <Grid item xs={12}>
                    <Controller
                      name="reason"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={4}
                          label="Detailed Reason for Permission Request"
                          error={!!errors.reason}
                          helperText={errors.reason?.message}
                          placeholder="Provide a comprehensive explanation for your permission request..."
                        />
                      )}
                    />
                  </Grid>

                  {/* Contact Information */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="contact_phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Contact Phone Number"
                          error={!!errors.contact_phone}
                          helperText={errors.contact_phone?.message}
                          placeholder="Phone number during leave period"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="contact_email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Contact Email"
                          type="email"
                          error={!!errors.contact_email}
                          helperText={errors.contact_email?.message}
                          placeholder="Email address during leave period"
                        />
                      )}
                    />
                  </Grid>

                  {/* Residential Address */}
                  <Grid item xs={12}>
                    <Controller
                      name="residential_address"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label="Residential Address"
                          error={!!errors.residential_address}
                          helperText={errors.residential_address?.message}
                          placeholder="Your current residential address"
                        />
                      )}
                    />
                  </Grid>

                  {/* Supporting Document */}
                  <Grid item xs={12}>
                    <Controller
                      name="supporting_document"
                      control={control}
                      render={({ field: { onChange, value, ...field } }) => (
                        <Box>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            fullWidth
                            sx={{ 
                              height: 60, 
                              borderStyle: 'dashed',
                              bgcolor: watchFile && watchFile.length > 0 ? 'success.light' : 'grey.50',
                            }}
                          >
                            {watchFile && watchFile.length > 0 
                              ? `Selected: ${watchFile[0].name}` 
                              : 'Upload Supporting Document (Optional)'
                            }
                            <input
                              {...field}
                              type="file"
                              hidden
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={(e) => onChange(e.target.files)}
                            />
                          </Button>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Medical certificate, invitation letter, etc. (Max 10MB)
                          </Typography>
                        </Box>
                      )}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setShowForm(false);
                          reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <EventNote />}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Requests */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Permission Requests
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Days</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {request.reference_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.permission_type_display}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.days_granted || request.days_requested}
                          {request.days_granted && request.days_granted !== request.days_requested && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              (Requested: {request.days_requested})
                            </Typography>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(request.status)}
                          label={request.status_display}
                          color={getStatusColor(request.status) as any}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => {
                            setSelectedRequest(request);
                            setDetailsOpen(true);
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        {request.status === 'PENDING' && (
                          <IconButton size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {requests.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No permission requests found. Click "New Permission Request" to submit your first request.
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Request Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Permission Request Details - {selectedRequest?.reference_number}
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Typography variant="body1">{selectedRequest.permission_type_display}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    icon={getStatusIcon(selectedRequest.status)}
                    label={selectedRequest.status_display}
                    color={getStatusColor(selectedRequest.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">{new Date(selectedRequest.start_date).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">End Date</Typography>
                  <Typography variant="body1">{new Date(selectedRequest.end_date).toLocaleDateString()}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Days Requested</Typography>
                  <Typography variant="body1">{selectedRequest.days_requested}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Days Granted</Typography>
                  <Typography variant="body1">{selectedRequest.days_granted || 'Pending'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Reason</Typography>
                  <Typography variant="body1">{selectedRequest.reason}</Typography>
                </Grid>
                {selectedRequest.supervisor_comments && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Supervisor Comments</Typography>
                    <Typography variant="body1">{selectedRequest.supervisor_comments}</Typography>
                  </Grid>
                )}
                {selectedRequest.hr_comments && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">HR Comments</Typography>
                    <Typography variant="body1">{selectedRequest.hr_comments}</Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default PermissionRequestPage;