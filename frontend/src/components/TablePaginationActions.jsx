import React, {useEffect, useState} from 'react';
import { Box, IconButton, TextField, Typography } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

export default function TablePaginationActions(props) {
    const { count, page, rowsPerPage, onPageChange } = props;
    const [inputPage, setInputPage] = useState(page + 1);

    const totalPages = Math.ceil(count / rowsPerPage);

    const handleFirstPageButtonClick = () => onPageChange(null, 0);
    const handleBackButtonClick = () => onPageChange(null, page - 1);
    const handleNextButtonClick = () => onPageChange(null, page + 1);
    const handleLastPageButtonClick = () => onPageChange(null, Math.max(0, totalPages - 1));

    const handleInputChange = (event) => {
        setInputPage(event.target.value);
    };

    const handleGoToPage = (event) => {
        if (event.key === 'Enter') {
            const pageNumber = parseInt(inputPage, 10);
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                onPageChange(null, pageNumber - 1);
            } else {
                setInputPage(page + 1);
            }
        }
    };

    useEffect(() => {
        setInputPage(page + 1);
    }, [page]);


    return (
        <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
                <FirstPageIcon />
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
                <KeyboardArrowLeft />
            </IconButton>
            <Typography>
                Stranica {page + 1} od {totalPages}
            </Typography>
            <IconButton onClick={handleNextButtonClick} disabled={page >= totalPages - 1}>
                <KeyboardArrowRight />
            </IconButton>
            <IconButton onClick={handleLastPageButtonClick} disabled={page >= totalPages - 1}>
                <LastPageIcon />
            </IconButton>
            <TextField
                size="small"
                variant="outlined"
                label="Idi na"
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={handleGoToPage}
                sx={{ width: '80px', ml: 2 }}
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Box>
    );
}
