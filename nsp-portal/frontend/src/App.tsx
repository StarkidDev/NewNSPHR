import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import AppointmentSubmissionPage from './pages/public/AppointmentSubmissionPage';
import StatusCheckPage from './pages/public/StatusCheckPage';
import LoginPage from './pages/public/LoginPage';

// Protected Pages
import NSPDashboard from './pages/nsp/NSPDashboard';
import HRDashboard from './pages/hr/HRDashboard';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';

// Permission Pages
import PermissionRequestPage from './pages/nsp/PermissionRequestPage';
import PermissionReviewPage from './pages/hr/PermissionReviewPage';

// Report Pages
import MonthlyReportPage from './pages/nsp/MonthlyReportPage';
import EvaluationPage from './pages/supervisor/EvaluationPage';

// Communication Pages
import ComplaintsPage from './pages/nsp/ComplaintsPage';
import MessagesPage from './pages/common/MessagesPage';

// HR Management Pages
import AppointmentManagementPage from './pages/hr/AppointmentManagementPage';
import NSPManagementPage from './pages/hr/NSPManagementPage';

// Auth Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // GNPC Blue
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#f57c00', // GNPC Orange
      light: '#ffb74d',
      dark: '#e65100',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/submit-appointment" element={<AppointmentSubmissionPage />} />
                <Route path="/check-status" element={<StatusCheckPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* NSP Routes */}
                <Route
                  path="/nsp/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['NSP']}>
                      <NSPDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nsp/permissions"
                  element={
                    <ProtectedRoute allowedRoles={['NSP']}>
                      <PermissionRequestPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nsp/reports"
                  element={
                    <ProtectedRoute allowedRoles={['NSP']}>
                      <MonthlyReportPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/nsp/complaints"
                  element={
                    <ProtectedRoute allowedRoles={['NSP']}>
                      <ComplaintsPage />
                    </ProtectedRoute>
                  }
                />

                {/* HR Routes */}
                <Route
                  path="/hr/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                      <HRDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hr/appointments"
                  element={
                    <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                      <AppointmentManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hr/nsps"
                  element={
                    <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                      <NSPManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/hr/permissions"
                  element={
                    <ProtectedRoute allowedRoles={['HR', 'ADMIN']}>
                      <PermissionReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* Supervisor Routes */}
                <Route
                  path="/supervisor/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                      <SupervisorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supervisor/evaluations"
                  element={
                    <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                      <EvaluationPage />
                    </ProtectedRoute>
                  }
                />

                {/* Common Routes */}
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute allowedRoles={['NSP', 'HR', 'SUPERVISOR', 'ADMIN']}>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;