import React, {useState} from 'react';
import {Avatar, Box, Button, Container, CssBaseline, Link, TextField, Typography,} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import apiService from "../api/apiService.js";

const defaultTheme = createTheme();

export default function RegistrationPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        try {
            await apiService.post('/api/auth/register', {
                username,
                password,
            });
            setSuccess('Registration successful! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError('Registration failed. The username may already be taken.');
            console.error('Registration error:', err);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                        {success && (
                            <Typography color="primary" variant="body2" align="center" sx={{ mt: 1 }}>
                                {success}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
