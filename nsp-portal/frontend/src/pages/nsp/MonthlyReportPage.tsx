import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Rating, Divider, LinearProgress
} from '@mui/material';
import {
  Assessment, Add, Visibility, Edit, Send, CheckCircle, Schedule, Cancel, CloudUpload, Star
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const MonthlyReportPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      report_month: new Date().getMonth() + 1,
      report_year: new Date().getFullYear(),
      self_rating: 3,
      days_absent: 0,
      days_on_permission: 0,
    },
  });

  const totalWorkingDays = watch('total_working_days');
  const daysPresent = watch('days_present');
  const daysAbsent = watch('days_absent');
  const daysOnPermission = watch('days_on_permission');

  const reports = [
    {
      id: 1, month: 1, year: 2024, status: 'APPROVED', rating: 4,
      submitted_at: '2024-02-01', reviewed_at: '2024-02-03',
      supervisor_comments: 'Excellent work and detailed reporting.',
      activities: 'Participated in petroleum engineering projects...',
      achievements: 'Completed training modules, contributed to team projects...'
    },
    {
      id: 2, month: 2, year: 2024, status: 'SUBMITTED', rating: 4,
      submitted_at: '2024-03-01', activities: 'Continued project work...',
      achievements: 'Improved technical skills...'
    },
    { id: 3, month: 3, year: 2024, status: 'DRAFT', rating: 0 },
  ];

  const calculateAttendance = () => {
    if (totalWorkingDays && daysPresent !== undefined) {
      return Math.round((daysPresent / totalWorkingDays) * 100);
    }
    return 0;
  };

  const validateWorkingDays = () => {
    const total = (daysPresent || 0) + (daysAbsent || 0) + (daysOnPermission || 0);
    return total === totalWorkingDays;
  };

  const onSubmit = async (data: any) => {
    if (!validateWorkingDays()) {
      setError('Working days breakdown must equal total working days');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      reset();
      setShowForm(false);
    } catch (err) {
      setError('Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'SUBMITTED': return 'info';
      case 'DRAFT': return 'warning';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

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

      <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(!showForm)} sx={{ mb: 3 }}>
        {showForm ? 'Cancel' : 'New Monthly Report'}
      </Button>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Monthly Activity Report</Typography>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller name="report_month" control={control} render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Report Month</InputLabel>
                      <Select {...field} label="Report Month">
                        {Array.from({length: 12}, (_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>{getMonthName(i + 1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller name="report_year" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth type="number" label="Report Year" />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="activities_undertaken" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth multiline rows={4} label="Activities Undertaken"
                      placeholder="Describe in detail the activities you undertook this month..." />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="achievements" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth multiline rows={3} label="Key Achievements"
                      placeholder="Highlight your key achievements and accomplishments..." />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="challenges_faced" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth multiline rows={3} label="Challenges Faced (Optional)"
                      placeholder="Describe any challenges encountered..." />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name="skills_acquired" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth multiline rows={2} label="Skills Acquired (Optional)"
                      placeholder="List new skills or knowledge gained..." />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Attendance Summary</Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="total_working_days" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth type="number" label="Total Working Days"
                      inputProps={{ min: 1, max: 31 }} />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="days_present" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth type="number" label="Days Present" inputProps={{ min: 0 }} />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="days_absent" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth type="number" label="Days Absent" inputProps={{ min: 0 }} />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="days_on_permission" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth type="number" label="Days on Permission" inputProps={{ min: 0 }} />
                  )} />
                </Grid>
                {totalWorkingDays && daysPresent !== undefined && (
                  <Grid item xs={12}>
                    <Typography variant="body2" gutterBottom>Attendance Rate: {calculateAttendance()}%</Typography>
                    <LinearProgress variant="determinate" value={calculateAttendance()}
                      color={calculateAttendance() >= 90 ? 'success' : calculateAttendance() >= 75 ? 'warning' : 'error'}
                      sx={{ height: 8, borderRadius: 4 }} />
                    {!validateWorkingDays() && (
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        Working days breakdown must equal total working days ({totalWorkingDays})
                      </Alert>
                    )}
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>Self Assessment</Typography>
                  <Controller name="self_rating" control={control} render={({ field }) => (
                    <Box>
                      <Typography component="legend" gutterBottom>Overall Performance Rating</Typography>
                      <Rating {...field} max={5} size="large" onChange={(_, value) => field.onChange(value || 1)} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Rate your performance (1 = Poor, 5 = Excellent)
                      </Typography>
                    </Box>
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth
                    sx={{ height: 60, borderStyle: 'dashed' }}>
                    Upload Supporting Documents (Optional)
                    <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" />
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button variant="outlined" startIcon={<Edit />}>Save as Draft</Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting || !validateWorkingDays()}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}>
                      {isSubmitting ? 'Submitting...' : 'Submit Report'}
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
          <Typography variant="h6" gutterBottom>Your Monthly Reports</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Period</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Self Rating</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{getMonthName(report.month)} {report.year}</TableCell>
                    <TableCell>
                      <Chip label={report.status} color={getStatusColor(report.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      {report.rating > 0 ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={report.rating} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 1 }}>({report.rating}/5)</Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">Not rated</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {report.submitted_at ? new Date(report.submitted_at).toLocaleDateString() : 'Not submitted'}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => { setSelectedReport(report); setDetailsOpen(true); }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      {report.status === 'DRAFT' && (
                        <IconButton size="small"><Edit fontSize="small" /></IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Monthly Report Details</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}><Typography><strong>Period:</strong> {getMonthName(selectedReport.month)} {selectedReport.year}</Typography></Grid>
              <Grid item xs={12}><Typography><strong>Activities:</strong> {selectedReport.activities}</Typography></Grid>
              <Grid item xs={12}><Typography><strong>Achievements:</strong> {selectedReport.achievements}</Typography></Grid>
              <Grid item xs={12}><Rating value={selectedReport.rating} readOnly /></Grid>
              {selectedReport.supervisor_comments && (
                <Grid item xs={12}><Typography><strong>Supervisor Comments:</strong> {selectedReport.supervisor_comments}</Typography></Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MonthlyReportPage;