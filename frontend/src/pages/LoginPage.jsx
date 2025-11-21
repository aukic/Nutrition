import {useState} from "react";
import {Avatar, Box, Button, Container, CssBaseline, Link, TextField, Typography,} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import apiService from "../api/apiService.js";
import {useNavigate} from "react-router-dom";

const defaultTheme = createTheme();
export const LoginPage = ({onLoginSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await apiService.post('/api/auth/authenticate', {
                username,
                password,
            });
            const { jwt } = response.data;
            localStorage.setItem('jwtToken', jwt);
            onLoginSuccess();
            navigate('/home');
        } catch (err) {
            setError('Invalid username or password.');
            console.error('Authentication error:', err);
        }
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <h1>Sign in - FINAL TEST 123</h1>
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
                        Sign in
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
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && (
                            <Typography color="error" variant="body2" align="center">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Link href="/register" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}
