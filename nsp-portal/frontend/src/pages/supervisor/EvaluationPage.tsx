import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Rating, Divider
} from '@mui/material';
import {
  Assessment, Add, Visibility, Edit, Star, CheckCircle, Schedule, Person
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const EvaluationPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      evaluation_type: 'MONTHLY',
      punctuality: 3, attendance: 3, work_quality: 3, initiative: 3,
      teamwork: 3, communication: 3, learning_ability: 3, professionalism: 3,
      overall_rating: 3
    }
  });

  const ratings = {
    punctuality: watch('punctuality'),
    attendance: watch('attendance'),
    work_quality: watch('work_quality'),
    initiative: watch('initiative'),
    teamwork: watch('teamwork'),
    communication: watch('communication'),
    learning_ability: watch('learning_ability'),
    professionalism: watch('professionalism'),
  };

  const calculateOverallRating = () => {
    const values = Object.values(ratings);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 10) / 10;
  };

  const evaluations = [
    {
      id: 1, nsp_name: 'John Doe', evaluation_type: 'Monthly Evaluation',
      period: 'January 2024', overall_rating: 4, status: 'COMPLETED',
      created_at: '2024-02-01', nsp_acknowledged: true
    },
    {
      id: 2, nsp_name: 'Jane Smith', evaluation_type: 'Quarterly Evaluation',
      period: 'Q4 2023', overall_rating: 5, status: 'COMPLETED',
      created_at: '2024-01-15', nsp_acknowledged: true
    },
  ];

  const assignedNSPs = [
    { id: 1, name: 'John Doe', nss_id: 'NSS2024001', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', nss_id: 'NSS2024002', department: 'Engineering' },
  ];

  const onSubmit = async (data: any) => {
    try {
      console.log('Submitting evaluation:', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      reset();
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting evaluation');
    }
  };

  const criteriaLabels = {
    punctuality: 'Punctuality',
    attendance: 'Attendance',
    work_quality: 'Work Quality',
    initiative: 'Initiative',
    teamwork: 'Teamwork',
    communication: 'Communication',
    learning_ability: 'Learning Ability',
    professionalism: 'Professionalism',
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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

        <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(!showForm)} sx={{ mb: 3 }}>
          {showForm ? 'Cancel' : 'New Evaluation'}
        </Button>

        {showForm && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Create Performance Evaluation</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller name="nsp" control={control} render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Select NSP</InputLabel>
                        <Select {...field} label="Select NSP">
                          {assignedNSPs.map((nsp) => (
                            <MenuItem key={nsp.id} value={nsp.id}>{nsp.name} ({nsp.nss_id})</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller name="evaluation_type" control={control} render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Evaluation Type</InputLabel>
                        <Select {...field} label="Evaluation Type">
                          <MenuItem value="MONTHLY">Monthly Evaluation</MenuItem>
                          <MenuItem value="QUARTERLY">Quarterly Evaluation</MenuItem>
                          <MenuItem value="MID_TERM">Mid-term Evaluation</MenuItem>
                          <MenuItem value="FINAL">Final Evaluation</MenuItem>
                        </Select>
                      </FormControl>
                    )} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller name="period_start" control={control} render={({ field }) => (
                      <DatePicker label="Evaluation Period Start" value={field.value} onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true } }} />
                    )} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller name="period_end" control={control} render={({ field }) => (
                      <DatePicker label="Evaluation Period End" value={field.value} onChange={field.onChange}
                        slotProps={{ textField: { fullWidth: true } }} />
                    )} />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>Performance Criteria (1-5 Scale)</Typography>
                  </Grid>

                  {Object.entries(criteriaLabels).map(([key, label]) => (
                    <Grid item xs={12} md={6} key={key}>
                      <Controller name={key} control={control} render={({ field }) => (
                        <Box>
                          <Typography component="legend" gutterBottom>{label}</Typography>
                          <Rating {...field} max={5} size="large" onChange={(_, value) => field.onChange(value || 1)} />
                        </Box>
                      )} />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Calculated Overall Rating: {calculateOverallRating()}/5</strong>
                      </Typography>
                    </Alert>
                  </Grid>

                  <Grid item xs={12}>
                    <Controller name="strengths" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth multiline rows={3} label="Key Strengths Observed"
                        placeholder="Describe the NSP's key strengths and positive qualities..." />
                    )} />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller name="areas_for_improvement" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth multiline rows={3} label="Areas for Improvement"
                        placeholder="Identify areas where the NSP can improve..." />
                    )} />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller name="recommendations" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth multiline rows={3} label="Recommendations for Development"
                        placeholder="Provide specific recommendations for the NSP's professional development..." />
                    )} />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller name="goals_for_next_period" control={control} render={({ field }) => (
                      <TextField {...field} fullWidth multiline rows={2} label="Goals for Next Period"
                        placeholder="Set goals and objectives for the next evaluation period..." />
                    )} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button variant="outlined">Save as Draft</Button>
                      <Button type="submit" variant="contained" startIcon={<Star />}>
                        Submit Evaluation
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
            <Typography variant="h6" gutterBottom>Completed Evaluations</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>NSP</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Overall Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {evaluations.map((evaluation) => (
                    <TableRow key={evaluation.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{evaluation.nsp_name.charAt(0)}</Avatar>
                          <Typography variant="body2">{evaluation.nsp_name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{evaluation.evaluation_type}</TableCell>
                      <TableCell>{evaluation.period}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={evaluation.overall_rating} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 1 }}>({evaluation.overall_rating}/5)</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={evaluation.status} color="success" size="small" />
                        {evaluation.nsp_acknowledged && (
                          <Typography variant="caption" display="block" color="success.main">
                            ✓ Acknowledged by NSP
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => { setSelectedEvaluation(evaluation); setDetailsOpen(true); }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small"><Edit fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Evaluation Details</DialogTitle>
          <DialogContent>
            {selectedEvaluation && (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}><Typography><strong>NSP:</strong> {selectedEvaluation.nsp_name}</Typography></Grid>
                <Grid item xs={12}><Typography><strong>Type:</strong> {selectedEvaluation.evaluation_type}</Typography></Grid>
                <Grid item xs={12}><Typography><strong>Period:</strong> {selectedEvaluation.period}</Typography></Grid>
                <Grid item xs={12}>
                  <Typography><strong>Overall Rating:</strong></Typography>
                  <Rating value={selectedEvaluation.overall_rating} readOnly />
                </Grid>
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

export default EvaluationPage;