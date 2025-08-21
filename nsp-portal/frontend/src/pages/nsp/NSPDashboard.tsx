import React, { useEffect } from 'react';
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
} from '@mui/material';
import {
  Dashboard,
  EventNote,
  Assessment,
  Assignment,
  Message,
  Notifications,
  Person,
  CalendarToday,
  TrendingUp,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const NSPDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // Mock data - in real app, this would come from API
  const dashboardData = {
    profile: {
      completionPercentage: 85,
      department: 'Engineering & Operations',
      supervisor: 'Dr. Samuel Mensah',
      serviceStartDate: '2024-01-15',
      serviceEndDate: '2024-12-14',
    },
    stats: {
      monthlyReportsSubmitted: 3,
      monthlyReportsTotal: 4,
      permissionRequestsPending: 1,
      permissionRequestsApproved: 2,
    },
    recentActivities: [
      { type: 'report', message: 'Monthly report for March submitted', date: '2024-03-28' },
      { type: 'permission', message: 'Permission request approved', date: '2024-03-25' },
      { type: 'evaluation', message: 'Performance evaluation received', date: '2024-03-20' },
    ],
    upcomingTasks: [
      { task: 'Submit April monthly report', dueDate: '2024-04-30', priority: 'high' },
      { task: 'Complete mid-term evaluation', dueDate: '2024-05-15', priority: 'medium' },
      { task: 'Attend NSP training session', dueDate: '2024-05-10', priority: 'low' },
    ],
    announcements: [
      {
        title: 'NSP Training Session',
        message: 'Mandatory training session scheduled for May 10, 2024.',
        type: 'info',
      },
      {
        title: 'Monthly Report Deadline',
        message: 'April monthly reports are due by April 30, 2024.',
        type: 'warning',
      },
    ],
  };

  const quickActions = [
    {
      title: 'Request Permission',
      description: 'Submit a new permission/off-duty request',
      icon: <EventNote color="primary" />,
      action: () => navigate('/nsp/permissions'),
      color: 'primary',
    },
    {
      title: 'Monthly Report',
      description: 'Submit your monthly activity report',
      icon: <Assessment color="success" />,
      action: () => navigate('/nsp/reports'),
      color: 'success',
    },
    {
      title: 'File Complaint',
      description: 'Submit a complaint or feedback',
      icon: <Assignment color="warning" />,
      action: () => navigate('/nsp/complaints'),
      color: 'warning',
    },
    {
      title: 'Messages',
      description: 'View and send internal messages',
      icon: <Message color="info" />,
      action: () => navigate('/messages'),
      color: 'info',
    },
  ];

  const getServiceProgress = () => {
    const start = new Date(dashboardData.profile.serviceStartDate);
    const end = new Date(dashboardData.profile.serviceEndDate);
    const now = new Date();
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          Welcome, {user?.first_name || 'NSP'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your National Service activities and stay updated with GNPC
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Person color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Service Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Department
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dashboardData.profile.department}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    Supervisor
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {dashboardData.profile.supervisor}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Service Progress ({Math.round(getServiceProgress())}% Complete)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getServiceProgress()}
                    sx={{ height: 8, borderRadius: 4, mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption">
                      Started: {formatDate(dashboardData.profile.serviceStartDate)}
                    </Typography>
                    <Typography variant="caption">
                      Ends: {formatDate(dashboardData.profile.serviceEndDate)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main">
                  {dashboardData.stats.monthlyReportsSubmitted}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Reports Submitted
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="success.main">
                  {dashboardData.stats.permissionRequestsApproved}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Permissions Approved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {dashboardData.stats.permissionRequestsPending}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pending Requests
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {Math.round(dashboardData.profile.completionPercentage)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Profile Complete
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Card>
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
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 3,
                        },
                      }}
                      onClick={action.action}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                        <Box sx={{ mr: 2 }}>{action.icon}</Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            {action.title}
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
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Tasks */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CalendarToday color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Upcoming Tasks
              </Typography>
              <List dense>
                {dashboardData.upcomingTasks.map((task, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Warning color={getPriorityColor(task.priority) as any} fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.task}
                      secondary={`Due: ${formatDate(task.dueDate)}`}
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

          {/* Announcements */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Notifications color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Announcements
              </Typography>
              {dashboardData.announcements.map((announcement, index) => (
                <Alert
                  key={index}
                  severity={announcement.type as any}
                  sx={{ mb: 1 }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    {announcement.title}
                  </Typography>
                  <Typography variant="body2">
                    {announcement.message}
                  </Typography>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TrendingUp color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Activities
              </Typography>
              <List dense>
                {dashboardData.recentActivities.map((activity, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={activity.message}
                      secondary={formatDate(activity.date)}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NSPDashboard;