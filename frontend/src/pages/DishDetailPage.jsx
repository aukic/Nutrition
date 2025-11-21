import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import apiService from '../api/apiService';
import PageLayout from '../components/PageLayout';

const NUTRIENT_FIELDS = [
    {
        key: 'energyKj',
        label: 'KJ'
    },
    {
        key: 'energyKcal',
        label: 'Kcal'
    },
    {
        key: 'carbohydrates',
        label: 'Ugljikohidrati (g)'
    },
    {
        key: 'protein',
        label: 'Proteini (g)'
    },
    {
        key: 'fat',
        label: 'Mast (g)'
    },
    {
        key: 'sugars',
        label: 'Šećeri (g)'
    },
    {
        key: 'fiber',
        label: 'Vlakna (g)'
    },
    {
        key: 'water',
        label: 'Voda (ml)'
    },
    ];

const formatNutrientLabel = (fieldName) => {
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace('Kcal', '(kcal)')
        .replace('Kj', '(kJ)')
        .replace(/Mg|Mcg/g, '')
        .replace(/\b\w/g, l => l.toUpperCase());
};

export default function DishDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    // Form State
    const [dishName, setDishName] = useState('');
    const [ingredientsInDish, setIngredientsInDish] = useState([]); // [{ ingredientId, ingredientName, weightInGrams }]

    // Master Data & Control State
    const [allIngredients, setAllIngredients] = useState([]); // For the dropdown
    const [isEditing, setIsEditing] = useState(isNew);
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState('');

    // State for the "Add Ingredient" form
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [currentWeight, setCurrentWeight] = useState('');

    const [editingIngredientId, setEditingIngredientId] = useState(null); // Tracks which ingredient is being edited
    const [editingWeight, setEditingWeight] = useState('');
    // Fetch Dish details and the full ingredient list
    useEffect(() => {
        const fetchAllIngredients = apiService.get('/api/ingredients?size=2000'); // Fetch all for dropdown
        const fetchDish = isNew ? Promise.resolve(null) : apiService.get(`/api/dishes/${id}`);

        setLoading(true);
        Promise.all([fetchAllIngredients, fetchDish])
            .then(([ingredientsResponse, dishResponse]) => {
                const ingredientsData = ingredientsResponse.data.content || [];
                setAllIngredients(ingredientsData);

                if (dishResponse) {
                    const dishData = dishResponse.data;
                    setDishName(dishData.name);
                    // Map ingredient data to include names for display
                    const populatedIngredients = dishData.ingredients.map(ing => {
                        const fullIngredient = ingredientsData.find(i => i.id === ing.ingredientId);
                        return {
                            ...ing,
                            ingredientName: fullIngredient ? fullIngredient.name : 'Unknown Ingredient'
                        };
                    });
                    setIngredientsInDish(populatedIngredients);
                }
            })
            .catch(() => setError('Failed to load data.'))
            .finally(() => setLoading(false));
    }, [id, isNew]);

    // Nutrient Calculation
    const calculatedNutrients = useMemo(() => {
        const totals = NUTRIENT_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: 0 }), {});
        if (!ingredientsInDish.length || !allIngredients.length) return totals;

        ingredientsInDish.forEach(item => {
            const fullIngredient = allIngredients.find(i => i.id === item.ingredientId);
            if (!fullIngredient) return;

            const factor = item.weightInGrams / 100;
            NUTRIENT_FIELDS.forEach(field => {
                totals[field.key] += (parseFloat(fullIngredient[field.key]) || 0) * factor;
            });
        });
        return totals;
    }, [ingredientsInDish, allIngredients]);

    const handleAddIngredient = () => {
        if (!selectedIngredient || !currentWeight || currentWeight <= 0) {
            setError("Please select an ingredient and enter a valid weight.");
            return;
        }
        // Prevent adding duplicates
        if (ingredientsInDish.some(ing => ing.ingredientId === selectedIngredient.id)) {
            setError("This ingredient is already in the dish.");
            return;
        }

        setIngredientsInDish(prev => [...prev, {
            ingredientId: selectedIngredient.id,
            ingredientName: selectedIngredient.name,
            weightInGrams: parseInt(currentWeight, 10)
        }]);
        setSelectedIngredient(null); // Reset form
        setCurrentWeight('');
        setError('');
    };

    const handleRemoveIngredient = (ingredientId) => {
        setIngredientsInDish(prev => prev.filter(ing => ing.ingredientId !== ingredientId));
    };

    const handleStartEdit = (ingredient) => {
        setEditingIngredientId(ingredient.ingredientId);
        setEditingWeight(ingredient.weightInGrams);
    };

    const handleCancelEdit = () => {
        setEditingIngredientId(null);
        setEditingWeight('');
    };


    const handleSaveEdit = () => {
        if (!editingWeight || editingWeight <= 0) {
            // You could add a more specific error message here if you like
            return;
        }
        setIngredientsInDish(prev =>
            prev.map(ing =>
                ing.ingredientId === editingIngredientId
                    ? { ...ing, weightInGrams: parseInt(editingWeight, 10) }
                    : ing
            )
        );
        handleCancelEdit(); // Exit editing mode
    };

    const handleSubmit = async () => {
        if (!dishName) {
            setError("Dish name is required.");
            return;
        }
        const payload = {
            name: dishName,
            ingredients: ingredientsInDish.map(({ ingredientId, weightInGrams }) => ({ ingredientId, weightInGrams }))
        };
        try {
            if (isNew) {
                await apiService.post('/api/dishes', payload);
            } else {
                await apiService.put(`/api/dishes/${id}`, payload);
            }
            navigate('/dishes');
        } catch (err) {
            setError("Failed to save the dish.");
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (globalThis.confirm('Are you sure you want to delete this dish?')) {
            try {
                await apiService.delete(`/api/dishes/${id}`);
                navigate('/dishes');
            } catch (err) {
                setError('Failed to delete the dish.');
                console.error(err);
            }
        }
    };


    // --- PageLayout Definitions ---
    const pageTitle = isNew ? 'Kreiraj novo jelo' : 'Informacije o jelu';
    const breadcrumbs = [{ label: 'Jela', to: '/dishes' }, { label: isNew ? 'Novo' : dishName || '...' }];
    const headerButtons = isEditing ? (
        <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>{isNew ? 'Kreiraj novo jelo' : 'Spremi promjene'}</Button>
            {!isNew && <Button variant="outlined" color="secondary" onClick={() => { setIsEditing(false); /* Add cancel logic if needed */ }}>Odustani</Button>}
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
                {/* Use a Stack for clean vertical spacing */}
                <Stack spacing={4}>
                    {/* Section 1: Dish Information */}
                    <Box>
                        <Typography variant="h6" gutterBottom>Informacije o jelu</Typography>
                        <TextField fullWidth required label="Naziv jela" value={dishName} onChange={(e) => setDishName(e.target.value)} disabled={!isEditing} />
                    </Box>

                    {/* Section 2: Ingredients Management */}
                    <Box>
                        <Typography variant="h6" gutterBottom>Sastojci u jelu</Typography>
                        <Paper variant="outlined">
                            <List dense>
                                {ingredientsInDish.length > 0 ? (
                                    ingredientsInDish.map(ing => (
                                        <ListItem key={ing.ingredientId}>
                                            {editingIngredientId === ing.ingredientId ? (
                                                // --- EDITING VIEW ---
                                                <>
                                                    <ListItemText primary={ing.ingredientName} />
                                                    <TextField
                                                        variant="outlined"
                                                        size="small"
                                                        type="number"
                                                        value={editingWeight}
                                                        onChange={(e) => setEditingWeight(e.target.value)}
                                                        sx={{ mx: 2, width: '100px' }}
                                                        autoFocus
                                                    />
                                                    <IconButton edge="end" color="primary" onClick={handleSaveEdit}><SaveIcon /></IconButton>
                                                    <IconButton edge="end" onClick={handleCancelEdit} sx={{ ml: 1 }}><CancelIcon /></IconButton>
                                                </>
                                            ) : (
                                                // --- DISPLAY VIEW ---
                                                <>
                                                    <ListItemText primary={ing.ingredientName} secondary={`${ing.weightInGrams} g`} />
                                                    {isEditing && (
                                                        <Stack direction="row" spacing={1}>
                                                            <IconButton edge="end" onClick={() => handleStartEdit(ing)}><EditIcon /></IconButton>
                                                            <IconButton edge="end" onClick={() => handleRemoveIngredient(ing.ingredientId)}><DeleteIcon /></IconButton>
                                                        </Stack>
                                                    )}
                                                </>
                                            )}
                                        </ListItem>
                                    ))
                                ) : (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                        Nisu dodani sastojci
                                    </Typography>
                                )}
                            </List>
                        </Paper>

                        {/* The "Add Ingredient" form now has full width */}
                        {isEditing && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 1.5 }}>
                                <Autocomplete
                                    options={allIngredients} getOptionLabel={(option) => option.name}
                                    value={selectedIngredient} onChange={(event, newValue) => setSelectedIngredient(newValue)}
                                    sx={{ flexGrow: 1 }} renderInput={(params) => <TextField {...params} label="Odaberi sastojak" />}
                                />
                                <TextField label="Težina (g)" type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} sx={{ width: '150px' }} />
                                <Button variant="outlined" onClick={handleAddIngredient} startIcon={<AddCircleOutlineIcon />} sx={{ height: '56px' }}>Dodaj</Button>
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* Section 3: Calculated Nutrients */}
                    <Box>
                        <Typography variant="h6" gutterBottom>Ukupni nutrijenit</Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            {/* Use a Grid here for a neat, compact nutrient layout */}
                            <Grid container spacing={2}>
                                {NUTRIENT_FIELDS.map(field => (
                                    <Grid item xs={12} sm={6} md={4} key={field.key}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body1" color="text.secondary">{field.label + ": "}</Typography>
                                            <Typography variant="body1" fontWeight="medium">{calculatedNutrients[field.key].toFixed(2)}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Box>
                </Stack>
            </Paper>
        </PageLayout>
    );
}
