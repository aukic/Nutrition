import React, { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, Paper, Button, IconButton, Dialog, DialogTitle, DialogContent, Autocomplete, TextField } from '@mui/material';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday } from 'date-fns';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

import PageLayout from '../components/PageLayout';
import apiService from '../api/apiService';


export default function WeeklyPlanPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [weekPlan, setWeekPlan] = useState({});
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [allMeals, setAllMeals] = useState([]);
    const [mealToAdd, setMealToAdd] = useState(null);

    const fetchWeekPlan = useCallback(() => {
        setLoading(true);
        const dateString = format(currentDate, 'yyyy-MM-dd');
        apiService.get(`/api/weekly-plan?date=${dateString}`)
            .then(response => {
                const groupedByDate = response.data.reduce((acc, entry) => {
                    const dateKey = entry.date;

                    if (!acc[dateKey]) {
                        acc[dateKey] = [];
                    }

                    acc[dateKey].push(entry);

                    return acc;
                }, {});
                setWeekPlan(groupedByDate);
            })
            .catch(err => console.error("Failed to fetch week plan", err))
            .finally(() => setLoading(false));
    }, [currentDate]);

    useEffect(() => {
        fetchWeekPlan();
    }, [fetchWeekPlan]);

    const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
    const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleOpenDialog = (date) => {
        setSelectedDate(date);
        if (allMeals.length === 0) {
            apiService.get('/api/meals?size=2000').then(res => setAllMeals(res.data.content));
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setMealToAdd(null);
    };

    const handleAddMeal = () => {
        if (!mealToAdd || !selectedDate) return;
        const payload = {
            date: format(selectedDate, 'yyyy-MM-dd'),
            mealId: mealToAdd.id
        };
        apiService.post('/api/weekly-plan', payload).then(() => {
            fetchWeekPlan();
            handleCloseDialog();
        });
    };

    const handleRemoveMeal = (planId) => {
        if (globalThis.confirm('Remove this meal from the plan?')) {
            apiService.delete(`/api/weekly-plan/${planId}`).then(() => fetchWeekPlan());
        }
    };

    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i));
    const weekRange = `${format(weekDays[0], 'MMMM d')} - ${format(weekDays[6], 'MMMM d, yyyy')}`;

    return (
        <PageLayout title="Tjedni plan" breadcrumbs={[{ label: 'Tjedni plan' }]}>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">{weekRange}</Typography>
                <Box>
                    <Button onClick={handlePrevWeek} startIcon={<ChevronLeftIcon />}>Prethodni tjedan</Button>
                    <Button onClick={handleToday} variant="outlined" sx={{ mx: 1 }}>Danas</Button>
                    <Button onClick={handleNextWeek} endIcon={<ChevronRightIcon />}>Sljedeći tjedan</Button>
                </Box>
            </Box>

            <Grid container spacing={1}>
                {weekDays.map(day => {
                    const dateKey = format(day, 'yyyy,MM,dd');

                    const mealsForDay = weekPlan[dateKey] || [];

                    return (
                        <Grid item xs={12} md={12/7} key={dateKey}>
                            <Paper sx={{ p: 1, minHeight: '200px', display: 'flex', flexDirection: 'column', borderTop: isToday(day) ? '3px solid #1976d2' : 'none' }}>
                                <Typography variant="subtitle1" align="center" fontWeight="bold">{format(day, 'EEEE')}</Typography>
                                <Typography variant="body2" align="center" color="text.secondary" mb={1}>{format(day, 'd')}</Typography>

                                <Box sx={{ flexGrow: 1 }}>
                                    {mealsForDay.map(entry => (
                                        <Paper key={entry.id} elevation={2} sx={{ p: 1, my: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2">{entry.mealName}</Typography>
                                            <IconButton size="small" onClick={() => handleRemoveMeal(entry.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </Paper>
                                    ))}
                                    {loading && <CircularProgress size={20} />}
                                </Box>

                                <Button fullWidth startIcon={<AddCircleIcon />} onClick={() => handleOpenDialog(day)} sx={{ mt: 'auto' }}>
                                    Dodaj obrok
                                </Button>
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth>
                <DialogTitle>Dodaj obrok za {selectedDate && format(selectedDate, 'EEEE, MMMM d')}</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={allMeals}
                        getOptionLabel={(option) => option.name}
                        value={mealToAdd}
                        onChange={(e, newValue) => setMealToAdd(newValue)}
                        renderInput={(params) => <TextField {...params} label="Odaberite obrok" margin="normal" />}
                    />
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button onClick={handleCloseDialog}>Odustani</Button>
                        <Button onClick={handleAddMeal} variant="contained" sx={{ ml: 1 }}>Dodaj</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </PageLayout>
    );
}
