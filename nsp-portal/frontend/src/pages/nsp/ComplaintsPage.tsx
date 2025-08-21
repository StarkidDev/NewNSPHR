import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox
} from '@mui/material';
import { Assignment, Add, Visibility, CloudUpload } from '@mui/icons-material';

const ComplaintsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const complaints = [
    {
      id: 1, complaint_number: 'COMP/2024/0001', subject: 'Inadequate Office Equipment',
      complaint_type_display: 'Resource Inadequacy', status: 'UNDER_INVESTIGATION',
      status_display: 'Under Investigation', priority: 'MEDIUM',
      created_at: '2024-01-15T10:30:00Z', assigned_to_name: 'HR Manager',
      description: 'The office lacks proper computer equipment for effective work.'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'success';
      case 'UNDER_INVESTIGATION': return 'info';
      case 'SUBMITTED': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Complaints & Feedback
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit complaints and provide feedback for continuous improvement
        </Typography>
      </Box>

      <Button variant="contained" startIcon={<Add />} onClick={() => setShowForm(!showForm)} sx={{ mb: 3 }}>
        {showForm ? 'Cancel' : 'File New Complaint'}
      </Button>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>File a Complaint</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Complaint Type</InputLabel>
                  <Select label="Complaint Type">
                    <MenuItem value="HARASSMENT">Harassment</MenuItem>
                    <MenuItem value="DISCRIMINATION">Discrimination</MenuItem>
                    <MenuItem value="WORKPLACE_SAFETY">Workplace Safety</MenuItem>
                    <MenuItem value="UNFAIR_TREATMENT">Unfair Treatment</MenuItem>
                    <MenuItem value="RESOURCE_INADEQUACY">Resource Inadequacy</MenuItem>
                    <MenuItem value="SUPERVISION_ISSUES">Supervision Issues</MenuItem>
                    <MenuItem value="ACCOMMODATION">Accommodation Issues</MenuItem>
                    <MenuItem value="TRANSPORTATION">Transportation Issues</MenuItem>
                    <MenuItem value="ALLOWANCE">Allowance Related</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select label="Priority">
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Subject" placeholder="Brief description of the complaint" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Detailed Description"
                  placeholder="Provide a comprehensive description of the issue, including what happened, when, where, and who was involved..." />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth type="date" label="Incident Date" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Location" placeholder="Where did the incident occur?" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="People Involved (Optional)"
                  placeholder="Names and roles of people involved in the incident..." />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Witnesses (Optional)"
                  placeholder="Names and contact details of any witnesses..." />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox />}
                  label="Submit anonymously (your identity will not be revealed to the accused parties)" />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth
                  sx={{ height: 60, borderStyle: 'dashed', bgcolor: 'grey.50' }}>
                  Upload Supporting Evidence (Optional)
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Photos, documents, emails, or other evidence (Max 10MB per file)
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Confidentiality Notice:</strong> All complaints are treated with strict confidentiality. 
                    Only authorized personnel will have access to your complaint details.
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button variant="contained">Submit Complaint</Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Your Complaints</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">{complaint.complaint_number}</Typography>
                    </TableCell>
                    <TableCell>{complaint.subject}</TableCell>
                    <TableCell>{complaint.complaint_type_display}</TableCell>
                    <TableCell>
                      <Chip label={complaint.priority} color={complaint.priority === 'HIGH' ? 'error' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={complaint.status_display} color={getStatusColor(complaint.status) as any} size="small" />
                    </TableCell>
                    <TableCell>{new Date(complaint.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => { setSelectedComplaint(complaint); setDetailsOpen(true); }}>
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
        <DialogTitle>Complaint Details - {selectedComplaint?.complaint_number}</DialogTitle>
        <DialogContent>
          {selectedComplaint && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}><Typography><strong>Subject:</strong> {selectedComplaint.subject}</Typography></Grid>
              <Grid item xs={12}><Typography><strong>Type:</strong> {selectedComplaint.complaint_type_display}</Typography></Grid>
              <Grid item xs={12}><Typography><strong>Description:</strong> {selectedComplaint.description}</Typography></Grid>
              <Grid item xs={12}><Typography><strong>Status:</strong> {selectedComplaint.status_display}</Typography></Grid>
              {selectedComplaint.assigned_to_name && (
                <Grid item xs={12}><Typography><strong>Assigned to:</strong> {selectedComplaint.assigned_to_name}</Typography></Grid>
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

export default ComplaintsPage;