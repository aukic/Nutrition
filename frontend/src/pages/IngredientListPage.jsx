import React, {useCallback, useEffect, useState} from 'react';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField, CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import apiService from '../api/apiService';
import PageLayout from "../components/PageLayout.jsx";
import useDebounce from '../hooks/useDebounce';
import TablePaginationActions from '../components/TablePaginationActions';
import {TablePagination} from "@mui/material";
import Typography from "@mui/material/Typography";
export default function IngredientListPag() {
    const [ingredients, setIngredients] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchIngredients = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                size: rowsPerPage,
                name: debouncedSearchQuery,
            });
            const response = await apiService.get(`/api/ingredients?${params.toString()}`);
            setIngredients(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError('Failed to fetch ingredients. Please make sure you are logged in.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearchQuery]);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleRowClick = (id) => {
        navigate(`/ingredients/${id}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const breadcrumbs = [{ label: 'Sastojci' }];

    const headerButtons = (
        <Button variant="contained" color="primary" onClick={() => navigate('/ingredients/new')}>
            Dodaj novi sastojak
        </Button>
    );

    return (
        <PageLayout title="Sastojci" breadcrumbs={breadcrumbs} headerButtons={headerButtons}>
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Pretrži sastojke po nazivu"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </Box>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Naziv</TableCell>
                            <TableCell align="right">KJ</TableCell>
                            <TableCell align="right">Kcal</TableCell>
                            <TableCell align="right">Ugljikohidrati (g)</TableCell>
                            <TableCell align="right">Proteini (g)</TableCell>
                            <TableCell align="right">Mast (g)</TableCell>
                            <TableCell align="right">Šećeri (g)</TableCell>
                            <TableCell align="right">Vlakna (g)</TableCell>
                            <TableCell align="right">Voda (g)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : (
                            ingredients.map((ingredient) => (
                                <TableRow
                                    key={ingredient.id}
                                    hover
                                    onClick={() => handleRowClick(ingredient.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <TableCell component="th" scope="row">{ingredient.name}</TableCell>
                                    <TableCell align="right">{ingredient.energyKj}</TableCell>
                                    <TableCell align="right">{ingredient.energyKcal}</TableCell>
                                    <TableCell align="right">{ingredient.carbohydrates}</TableCell>
                                    <TableCell align="right">{ingredient.protein}</TableCell>
                                    <TableCell align="right">{ingredient.fat}</TableCell>
                                    <TableCell align="right">{ingredient.sugars}</TableCell>
                                    <TableCell align="right">{ingredient.fiber}</TableCell>
                                    <TableCell align="right">{ingredient.water}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                component="div"
                count={totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
            />
        </PageLayout>
    );
}
