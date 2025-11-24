import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';

// Import Components
import Sidebar from './components/Sidebar';

// Import Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import IngredientListPage from './pages/IngredientListPage';
import IngredientDetailPage from './pages/IngredientDetailPage';
import DishListPage from './pages/DishListPage';
import DishDetailPage from './pages/DishDetailPage';
import WeeklyPlanPage from "./pages/WeekyPlanPage.jsx";
import MealListPage from "./pages/MealListPage.jsx";
import MealDetailPage from "./pages/MealDetailPage.jsx";

function App() {
    // 1. Use React state to manage authentication.
    // Initialize state from localStorage so it persists on refresh.
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));

    // 2. Create a handler that LoginPage can call.
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    // (Optional but good practice) Create a logout handler for future use
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        // You would call this from a "Logout" button, for example
    };

    return (
        <BrowserRouter>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

                {/* 3. Render the sidebar based on the REACT STATE, not the raw localStorage check. */}
                {isAuthenticated && <Sidebar />}

                {/* 4. Ensure the main content area can grow to fill the space. */}
                <Box component="main" sx={{ flexGrow: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Routes>
                        {/* 5. Pass the handleLoginSuccess function as a prop to LoginPage. */}
                        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
                        <Route path="/register" element={<RegistrationPage />} />

                        {/* Add the new Home route */}
                        <Route path="/home" element={<HomePage />} />

                        {/* Feature Routes */}
                        <Route path="/ingredients" element={<IngredientListPage />} />
                        <Route path="/ingredients/:id" element={<IngredientDetailPage />} />
                        <Route path="/dishes" element={<DishListPage />} />
                        <Route path="/dishes/:id" element={<DishDetailPage />} />
                        <Route path="/meals" element={<MealListPage />} />
                        <Route path="/meals/:id" element={<MealDetailPage />} />
                        <Route path="/weekly-plan" element={<WeeklyPlanPage />} />

                        {/* 6. Update the default route to redirect based on the new state. */}
                        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
                    </Routes>
                </Box>
            </Box>
        </BrowserRouter>
    );
}

export default App;
