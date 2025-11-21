import React, { useState, useEffect, useCallback } from 'react';
import {
    Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Box, CircularProgress, Typography,
    TextField, TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/apiService';
import PageLayout from '../components/PageLayout';
import useDebounce from '../hooks/useDebounce';
import TablePaginationActions from '../components/TablePaginationActions';

export default function DishListPage() {
    const [dishes, setDishes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalElements, setTotalElements] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    // Note: Your backend needs to support pagination/search for dishes
    const fetchDishes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                size: rowsPerPage,
                name: debouncedSearchQuery,
            });
            // Assuming a paginated endpoint for dishes exists
            const response = await apiService.get(`/api/dishes?${params.toString()}`);
            setDishes(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError('Failed to fetch dishes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, debouncedSearchQuery]);

    useEffect(() => {
        fetchDishes();
    }, [fetchDishes]);

    const handleRowClick = (id) => navigate(`/dishes/${id}`);
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const breadcrumbs = [{ label: 'Jela' }];
    const headerButtons = (
        <Button variant="contained" color="primary" onClick={() => navigate('/dishes/new')}>
            Dodaj novo jelo
        </Button>
    );

    return (
        <PageLayout title="Jela" breadcrumbs={breadcrumbs} headerButtons={headerButtons}>
            <TextField fullWidth variant="outlined" label="Pretraži prema nazivu jela" value={searchQuery} onChange={handleSearchChange} sx={{ mb: 2 }}/>

            {error && <Typography color="error">{error}</Typography>}

            <TableContainer>
                <Table>
                    <TableHead><TableRow><TableCell>Naziv jela</TableCell></TableRow></TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                            dishes.map((dish) => (
                                <TableRow key={dish.id} hover onClick={() => handleRowClick(dish.id)} style={{ cursor: 'pointer' }}>
                                    <TableCell component="th" scope="row">{dish.name}</TableCell>
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
