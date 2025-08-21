import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControlLabel, Checkbox, Divider
} from '@mui/material';
import {
  EventNote, Add, Visibility, CheckCircle, Schedule, Cancel, CloudUpload, Edit
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
  end_date: yup.date().required('End date is required'),
  reason: yup.string().required('Reason is required').min(10, 'Provide detailed reason'),
  contact_phone: yup.string().required('Contact phone is required'),
  contact_email: yup.string().email('Invalid email').required('Contact email is required'),
  residential_address: yup.string().required('Residential address is required'),
});

const PermissionRequestPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  const requests = [
    {
      id: 1, type: 'Sick Leave', period: '2024-01-20 to 2024-01-22', 
      days: 3, status: 'APPROVED', reference: 'PERM/2024/0001',
      reason: 'Medical treatment required', supervisor_comments: 'Approved for medical reasons'
    },
  ];

  const calculateDays = () => {
    if (startDate && endDate) {
      return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    return 0;
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      reset();
      setShowForm(false);
    } catch (err) {
      setError('Error submitting request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'DECLINED': return 'error';
      default: return 'default';
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
            Submit and manage permission/off-duty requests using official GNPC form
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(!showForm)} sx={{ mb: 3 }}>
          {showForm ? 'Cancel' : 'New Permission Request'}
        </Button>

        {showForm && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Official GNPC Permission Request Form</Typography>
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller name="permission_type" control={control} render={({ field }) => (
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
                      </FormControl>
                    )} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Controller name="start_date" control={control} render={({ field }) => (
                      <DatePicker label="Start Date" value={field.value} onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true, error: !!errors.start_date } }} />
                    )} />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Controller name="end_date" control={control} render={({ field }) => (
                      <DatePicker label="End Date" value={field.value} onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true, error: !!errors.end_date } }} />
                    )} />
                  </Grid>
                  {startDate && endDate && (
                    <Grid item xs={12}>
                      <Alert severity="info"><strong>Days Requested: {calculateDays()}</strong></Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Controller name="reason" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth multiline rows={4} label="Detailed Reason"
                        error={!!errors.reason} helperText={errors.reason?.message}
                        placeholder="Provide comprehensive explanation..." />
                    )} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller name="contact_phone" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth label="Contact Phone" error={!!errors.contact_phone}
                        helperText={errors.contact_phone?.message} />
                    )} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller name="contact_email" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth label="Contact Email" type="email"
                        error={!!errors.contact_email} helperText={errors.contact_email?.message} />
                    )} />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller name="residential_address" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth multiline rows={2} label="Residential Address"
                        error={!!errors.residential_address} helperText={errors.residential_address?.message} />
                    )} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth
                      sx={{ height: 60, borderStyle: 'dashed' }}>
                      Upload Supporting Document (Optional)
                      <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button type="submit" variant="contained" disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <EventNote />}>
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Your Permission Requests</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reference</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.reference}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>{request.period}</TableCell>
                      <TableCell>
                        <Chip label={request.status} color={getStatusColor(request.status) as any} size="small" />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => { setSelectedRequest(request); setDetailsOpen(true); }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Permission Request Details</DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}><Typography><strong>Type:</strong> {selectedRequest.type}</Typography></Grid>
                <Grid item xs={12}><Typography><strong>Period:</strong> {selectedRequest.period}</Typography></Grid>
                <Grid item xs={12}><Typography><strong>Reason:</strong> {selectedRequest.reason}</Typography></Grid>
                {selectedRequest.supervisor_comments && (
                  <Grid item xs={12}><Typography><strong>Supervisor Comments:</strong> {selectedRequest.supervisor_comments}</Typography></Grid>
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