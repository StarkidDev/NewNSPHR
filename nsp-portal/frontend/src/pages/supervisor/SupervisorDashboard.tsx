import React, { useState } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent, Button, List,
  ListItem, ListItemText, ListItemAvatar, Avatar, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, LinearProgress, Alert, Divider
} from '@mui/material';
import {
  Dashboard, People, Assessment, EventNote, TrendingUp, Warning,
  CheckCircle, Schedule, Visibility, Edit, Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();

  const dashboardData = {
    assignedNSPs: [
      {
        id: 1, name: 'John Doe', department: 'Engineering', 
        performance: 85, attendance: 95, status: 'ACTIVE',
        lastReport: '2024-01-30', nextEvaluation: '2024-02-15'
      },
      {
        id: 2, name: 'Jane Smith', department: 'Engineering',
        performance: 92, attendance: 98, status: 'ACTIVE', 
        lastReport: '2024-01-28', nextEvaluation: '2024-02-12'
      },
    ],
    pendingTasks: [
      { task: 'Review John Doe monthly report', type: 'report', dueDate: '2024-02-05', priority: 'high' },
      { task: 'Complete Jane Smith evaluation', type: 'evaluation', dueDate: '2024-02-12', priority: 'medium' },
      { task: 'Approve permission request', type: 'permission', dueDate: '2024-02-03', priority: 'high' },
    ],
    stats: {
      totalNSPs: 2, activeNSPs: 2, pendingReports: 1, overdueEvaluations: 0,
      permissionRequests: 1, averagePerformance: 88.5, attendanceRate: 96.5
    },
    recentActivities: [
      { message: 'John Doe submitted monthly report', time: '2 hours ago' },
      { message: 'Jane Smith requested permission', time: '1 day ago' },
      { message: 'Completed evaluation for Mike Johnson', time: '3 days ago' },
    ]
  };

  const quickActions = [
    {
      title: 'Review Reports', description: `${dashboardData.stats.pendingReports} reports pending`,
      icon: <Assessment color="primary" />, action: () => navigate('/supervisor/reports'),
      urgent: dashboardData.stats.pendingReports > 0
    },
    {
      title: 'Conduct Evaluations', description: 'Performance evaluations',
      icon: <Star color="warning" />, action: () => navigate('/supervisor/evaluations')
    },
    {
      title: 'Approve Permissions', description: `${dashboardData.stats.permissionRequests} requests`,
      icon: <EventNote color="info" />, action: () => navigate('/supervisor/permissions'),
      urgent: dashboardData.stats.permissionRequests > 0
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'success';
    if (performance >= 75) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <Dashboard sx={{ mr: 1, verticalAlign: 'middle' }} />
          Supervisor Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor and evaluate your assigned National Service Personnel
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
                  <Typography variant="h4" color="primary.main">{dashboardData.stats.totalNSPs}</Typography>
                  <Typography variant="body2" color="text.secondary">Assigned NSPs</Typography>
                  <Typography variant="caption" color="success.main">{dashboardData.stats.activeNSPs} active</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Assessment sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" color="warning.main">{dashboardData.stats.pendingReports}</Typography>
                  <Typography variant="body2" color="text.secondary">Pending Reports</Typography>
                  <Typography variant="caption" color="text.secondary">Need review</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" color="success.main">{dashboardData.stats.averagePerformance}%</Typography>
                  <Typography variant="body2" color="text.secondary">Avg Performance</Typography>
                  <Typography variant="caption" color="success.main">Excellent</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <CheckCircle sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h4" color="info.main">{dashboardData.stats.attendanceRate}%</Typography>
                  <Typography variant="body2" color="text.secondary">Attendance Rate</Typography>
                  <Typography variant="caption" color="success.main">Excellent</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Card sx={{ cursor: 'pointer', border: action.urgent ? '2px solid' : '1px solid',
                      borderColor: action.urgent ? 'error.main' : 'divider',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 } }}
                      onClick={action.action}>
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        {action.icon}
                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                          {action.title}
                          {action.urgent && <Warning sx={{ ml: 1, fontSize: 16, color: 'error.main' }} />}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Assigned NSPs */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assigned NSPs</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>NSP</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Performance</TableCell>
                      <TableCell>Attendance</TableCell>
                      <TableCell>Last Report</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData.assignedNSPs.map((nsp) => (
                      <TableRow key={nsp.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>{nsp.name.charAt(0)}</Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">{nsp.name}</Typography>
                              <Chip label={nsp.status} color="success" size="small" />
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{nsp.department}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LinearProgress variant="determinate" value={nsp.performance}
                              color={getPerformanceColor(nsp.performance)} sx={{ width: 60, mr: 1 }} />
                            <Typography variant="caption">{nsp.performance}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={nsp.attendance >= 95 ? 'success.main' : 'warning.main'}>
                            {nsp.attendance}%
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{new Date(nsp.lastReport).toLocaleDateString()}</Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small"><Visibility fontSize="small" /></IconButton>
                          <IconButton size="small"><Edit fontSize="small" /></IconButton>
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
          {/* Pending Tasks */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Warning color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pending Tasks
              </Typography>
              <List dense>
                {dashboardData.pendingTasks.map((task, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemText
                      primary={task.task}
                      secondary={`Due: ${task.dueDate}`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <Chip label={task.priority} size="small" color={getPriorityColor(task.priority) as any} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activities</Typography>
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
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupervisorDashboard;