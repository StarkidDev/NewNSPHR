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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Assignment,
  Add,
  Visibility,
  CheckCircle,
  Schedule,
  Warning,
  CloudUpload,
} from '@mui/icons-material';

const ComplaintsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Mock data
  const [complaints] = useState([
    {
      id: 1,
      complaint_number: 'COMP/2024/0001',
      subject: 'Inadequate Office Equipment',
      complaint_type_display: 'Resource Inadequacy',
      status: 'UNDER_INVESTIGATION',
      status_display: 'Under Investigation',
      priority: 'MEDIUM',
      created_at: '2024-01-15T10:30:00Z',
      assigned_to_name: 'HR Manager',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'success';
      case 'UNDER_INVESTIGATION': return 'info';
      case 'SUBMITTED': return 'warning';
      case 'CLOSED': return 'default';
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

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'File New Complaint'}
        </Button>
      </Box>

      {showForm && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              File a Complaint
            </Typography>
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
                <TextField
                  fullWidth
                  label="Subject"
                  placeholder="Brief description of the complaint"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Detailed Description"
                  placeholder="Provide a comprehensive description of the issue..."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Incident Date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="Where did the incident occur?"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Submit anonymously (your identity will not be revealed)"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ height: 60, borderStyle: 'dashed' }}
                >
                  Upload Supporting Evidence (Optional)
                  <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button variant="outlined" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained">
                    Submit Complaint
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Complaints
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id} hover>
                    <TableCell>{complaint.complaint_number}</TableCell>
                    <TableCell>{complaint.subject}</TableCell>
                    <TableCell>{complaint.complaint_type_display}</TableCell>
                    <TableCell>
                      <Chip
                        label={complaint.status_display}
                        color={getStatusColor(complaint.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(complaint.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton size="small">
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
    </Container>
  );
};

export default ComplaintsPage;