import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink, Toolbar, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * A reusable component that provides a standard, full-width page layout.
 * @param {object} props
 * @param {string} props.title - The main title of the page to be displayed in the header.
 * @param {React.ReactNode} props.headerButtons - A React node (typically one or more Buttons) to display in the header.
 * @param {Array<{label: string, to?: string}>} props.breadcrumbs - An array of breadcrumb items.
 * @param {React.ReactNode} props.children - The main content of the page.
 */
export default function PageLayout({ title, headerButtons, breadcrumbs, children }) {
    return (
        <Box component="div" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '90%' }}>
            {/* This Toolbar provides the necessary vertical space for the app bar */}
            <Toolbar />

            {/* Breadcrumbs */}
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                    Home
                </MuiLink>
                {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return isLast ? (
                        <Typography key={index} color="text.primary">
                            {crumb.label}
                        </Typography>
                    ) : (
                        <MuiLink key={index} component={RouterLink} underline="hover" color="inherit" to={crumb.to}>
                            {crumb.label}
                        </MuiLink>
                    );
                })}
            </Breadcrumbs>

            {/* Page Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Paper sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h4" component="h1">
                        {title}
                    </Typography>
                    <Box>
                        {headerButtons}
                    </Box>
                </Paper>
            </Box>

            {/* Main Content Area - RENDER CHILDREN DIRECTLY */}
            <Box>
                <Paper sx={{ p: 3, mt: 2 }}>
                    {children}
                </Paper>
            </Box>
        </Box>
    );
}
