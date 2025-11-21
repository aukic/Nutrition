import React from 'react';
import { Typography } from '@mui/material';
import PageLayout from '../components/PageLayout'; // Assuming this component exists

export default function HomePage() {
    const breadcrumbs = [{ label: 'Home' }];

    return (
        <PageLayout title="Welcome to the Nutrition App" breadcrumbs={breadcrumbs}>
            <Typography variant="body1">
                Welcome! Please use the sidebar navigation to manage your ingredients and dishes.
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                This application allows you to create a detailed database of food ingredients and combine them into dishes
                to see their total nutritional value in real-time.
            </Typography>
        </PageLayout>
    );
}
