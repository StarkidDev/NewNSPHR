import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Checkbox,
  Toolbar,
  Tooltip,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Assignment,
  Visibility,
  Edit,
  Download,
  CheckCircle,
  Cancel,
  Schedule,
  FilterList,
  Search,
  GetApp,
  Email,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchSubmissions, reviewSubmission, bulkAction } from '../../store/slices/appointmentSlice';

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  nss_id: string;
  program: string;
  program_display: string;
  service_year: number;
  institution_attended: string;
  qualification: string;
  course_of_study: string;
  status: string;
  status_display: string;
  submission_reference: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by_name?: string;
  review_notes?: string;
}

const AppointmentManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { submissions, loading, error } = useSelector((state: RootState) => state.appointments);
  
  const [selectedApplications, setSelectedApplications] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewData, setReviewData] = useState({
    status: '',
    review_notes: '',
    decision_notes: '',
  });
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction_type, setBulkActionType] = useState('');

  // Mock data for demonstration
  const [applications] = useState<Application[]>([
    {
      id: 1,
      full_name: 'John Doe',
      email: 'john.doe@email.com',
      phone_number: '0244123456',
      nss_id: 'NSS2024001',
      program: 'REGULAR',
      program_display: 'Regular National Service',
      service_year: 2024,
      institution_attended: 'University of Ghana',
      qualification: "Bachelor's Degree",
      course_of_study: 'Computer Science',
      status: 'PENDING',
      status_display: 'Pending Review',
      submission_reference: 'NSP2024001',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      full_name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone_number: '0244789012',
      nss_id: 'NSS2024002',
      program: 'GRADUATE',
      program_display: 'Graduate National Service',
      service_year: 2024,
      institution_attended: 'KNUST',
      qualification: "Master's Degree",
      course_of_study: 'Petroleum Engineering',
      status: 'UNDER_REVIEW',
      status_display: 'Under Review',
      submission_reference: 'NSP2024002',
      created_at: '2024-01-14T14:20:00Z',
      reviewed_at: '2024-01-16T09:00:00Z',
      reviewed_by_name: 'HR Officer',
    },
    {
      id: 3,
      full_name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone_number: '0244345678',
      nss_id: 'NSS2024003',
      program: 'TEACHERS',
      program_display: 'Teachers National Service',
      service_year: 2024,
      institution_attended: 'UCC',
      qualification: "Bachelor's Degree",
      course_of_study: 'Education',
      status: 'APPROVED',
      status_display: 'Approved',
      submission_reference: 'NSP2024003',
      created_at: '2024-01-13T16:45:00Z',
      reviewed_at: '2024-01-15T11:30:00Z',
      reviewed_by_name: 'HR Manager',
      review_notes: 'Excellent qualifications and meets all requirements.',
    },
  ]);

  useEffect(() => {
    // In real app, fetch from API
    // dispatch(fetchSubmissions() as any);
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'UNDER_REVIEW': return 'info';
      case 'DECLINED': return 'error';
      case 'REQUIRES_INFO': return 'warning';
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

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedApplications(filteredApplications.map(app => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (id: number) => {
    setSelectedApplications(prev =>
      prev.includes(id)
        ? prev.filter(appId => appId !== id)
        : [...prev, id]
    );
  };

  const handleReviewApplication = (application: Application) => {
    setSelectedApplication(application);
    setReviewData({
      status: application.status,
      review_notes: application.review_notes || '',
      decision_notes: '',
    });
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (selectedApplication) {
      // In real app, dispatch API call
      console.log('Submitting review:', { id: selectedApplication.id, ...reviewData });
      setReviewDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleBulkAction = () => {
    if (selectedApplications.length > 0 && bulkAction_type) {
      // In real app, dispatch API call
      console.log('Bulk action:', { ids: selectedApplications, action: bulkAction_type });
      setBulkActionDialog(false);
      setSelectedApplications([]);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = !filterStatus || app.status === filterStatus;
    const matchesProgram = !filterProgram || app.program === filterProgram;
    const matchesSearch = !searchTerm || 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nss_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.submission_reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesProgram && matchesSearch;
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
          Appointment Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and process NSP appointment submissions
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                  <MenuItem value="APPROVED">Approved</MenuItem>
                  <MenuItem value="DECLINED">Declined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Program</InputLabel>
                <Select
                  value={filterProgram}
                  onChange={(e) => setFilterProgram(e.target.value)}
                  label="Program"
                >
                  <MenuItem value="">All Programs</MenuItem>
                  <MenuItem value="REGULAR">Regular</MenuItem>
                  <MenuItem value="GRADUATE">Graduate</MenuItem>
                  <MenuItem value="TEACHERS">Teachers</MenuItem>
                  <MenuItem value="HEALTH">Health</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => {
                    setFilterStatus('');
                    setFilterProgram('');
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<GetApp />}
                >
                  Export
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              {selectedApplications.length > 0 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setBulkActionDialog(true)}
                >
                  Bulk Action ({selectedApplications.length})
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading && <LinearProgress />}
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedApplications.length > 0 && selectedApplications.length < filteredApplications.length}
                      checked={filteredApplications.length > 0 && selectedApplications.length === filteredApplications.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {application.full_name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {application.full_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {application.email}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            {application.submission_reference}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {application.program_display}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Year: {application.service_year}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {application.institution_attended}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {application.qualification} in {application.course_of_study}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(application.status)}
                        label={application.status_display}
                        color={getStatusColor(application.status) as any}
                        size="small"
                        variant="outlined"
                      />
                      {application.reviewed_by_name && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          by {application.reviewed_by_name}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(application.created_at).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(application.created_at).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Review Application">
                          <IconButton 
                            size="small" 
                            onClick={() => handleReviewApplication(application)}
                            disabled={application.status === 'APPROVED'}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Documents">
                          <IconButton size="small">
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send Email">
                          <IconButton size="small">
                            <Email fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredApplications.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No applications found matching your criteria.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Review Application - {selectedApplication?.full_name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Decision</InputLabel>
              <Select
                value={reviewData.status}
                onChange={(e) => setReviewData({ ...reviewData, status: e.target.value })}
                label="Decision"
              >
                <MenuItem value="APPROVED">Approve Application</MenuItem>
                <MenuItem value="DECLINED">Decline Application</MenuItem>
                <MenuItem value="REQUIRES_INFO">Requires Additional Information</MenuItem>
                <MenuItem value="UNDER_REVIEW">Keep Under Review</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Review Notes"
              value={reviewData.review_notes}
              onChange={(e) => setReviewData({ ...reviewData, review_notes: e.target.value })}
              placeholder="Add your review comments..."
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Decision Notes (sent to applicant)"
              value={reviewData.decision_notes}
              onChange={(e) => setReviewData({ ...reviewData, decision_notes: e.target.value })}
              placeholder="Message to be sent to the applicant..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            disabled={!reviewData.status}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
        <DialogTitle>
          Bulk Action ({selectedApplications.length} applications)
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Action</InputLabel>
            <Select
              value={bulkAction_type}
              onChange={(e) => setBulkActionType(e.target.value)}
              label="Action"
            >
              <MenuItem value="approve">Approve All</MenuItem>
              <MenuItem value="decline">Decline All</MenuItem>
              <MenuItem value="require_info">Request Additional Info</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkAction} 
            variant="contained"
            disabled={!bulkAction_type}
          >
            Apply Action
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AppointmentManagementPage;