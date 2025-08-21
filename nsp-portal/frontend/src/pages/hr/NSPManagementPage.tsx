import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Grid, TextField, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Avatar, FormControl, InputLabel, Select, MenuItem, Tabs, Tab, Alert
} from '@mui/material';
import {
  People, Visibility, Edit, Assignment, Person, School, Work,
  Email, Phone, LocationOn, CalendarToday, TrendingUp
} from '@mui/icons-material';

const NSPManagementPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedNSP, setSelectedNSP] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const nsps = [
    {
      id: 1, name: 'John Doe', email: 'john.doe@email.com', phone: '0244123456',
      nss_id: 'NSS2024001', program: 'Regular National Service', service_year: 2024,
      department: 'Engineering & Operations', supervisor: 'Dr. Samuel Mensah',
      status: 'ACTIVE', start_date: '2024-01-15', expected_end_date: '2024-12-14',
      institution: 'University of Ghana', qualification: "Bachelor's Degree",
      course: 'Computer Science', performance: 85, attendance: 95
    },
    {
      id: 2, name: 'Jane Smith', email: 'jane.smith@email.com', phone: '0244789012',
      nss_id: 'NSS2024002', program: 'Graduate National Service', service_year: 2024,
      department: 'Research & Development', supervisor: 'Prof. Mary Asante',
      status: 'ACTIVE', start_date: '2024-01-20', expected_end_date: '2024-12-19',
      institution: 'KNUST', qualification: "Master's Degree",
      course: 'Petroleum Engineering', performance: 92, attendance: 98
    },
  ];

  const departments = [
    'Engineering & Operations', 'Research & Development', 'Human Resources',
    'Finance & Administration', 'Information Technology', 'Legal & Compliance'
  ];

  const supervisors = [
    'Dr. Samuel Mensah', 'Prof. Mary Asante', 'Mr. Kwame Osei', 'Dr. Akosua Frimpong'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'COMPLETED': return 'info';
      case 'TERMINATED': return 'error';
      default: return 'default';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'success';
    if (performance >= 75) return 'warning';
    return 'error';
  };

  const handleAssignDepartment = (nspId: number, department: string) => {
    console.log(`Assigning NSP ${nspId} to department: ${department}`);
  };

  const handleAssignSupervisor = (nspId: number, supervisor: string) => {
    console.log(`Assigning NSP ${nspId} to supervisor: ${supervisor}`);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <People sx={{ mr: 1, verticalAlign: 'middle' }} />
          NSP Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage National Service Personnel profiles, assignments, and performance
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main">{nsps.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total NSPs</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {Math.round(nsps.reduce((sum, nsp) => sum + nsp.performance, 0) / nsps.length)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Avg Performance</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {Math.round(nsps.reduce((sum, nsp) => sum + nsp.attendance, 0) / nsps.length)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">Avg Attendance</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {nsps.filter(nsp => nsp.status === 'ACTIVE').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Active NSPs</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* NSP Directory */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">NSP Directory</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField size="small" placeholder="Search NSPs..." />
              <Button variant="outlined">Export</Button>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>NSP</TableCell>
                  <TableCell>Program</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Supervisor</TableCell>
                  <TableCell>Performance</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {nsps.map((nsp) => (
                  <TableRow key={nsp.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{nsp.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">{nsp.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{nsp.nss_id}</Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">{nsp.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{nsp.program}</Typography>
                      <Typography variant="caption" color="text.secondary">Year: {nsp.service_year}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{nsp.department}</Typography>
                      <Button size="small" variant="text" onClick={() => {}}>
                        Reassign
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{nsp.supervisor}</Typography>
                      <Button size="small" variant="text" onClick={() => {}}>
                        Change
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 60, mr: 1 }}>
                          <Typography variant="caption">{nsp.performance}%</Typography>
                          <Box sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: 1, height: 4 }}>
                            <Box sx={{ 
                              width: `${nsp.performance}%`, 
                              bgcolor: getPerformanceColor(nsp.performance) + '.main',
                              height: '100%', borderRadius: 1 
                            }} />
                          </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {nsp.attendance}% attendance
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={nsp.status} color={getStatusColor(nsp.status) as any} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={() => { setSelectedNSP(nsp); setProfileOpen(true); }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => { setSelectedNSP(nsp); setEditMode(true); setProfileOpen(true); }}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* NSP Profile Dialog */}
      <Dialog open={profileOpen} onClose={() => { setProfileOpen(false); setEditMode(false); }} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">NSP Profile - {selectedNSP?.name}</Typography>
            <Button variant="outlined" onClick={() => setEditMode(!editMode)}>
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedNSP && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">NSS ID</Typography>
                <Typography variant="body1">{selectedNSP.nss_id}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{selectedNSP.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{selectedNSP.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Program</Typography>
                <Typography variant="body1">{selectedNSP.program}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Department</Typography>
                {editMode ? (
                  <FormControl fullWidth size="small">
                    <Select value={selectedNSP.department} onChange={() => {}}>
                      {departments.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1">{selectedNSP.department}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Supervisor</Typography>
                {editMode ? (
                  <FormControl fullWidth size="small">
                    <Select value={selectedNSP.supervisor} onChange={() => {}}>
                      {supervisors.map((sup) => (
                        <MenuItem key={sup} value={sup}>{sup}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1">{selectedNSP.supervisor}</Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Service Period</Typography>
                <Typography variant="body1">
                  {new Date(selectedNSP.start_date).toLocaleDateString()} - {new Date(selectedNSP.expected_end_date).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Chip label={selectedNSP.status} color={getStatusColor(selectedNSP.status) as any} size="small" />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Institution & Qualification</Typography>
                <Typography variant="body1">
                  {selectedNSP.qualification} in {selectedNSP.course} from {selectedNSP.institution}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Performance Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 100, mr: 2 }}>
                    <Box sx={{ width: '100%', bgcolor: 'grey.300', borderRadius: 1, height: 8 }}>
                      <Box sx={{ 
                        width: `${selectedNSP.performance}%`, 
                        bgcolor: getPerformanceColor(selectedNSP.performance) + '.main',
                        height: '100%', borderRadius: 1 
                      }} />
                    </Box>
                  </Box>
                  <Typography variant="body2">{selectedNSP.performance}%</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Attendance Rate</Typography>
                <Typography variant="body1" color={selectedNSP.attendance >= 95 ? 'success.main' : 'warning.main'}>
                  {selectedNSP.attendance}%
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          {editMode && <Button variant="contained">Save Changes</Button>}
          <Button onClick={() => { setProfileOpen(false); setEditMode(false); }}>
            {editMode ? 'Cancel' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NSPManagementPage;