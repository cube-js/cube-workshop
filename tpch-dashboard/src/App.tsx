import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Box,
  Container,
  IconButton,
  Link
} from '@mui/material';
import { GitHub, Description } from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Main app component that handles authentication state
const AppContent: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />

      <main>
        <ErrorBoundary>
          <Dashboard />
        </ErrorBoundary>
      </main>

      <Box 
        component="footer" 
        sx={{ 
          bgcolor: 'background.paper', 
          py: 3, 
          mt: 6,
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <IconButton 
              color="primary" 
              href="https://cube.dev/docs" 
              target="_blank"
              title="Cube Documentation"
              size="small"
            >
              <Description />
            </IconButton>
            <IconButton 
              color="primary" 
              href="https://github.com/cube-js/cube" 
              target="_blank"
              title="Cube on GitHub"
              size="small"
            >
              <GitHub />
            </IconButton>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="https://cube.dev" target="_blank" color="primary" sx={{ mr: 1 }}>
              Cube
            </Link>
            •
            <Link href="https://react.dev" target="_blank" color="primary" sx={{ mx: 1 }}>
              React
            </Link>
            •
            <Link href="https://mui.com" target="_blank" color="primary" sx={{ mx: 1 }}>
              Material-UI
            </Link>
            •
            <Link href="https://chartjs.org" target="_blank" color="primary" sx={{ ml: 1 }}>
              Chart.js
            </Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;