import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { TOKEN_KEY } from '@/constants';

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [err, setErr] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isAuthed = localStorage.getItem(TOKEN_KEY);

    if (isAuthed) {
      navigate('/admin', { replace: true, state: { from: location } });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      await login(credentials);
      navigate('/admin/products');
    } catch (err) {
      setErr('Email atau password salah');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <h1 style={{ fontSize: '2.5rem', marginBottom: 16 }}>Login Admin</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
        }}
      >
        {err && (
          <Typography color="error" align="center" mb={2}>
            {err}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          margin="normal"
          required
        />

        <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 3, background: '#1876D2' }}>
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
