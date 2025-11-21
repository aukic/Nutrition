import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress, Grid, TextField, Stack, Typography} from '@mui/material';
import apiService from '../api/apiService';
import PageLayout from "../components/PageLayout.jsx";

const initialIngredientState = {
    name: '', energyKj: '', energyKcal: '', carbohydrates: '', protein: '', fat: '', water: '',
    sugars: '', fiber: '', histidine: '', isoleucine: '', leucine: '', lysine: '',
    methionine: '', phenylalanine: '', threonine: '', tryptophan: '', valine: '',
    vitaminCMg: '', vitaminDMcg: '', vitaminEMg: '', vitaminKMcg: '', vitaminB6Mg: '',
    vitaminAiu: '', vitaminB1ThiamineMg: '', vitaminB2RiboflavinMg: '', vitaminB3NiacinMg: '',
    vitaminB5PantothenicMcg: '', vitaminB7BiotinMcg: '', vitaminB9FolateMcg: '',
    vitaminK1PhylloquinoneMcg: '', vitaminK2MenaquinoneMcg: '', ironMg: '', calciumMg: '',
    sodiumMg: '', magnesiumMg: '', potassiumMg: '', zincMg: ''
};

const formSections = {
    "Makronutrijenti": [
        { key: "energyKcal", label: "Energija (kcal)" },
        { key: "energyKj", label: "Energija (kJ)" },
        { key: "carbohydrates", label: "Ugljikohidrati (g)" },
        { key: "protein", label: "Proteini (g)" },
        { key: "fat", label: "Masti (g)" },
        { key: "sugars", label: "Šećeri (g)" },
        { key: "fiber", label: "Vlakna (g)" },
        { key: "water", label: "Voda (g)" }
    ],
    "Aminokiseline": [
        { key: "histidine", label: "Histidin (g)" },
        { key: "isoleucine", label: "Izoleucin (g)" },
        { key: "leucine", label: "Leucin (g)" },
        { key: "lysine", label: "Lizin (g)" },
        { key: "methionine", label: "Metionin (g)" },
        { key: "phenylalanine", label: "Fenilalanin (g)" },
        { key: "threonine", label: "Treonin (g)" },
        { key: "tryptophan", label: "Triptofan (g)" },
        { key: "valine", label: "Valin (g)" }
    ],
    "Vitamini": [
        { key: "vitaminAiu", label: "Vitamin A (IU)" },
        { key: "vitaminCMg", label: "Vitamin C (mg)" },
        { key: "vitaminDMcg", label: "Vitamin D (mcg)" },
        { key: "vitaminEMg", label: "Vitamin E (mg)" },
        { key: "vitaminKMcg", label: "Vitamin K (mcg)" },
        { key: "vitaminB1ThiamineMg", label: "Vitamin B1 (Tiamin) (mg)" },
        { key: "vitaminB2RiboflavinMg", label: "Vitamin B2 (Riboflavin) (mg)" },
        { key: "vitaminB3NiacinMg", label: "Vitamin B3 (Niacin) (mg)" },
        { key: "vitaminB5PantothenicMcg", label: "Vitamin B5 (Pantotenska k.) (mcg)" },
        { key: "vitaminB6Mg", label: "Vitamin B6 (mg)" },
        { key: "vitaminB7BiotinMcg", label: "Vitamin B7 (Biotin) (mcg)" },
        { key: "vitaminB9FolateMcg", label: "Vitamin B9 (Folat) (mcg)" },
        { key: "vitaminK1PhylloquinoneMcg", label: "Vitamin K1 (Filokinon) (mcg)" },
        { key: "vitaminK2MenaquinoneMcg", label: "Vitamin K2 (Menakinon) (mcg)" }
    ],
    "Minerali": [
        { key: "calciumMg", label: "Kalcij (mg)" },
        { key: "ironMg", label: "Željezo (mg)" },
        { key: "magnesiumMg", label: "Magnezij (mg)" },
        { key: "potassiumMg", label: "Kalij (mg)" },
        { key: "sodiumMg", label: "Natrij (mg)" },
        { key: "zincMg", label: "Cink (mg)" }
    ]
};

