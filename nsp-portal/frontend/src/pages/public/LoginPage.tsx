import React, { useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { Login as LoginIcon, Person, Lock, Info } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store/store';
import { login, clearError, fetchUserProfile } from '../../store/slices/authSlice';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

type FormData = {
  username: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || getDashboardPath(user.user_type);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const getDashboardPath = (userType: string) => {
    switch (userType) {
      case 'NSP':
        return '/nsp/dashboard';
      case 'HR':
      case 'ADMIN':
        return '/hr/dashboard';
      case 'SUPERVISOR':
        return '/supervisor/dashboard';
      default:
        return '/';
    }
  };

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(login(data) as any);
    
    if (login.fulfilled.match(result)) {
      // Fetch user profile after successful login
      await dispatch(fetchUserProfile() as any);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                p: 2,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                color: 'white',
                mb: 2,
              }}
            >
              <LoginIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
              NSP Portal Login
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access your personalized dashboard
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3 }}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Username"
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: <Lock sx={{ color: 'text.secondary', mr: 1 }} />,
                    }}
                  />
                )}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
              sx={{ mb: 3 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Don't have an account?
            </Typography>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/submit-appointment')}
              sx={{ textDecoration: 'none' }}
            >
              Submit your NSS appointment letter to get started
            </Link>
          </Box>
        </Paper>

        {/* Information Cards */}
        <Box sx={{ mt: 4, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Info color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                For NSPs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                After your appointment is approved, you'll receive login credentials via email. 
                Use them to access your dashboard, submit reports, and request permissions.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Info color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
                For Staff
              </Typography>
              <Typography variant="body2" color="text.secondary">
                HR personnel and supervisors should use their assigned credentials. 
                Contact the IT department if you need assistance with your account.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact{' '}
            <Link href="mailto:hr@gnpcghana.com" color="primary">
              hr@gnpcghana.com
            </Link>{' '}
            or{' '}
            <Link href="tel:+233302666000" color="primary">
              +233 (0) 302 666 000
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;