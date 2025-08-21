import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, FormControl, InputLabel, Select, MenuItem, Alert, Divider
} from '@mui/material';
import {
  EventNote, Visibility, CheckCircle, Cancel, Schedule, Person,
  CalendarToday, Assignment, Warning
} from '@mui/icons-material';

const PermissionReviewPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const permissionRequests = [
    {
      id: 1, nsp_name: 'John Doe', nsp_avatar: 'J', permission_type: 'Sick Leave',
      start_date: '2024-02-05', end_date: '2024-02-07', days_requested: 3,
      reason: 'Medical treatment for fever and flu symptoms',
      status: 'PENDING', supervisor_endorsed: false, is_emergency: false,
      contact_phone: '0244123456', contact_email: 'john.doe@email.com',
      residential_address: '123 Main Street, Accra', reference_number: 'PERM/2024/0003',
      created_at: '2024-02-01T10:30:00Z', supervisor_name: 'Dr. Samuel Mensah'
    },
    {
      id: 2, nsp_name: 'Jane Smith', nsp_avatar: 'J', permission_type: 'Personal Leave',
      start_date: '2024-02-10', end_date: '2024-02-10', days_requested: 1,
      reason: 'Attend family wedding ceremony',
      status: 'SUPERVISOR_APPROVED', supervisor_endorsed: true, is_emergency: false,
      contact_phone: '0244789012', contact_email: 'jane.smith@email.com',
      residential_address: '456 Oak Avenue, Kumasi', reference_number: 'PERM/2024/0004',
      created_at: '2024-02-03T14:20:00Z', supervisor_name: 'Prof. Mary Asante',
      supervisor_comments: 'Approved for family event'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'SUPERVISOR_APPROVED': return 'info';
      case 'PENDING': return 'warning';
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

  const handleApprove = (requestId: number, daysGranted: number, comments: string) => {
    console.log(`Approving request ${requestId} with ${daysGranted} days: ${comments}`);
    setReviewOpen(false);
  };

  const handleDecline = (requestId: number, comments: string) => {
    console.log(`Declining request ${requestId}: ${comments}`);
    setReviewOpen(false);
  };

  const filteredRequests = permissionRequests.filter(request => 
    !filterStatus || request.status === filterStatus
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <EventNote sx={{ mr: 1, verticalAlign: 'middle' }} />
          Permission Reviews
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and approve NSP permission requests
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Filter by Status">
                  <MenuItem value="">All Requests</MenuItem>
                  <MenuItem value="PENDING">Pending Review</MenuItem>
                  <MenuItem value="SUPERVISOR_APPROVED">Supervisor Approved</MenuItem>
                  <MenuItem value="APPROVED">HR Approved</MenuItem>
                  <MenuItem value="DECLINED">Declined</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth placeholder="Search by NSP name..." />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="outlined" onClick={() => setFilterStatus('')}>
                Clear Filters
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="text.secondary">
                {filteredRequests.length} requests found
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Permission Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Permission Requests</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NSP</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Supervisor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{request.nsp_avatar}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{request.nsp_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{request.reference_number}</Typography>
                          {request.is_emergency && (
                            <Chip label="EMERGENCY" color="error" size="small" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.permission_type}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">{request.days_requested}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{request.supervisor_name}</Typography>
                      <Chip 
                        label={request.supervisor_endorsed ? 'Endorsed' : 'Pending'} 
                        color={request.supervisor_endorsed ? 'success' : 'warning'} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(request.status)}
                        label={request.status.replace('_', ' ')}
                        color={getStatusColor(request.status) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{new Date(request.created_at).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => { setSelectedRequest(request); setReviewOpen(true); }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredRequests.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No permission requests found matching your criteria.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Review Permission Request - {selectedRequest?.reference_number}</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Alert severity={selectedRequest.is_emergency ? 'error' : 'info'}>
                  <Typography variant="body2">
                    <strong>{selectedRequest.is_emergency ? 'EMERGENCY REQUEST' : 'Regular Permission Request'}</strong>
                  </Typography>
                </Alert>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">NSP</Typography>
                <Typography variant="body1">{selectedRequest.nsp_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Type</Typography>
                <Typography variant="body1">{selectedRequest.permission_type}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Period</Typography>
                <Typography variant="body1">
                  {new Date(selectedRequest.start_date).toLocaleDateString()} - {new Date(selectedRequest.end_date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Days Requested</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedRequest.days_requested}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Reason</Typography>
                <Typography variant="body1">{selectedRequest.reason}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Contact Phone</Typography>
                <Typography variant="body1">{selectedRequest.contact_phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Contact Email</Typography>
                <Typography variant="body1">{selectedRequest.contact_email}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Residential Address</Typography>
                <Typography variant="body1">{selectedRequest.residential_address}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Supervisor Endorsement</Typography>
                <Chip 
                  label={selectedRequest.supervisor_endorsed ? 'Endorsed' : 'Pending'} 
                  color={selectedRequest.supervisor_endorsed ? 'success' : 'warning'} 
                  size="small" 
                />
                {selectedRequest.supervisor_comments && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Supervisor Comments:</strong> {selectedRequest.supervisor_comments}
                  </Typography>
                )}
              </Grid>
              
              {selectedRequest.status === 'SUPERVISOR_APPROVED' && (
                <>
                  <Grid item xs={12}><Divider /></Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>HR Decision</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="number" label="Days to Grant" 
                      defaultValue={selectedRequest.days_requested} inputProps={{ min: 0, max: selectedRequest.days_requested }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="date" label="Resumption Date" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="HR Comments"
                      placeholder="Add your comments about this decision..." />
                  </Grid>
                </>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)}>Close</Button>
          {selectedRequest?.status === 'SUPERVISOR_APPROVED' && (
            <>
              <Button variant="outlined" color="error" 
                onClick={() => handleDecline(selectedRequest.id, '')}>
                Decline
              </Button>
              <Button variant="contained" color="success"
                onClick={() => handleApprove(selectedRequest.id, selectedRequest.days_requested, '')}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PermissionReviewPage;