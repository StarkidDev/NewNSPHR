import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  People,
  EventNote,
  TrendingUp,
  Warning,
  CheckCircle,
  Schedule,
  Cancel,
  Visibility,
  Edit,
  MoreVert,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { fetchStats } from '../../store/slices/appointmentSlice';

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { stats } = useSelector((state: RootState) => state.appointments);

  // Mock data - in real app, this would come from API
  const [dashboardData] = useState({
    stats: {
      totalNSPs: 45,
      activeNSPs: 42,
      pendingApplications: 8,
      approvedThisMonth: 12,
      permissionRequests: 5,
      monthlyReportsDue: 15,
      complaintsOpen: 3,
    },
    recentApplications: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@email.com',
        program: 'Regular National Service',
        status: 'PENDING',
        submittedAt: '2024-01-15',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        program: 'Graduate National Service',
        status: 'UNDER_REVIEW',
        submittedAt: '2024-01-14',
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@email.com',
        program: 'Teachers National Service',
        status: 'APPROVED',
        submittedAt: '2024-01-13',
      },
    ],
    recentActivities: [
      { type: 'application', message: 'New application from Sarah Wilson', time: '2 hours ago' },
      { type: 'permission', message: 'Permission request approved for John Doe', time: '4 hours ago' },
      { type: 'report', message: '5 monthly reports submitted today', time: '6 hours ago' },
      { type: 'complaint', message: 'New complaint filed by Jane Smith', time: '1 day ago' },
    ],
    upcomingTasks: [
      { task: 'Review 8 pending applications', priority: 'high', dueDate: 'Today' },
      { task: 'Process 5 permission requests', priority: 'medium', dueDate: 'Tomorrow' },
      { task: 'Follow up on overdue reports', priority: 'medium', dueDate: 'This week' },
      { task: 'Quarterly NSP evaluation meeting', priority: 'low', dueDate: 'Next week' },
    ],
  });

  useEffect(() => {
    // Fetch real stats from API
    dispatch(fetchStats() as any);
  }, [dispatch]);

  const quickActions = [
    {
      title: 'Review Applications',
      description: `${dashboardData.stats.pendingApplications} pending applications`,
      icon: <Assignment color="primary" />,
      action: () => navigate('/hr/appointments'),
      color: 'primary',
      urgent: dashboardData.stats.pendingApplications > 5,
    },
    {
      title: 'Manage NSPs',
      description: `${dashboardData.stats.activeNSPs} active NSPs`,
      icon: <People color="success" />,
      action: () => navigate('/hr/nsps'),
      color: 'success',
    },
    {
      title: 'Permission Requests',
      description: `${dashboardData.stats.permissionRequests} requests pending`,
      icon: <EventNote color="warning" />,
      action: () => navigate('/hr/permissions'),
      color: 'warning',
      urgent: dashboardData.stats.permissionRequests > 3,
    },
    {
      title: 'Reports & Analytics',
      description: 'View comprehensive reports',
      icon: <TrendingUp color="info" />,
      action: () => navigate('/hr/reports'),
      color: 'info',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'UNDER_REVIEW':
        return 'info';
      case 'DECLINED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle color="success" fontSize="small" />;
      case 'PENDING':
        return <Schedule color="warning" fontSize="small" />;
      case 'UNDER_REVIEW':
        return <Schedule color="info" fontSize="small" />;
      case 'DECLINED':
        return <Cancel color="error" fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          HR Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage NSP appointments, permissions, and operations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary.main">
                    {dashboardData.stats.totalNSPs}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total NSPs
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    {dashboardData.stats.activeNSPs} active
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Assignment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {dashboardData.stats.pendingApplications}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Applications
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    +{dashboardData.stats.approvedThisMonth} this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EventNote sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h4" color="info.main">
                    {dashboardData.stats.permissionRequests}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Permission Requests
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Awaiting review
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success.main">
                    {dashboardData.stats.monthlyReportsDue}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reports Due
                  </Typography>
                  <Typography variant="caption" color="warning.main">
                    This month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        border: action.urgent ? '2px solid' : '1px solid',
                        borderColor: action.urgent ? 'error.main' : 'divider',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                      onClick={action.action}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Box sx={{ mr: 2 }}>{action.icon}</Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {action.title}
                            {action.urgent && (
                              <Warning sx={{ ml: 1, fontSize: 16, color: 'error.main' }} />
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Recent Applications
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/hr/appointments')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Applicant</TableCell>
                      <TableCell>Program</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.recentApplications.map((application) => (
                      <TableRow key={application.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                              {application.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {application.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {application.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {application.program}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(application.status)}
                            label={application.status.replace('_', ' ')}
                            color={getStatusColor(application.status) as any}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(application.submittedAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => navigate(`/hr/appointments/${application.id}`)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Urgent Tasks */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Warning color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Urgent Tasks
              </Typography>
              <List dense>
                {dashboardData.upcomingTasks.map((task, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Warning color={getPriorityColor(task.priority) as any} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.task}
                      secondary={`Due: ${task.dueDate}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <Chip
                      label={task.priority}
                      size="small"
                      color={getPriorityColor(task.priority) as any}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List dense>
                {dashboardData.recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Alerts
              </Typography>
              {dashboardData.stats.pendingApplications > 5 && (
                <Alert severity="warning" sx={{ mb: 1 }}>
                  {dashboardData.stats.pendingApplications} applications need immediate review
                </Alert>
              )}
              {dashboardData.stats.complaintsOpen > 0 && (
                <Alert severity="info" sx={{ mb: 1 }}>
                  {dashboardData.stats.complaintsOpen} open complaints require attention
                </Alert>
              )}
              {dashboardData.stats.monthlyReportsDue > 10 && (
                <Alert severity="warning">
                  {dashboardData.stats.monthlyReportsDue} monthly reports are overdue
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HRDashboard;