const formatLabel = (fieldName) => {
    return fieldName
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace('Mg', ' (mg)')
        .replace('Mcg', ' (mcg)')
        .replace('Aiu', ' (AIU)')
        .replace('Kj', ' (kJ)')
        .replace('Kcal', ' (kcal)')
        .replace(/\b\w/g, l => l.toUpperCase());
};


export default function IngredientDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [ingredient, setIngredient] = useState(initialIngredientState);
    const [originalIngredient, setOriginalIngredient] = useState(initialIngredientState);
    const [isEditing, setIsEditing] = useState(isNew); // Start in edit mode if it's a new ingredient
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!isNew) {
            const fetchIngredient = async () => {
                setLoading(true);
                try {
                    const response = await apiService.get(`api/ingredients/${id}`);
                    const fetchedData = {};
                    for (const key in initialIngredientState) {
                        fetchedData[key] = response.data[key] === null ? '' : response.data[key];
                    }
                    setIngredient(fetchedData);
                    setOriginalIngredient(fetchedData);
                } catch (err) {
                    setError('Failed to fetch ingredient details.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchIngredient();
        }
    }, [id, isNew]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setIngredient(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ingredient.name) {
            setError('Ingredient name is mandatory.');
            return;
        }
        setError('');
        setSuccess('');

        const payload = {};
        for (const key in ingredient) {
            if (ingredient[key] !== '' && key !== 'id' && key !== 'name') {
                payload[key] = Number(ingredient[key]);
            } else if (key === 'name') {
                payload[key] = ingredient[name];
            }
        }

        try {
            if (isNew) {
                await apiService.post('/ingredients', payload);
                setSuccess('Ingredient created successfully!');
            } else {
                await apiService.put(`/ingredients/${id}`, payload);
                setSuccess('Ingredient updated successfully!');
            }
            setTimeout(() => navigate('/ingredients'), 1500);
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (globalThis.confirm('Are you sure you want to delete this ingredient?')) {
            try {
                await apiService.delete(`/ingredients/${id}`);
                navigate('/ingredients');
            } catch (err) {
                setError('Failed to delete the ingredient.');
                console.error(err);
            }
        }
    };

    const handleCancel = () => {
        setIngredient(originalIngredient);
        setIsEditing(false);
        setError('');
    };

    const pageTitle = isNew ? 'Dodaj sastojak' : 'Informacije o sastojku';
    const breadcrumbs = [
        { label: 'Sastojci', to: '/ingredients' },
        { label: isNew ? 'Novo' : ingredient.name || 'Detalji' }
    ];

    const headerButtons = isEditing ? (
        <Stack direction="row" spacing={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                {isNew ? 'Spremi' : 'Ažuriraj'}
            </Button>
            {!isNew && (
                <Button variant="outlined" color="secondary" onClick={handleCancel}>
                    Odustani
                </Button>
            )}
        </Stack>
    ) : (
        <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setIsEditing(true)}>
                Ažuriraj
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
                Obriši
            </Button>
        </Stack>
    );
    return (
        <PageLayout title={pageTitle} breadcrumbs={breadcrumbs} headerButtons={headerButtons}>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
            ) : (
                <Box component="form" noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Naziv"
                                name="name"
                                value={ingredient.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                error={!ingredient.name}
                            />
                        </Grid>
                        {Object.entries(formSections).map(([sectionTitle, fields]) => (
                            <Box key={sectionTitle} sx={{ my: 3 }}>
                                <Typography variant="h6">{sectionTitle}</Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    {fields.map((field) => (
                                        <Grid item xs={12} sm={6} md={4} key={field.key}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label={field.label} // Direktno koristi prevedenu labelu
                                                name={field.key} // Koristi ključ za 'name' atribut i pristup stanju
                                                value={ingredient[field.key]}
                                                onChange={handleChange}
                                                variant="outlined"
                                                disabled={!isEditing} // Ne zaboravite dodati ovo ako već niste
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        ))}
                    </Grid>
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                </Box>
            )}
        </PageLayout>
    );
}
