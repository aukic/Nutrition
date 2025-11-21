import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    TextField, Button, Box, CircularProgress, Alert, Stack, Typography,
    Paper, Autocomplete
} from '@mui/material';
import apiService from '../api/apiService';
import PageLayout from '../components/PageLayout';

export default function MealDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    // --- STATE MANAGEMENT ---
    // Form State
    const [mealName, setMealName] = useState('');
    const [selectedDishes, setSelectedDishes] = useState([]); // Holds the full dish objects for the form

    // Master Data & Control State
    const [allDishes, setAllDishes] = useState([]); // Holds all possible dishes for the dropdown
    const [isEditing, setIsEditing] = useState(isNew);
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState('');

    // --- DATA FETCHING ---
    useEffect(() => {
        // We need to fetch two sets of data:
        // 1. All dishes available, to populate the Autocomplete dropdown.
        // 2. The specific meal's data, if we are editing.
        const fetchAllDishes = apiService.get('/api/dishes?size=2000'); // Get all dishes
        const fetchMeal = isNew ? Promise.resolve(null) : apiService.get(`/api/meals/${id}`);

        setLoading(true);
        Promise.all([fetchAllDishes, fetchMeal])
            .then(([dishesResponse, mealResponse]) => {
                // Populate the dropdown options
                setAllDishes(dishesResponse.data.content || []);

                // If we are editing, populate the form with the meal's data
                if (mealResponse) {
                    const mealData = mealResponse.data;
                    setMealName(mealData.name);
                    // The Autocomplete component works best with the full objects
                    setSelectedDishes(mealData.dishes);
                }
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
                setError('Failed to load required data. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, isNew]);

    // --- EVENT HANDLERS ---
    const handleSubmit = async () => {
        if (!mealName) {
            setError('Meal name is required.');
            return;
        }

        // The backend expects a list of dish IDs, not the full objects.
        const payload = {
            name: mealName,
            dishIds: selectedDishes.map(dish => dish.id)
        };

        try {
            if (isNew) {
                await apiService.post('/api/meals', payload);
            } else {
                await apiService.put(`/api/meals/${id}`, payload);
            }
            navigate('/meals'); // Redirect to the list page on success
        } catch (err) {
            console.error("Failed to save meal:", err);
            setError('An error occurred while saving the meal. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (globalThis.confirm('Are you sure you want to delete this meal?')) {
            try {
                await apiService.delete(`/api/meals/${id}`);
                navigate('/meals');
            } catch (err) {
                console.error("Failed to delete meal:", err);
                setError('Failed to delete the meal.');
            }
        }
    };

    // --- DYNAMIC UI DEFINITIONS ---
    const pageTitle = isNew ? 'Kreiraj novi obrok' : 'Obrok';
    const breadcrumbs = [{ label: 'Obroci', to: '/meals' }, { label: isNew ? 'Novi' : mealName || '...' }];
    const headerButtons = isEditing ? (
        <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>{isNew ? 'Kreiraj obrok' : 'Spremi promjene'}</Button>
            {!isNew && <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false) /* Add cancel logic here if needed */}>Cancel</Button>}
        </Stack>
    ) : (
        <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setIsEditing(true)}>Ažuriraj</Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>Obriši</Button>
        </Stack>
    );

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

    return (
        <PageLayout title={pageTitle} breadcrumbs={breadcrumbs} headerButtons={headerButtons}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper sx={{ p: 3, mt: 2 }}>
                <Stack spacing={4}>
                    {/* Section 1: Meal Information */}
                    <Box>
                        <Typography variant="h6" gutterBottom>Informacije o oborku</Typography>
                        <TextField
                            fullWidth
                            required
                            label="Naziv obroka"
                            value={mealName}
                            onChange={(e) => setMealName(e.target.value)}
                            disabled={!isEditing}
                        />
                    </Box>

                    {/* Section 2: Dishes in Meal */}
                    <Box>
                        <Typography variant="h6" gutterBottom>Jela u obroku</Typography>
                        <Autocomplete
                            multiple
                            id="dishes-autocomplete"
                            options={allDishes}
                            getOptionLabel={(option) => option.name}
                            value={selectedDishes}
                            onChange={(event, newValue) => {
                                setSelectedDishes(newValue);
                            }}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            disabled={!isEditing}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Odaberite jela"
                                    placeholder={selectedDishes.length > 0 ? '' : 'Odaberite jela...'}
                                />
                            )}
                        />
                    </Box>
                </Stack>
            </Paper>
        </PageLayout>
    );
}
