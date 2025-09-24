
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

// SVG icon for the 'up' trend arrow
const ArrowUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 22L22 22L12 2Z" />
  </svg>
);

// SVG icon for the 'down' trend arrow
const ArrowDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22L2 2L22 2L12 22Z" />
  </svg>
);

export default function KPI({ title, value, change, trend, variant = 'blue' }) {
  // Gradient styles
  const gradients = {
    blue: 'linear-gradient(135deg, #0f356dff 0%, #1d51a5ff 100%)',
    dark: 'linear-gradient(135deg, #292a2cff 0%, #c3cfdcff 100%)',
  };

  const backgroundGradient = gradients[variant] || gradients.blue;

  return (
    <Card
      sx={{
        borderRadius: 3,
        color: 'white',
        background: backgroundGradient,
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',

        // ✅ Fix width for consistency
        flex: 1,             // allows equal width when placed in a row
        minWidth: 220,       // ensures cards don’t shrink too small
        maxWidth: 280,       // keeps them balanced
        margin: 1,           // small gap between cards
      }}
    >
      <CardContent>
        <Typography 
          variant="subtitle1" 
          sx={{ opacity: 0.9, fontWeight: 500, lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1.5 }}>
          <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'Inter, sans-serif' }}>
            {value}
          </Typography>
          {change && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '2px 8px',
                ml: 1.5,
              }}
            >
              {trend === 'up' ? <ArrowUp /> : <ArrowDown />}
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: 'white', ml: 0.5, fontFamily: 'Inter, sans-serif' }}
              >
                {change}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

