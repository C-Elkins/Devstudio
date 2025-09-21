import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Switch, 
  FormControlLabel,
  Button,
  Chip,
  Grid,
  Paper,
  Alert,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  IconButton
} from '@mui/material';
import { 
  PlayArrow, 
  Stop, 
  Storage, 
  Computer, 
  Settings, 
  ViewList,
  GitHub,
  Folder,
  Launch
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ServiceCard({ title, icon, isRunning, onToggle, description }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {icon}
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip 
            label={isRunning ? 'Running' : 'Stopped'} 
            color={isRunning ? 'success' : 'default'}
            size="small"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isRunning}
                onChange={onToggle}
                color="primary"
              />
            }
            label=""
          />
        </Box>
      </CardContent>
    </Card>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [services, setServices] = useState({
    backend: { running: false, loading: false },
    frontend: { running: false, loading: false },
    database: { running: false, loading: false },
    api: { running: false, loading: false }
  });
  const [logs, setLogs] = useState([]);
  const [gitInfo, setGitInfo] = useState('API Offline');
  const [apiConnected, setApiConnected] = useState(false);
  // const [isLoading, setIsLoading] = useState(true); // not used; keep if needed later

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
  };

  // Check if API server is available
  const checkApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/services/status', {
        timeout: 5000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        if (!apiConnected) {
          addLog('API server connected');
        }
        setApiConnected(true);
        return true;
      }
    } catch (error) {
      if (apiConnected) {
        addLog('API server disconnected: ' + error.message);
      }
      console.log('API Connection Error:', error.message);
      setApiConnected(false);
    }
    return false;
  };

  // Fetch service status with graceful degradation
  const fetchServiceStatus = async () => {
    if (await checkApiConnection()) {
      try {
        const response = await fetch('http://localhost:3001/api/services/status');
        const data = await response.json();
        
        setServices({
          backend: { running: data.backend?.running || false, loading: false },
          frontend: { running: data.frontend?.running || false, loading: false },
          database: { running: data.database?.running || false, loading: false },
          api: { running: data.api?.running || false, loading: false }
        });

        setGitInfo(data.git || 'Unknown');
        addLog(`Status updated: Backend ${data.backend?.running ? 'ON' : 'OFF'}, Frontend ${data.frontend?.running ? 'ON' : 'OFF'}, Database ${data.database?.running ? 'ON' : 'OFF'}, API ${data.api?.running ? 'ON' : 'OFF'}`);
      } catch (error) {
        addLog('Error fetching service status: ' + error.message);
        setApiConnected(false);
      }
    } else {
      addLog('API server offline - Control Center running in display-only mode');
    }
  };

  // Handle service toggle with API check
  const handleServiceToggle = async (service) => {
    // Special handling for API server
    if (service === 'api' && !apiConnected) {
      addLog('❌ Cannot start API server remotely when offline.');
      addLog('💡 To restart: Open terminal and run: cd control-center && node server.js');
      return;
    }

    if (service === 'api' && services.api.running) {
      const confirmed = window.confirm(
        '⚠️ WARNING: Stopping the API server will disable all service controls in this Control Center.\n\n' +
        'You will need to manually restart it from the terminal with:\n' +
        'cd control-center && node server.js\n\n' +
        'Are you sure you want to stop the API server?'
      );
      
      if (!confirmed) {
        addLog('API server stop cancelled by user');
        return;
      }
    }

    if (!apiConnected) {
      addLog('Cannot control services - API server is offline');
      return;
    }

    setServices(prev => ({
      ...prev,
      [service]: { ...prev[service], loading: true }
    }));

    addLog(`${services[service].running ? 'Stopping' : 'Starting'} ${service}...`);

    try {
      const action = services[service].running ? 'stop' : 'start';
      const response = await fetch(`http://localhost:3001/api/services/${service}/${action}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success) {
        addLog(`${service} ${action}ed successfully: ${data.message}`);
        // Refresh status after action
        setTimeout(fetchServiceStatus, 1000);
      } else {
        addLog(`Failed to ${action} ${service}: ${data.message}`);
      }
    } catch (error) {
      addLog(`Error ${services[service].running ? 'stopping' : 'starting'} ${service}: ${error.message}`);
      setApiConnected(false);
    } finally {
      setServices(prev => ({
        ...prev,
        [service]: { ...prev[service], loading: false }
      }));
    }
  };

  // Check API connection on mount and set up polling
  useEffect(() => {
    const initAndPoll = async () => {
      addLog('Control Center started');
      await fetchServiceStatus();
      
      // Poll for status every 30 seconds (reduced frequency)
      const interval = setInterval(() => {
        fetchServiceStatus();
      }, 30000);
      
      return () => clearInterval(interval);
    };

    const cleanup = initAndPoll();
    return () => cleanup;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Computer color="inherit" />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                DevStudio Control Center
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={apiConnected ? 'API Connected' : 'API Offline'} 
                color={apiConnected ? 'success' : 'warning'}
                size="small"
              />
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Git: {gitInfo}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
            <Tab label="Services" />
            <Tab label="Admin" />
            <Tab label="Settings" />
            <Tab label="Logs" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
              Service Management
            </Typography>
            
            {!apiConnected && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>API Server Offline:</strong> The Control Center interface is running, but service controls are disabled. 
                  Start the API server to enable service management features.
                  <br />
                  <small>Debug: Last status check at {new Date().toLocaleTimeString()}</small>
                </Typography>
              </Alert>
            )}

            {apiConnected && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>API Server Online:</strong> All service controls are active.
                  <br />
                  <small>Connected at {new Date().toLocaleTimeString()}</small>
                </Typography>
              </Alert>
            )}
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} lg={3}>
                <ServiceCard
                  title="Backend Server"
                  icon={<Computer sx={{ fontSize: 40 }} />}
                  isRunning={services.backend.running}
                  onToggle={() => handleServiceToggle('backend')}
                  description="Node.js API server with Express and MongoDB integration"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ServiceCard
                  title="Frontend App"
                  icon={<Launch sx={{ fontSize: 40 }} />}
                  isRunning={services.frontend.running}
                  onToggle={() => handleServiceToggle('frontend')}
                  description="React development server with Vite bundling"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ServiceCard
                  title="Database"
                  icon={<Storage sx={{ fontSize: 40 }} />}
                  isRunning={services.database.running}
                  onToggle={() => handleServiceToggle('database')}
                  description="MongoDB database server for data persistence"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <ServiceCard
                  title="API Server"
                  icon={<Settings sx={{ fontSize: 40 }} />}
                  isRunning={services.api.running}
                  onToggle={() => handleServiceToggle('api')}
                  description="Control Center API for service management"
                />
              </Grid>
            </Grid>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography>Admin Panel - Coming Soon</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography>Settings - Coming Soon</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">
                System Logs
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<ViewList />}
                onClick={() => setLogs([])}
              >
                Clear Logs
              </Button>
            </Box>
            
            {!apiConnected && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                API server is offline. Service controls are disabled but the Control Center interface is fully functional.
              </Alert>
            )}
            
            <Paper sx={{ p: 2, bgcolor: 'grey.900', minHeight: 400 }}>
              <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'grey.100' }}>
                {logs.length === 0 ? (
                  <Typography color="grey.400">No logs to display</Typography>
                ) : (
                  logs.map((log, index) => (
                    <Box key={index} sx={{ mb: 0.5, wordBreak: 'break-all' }}>
                      {log}
                    </Box>
                  ))
                )}
              </Box>
            </Paper>
          </Box>
        </TabPanel>
      </Box>
    </ThemeProvider>
  );
}

export default App;