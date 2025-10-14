
// // import React from 'react';
// // import { Card, CardContent, Typography, Box } from '@mui/material';

// // // SVG icon for the 'up' trend arrow
// // const ArrowUp = () => (
// //   <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
// //     <path d="M12 2L2 22L22 22L12 2Z" />
// //   </svg>
// // );

// // // SVG icon for the 'down' trend arrow
// // const ArrowDown = () => (
// //   <svg width="12" height="12" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
// //     <path d="M12 22L2 2L22 2L12 22Z" />
// //   </svg>
// // );

// // export default function KPI({ title, value, change, trend, variant = 'blue' }) {
// //   // Gradient styles
// //   const gradients = {
// //     blue: 'linear-gradient(135deg, #0f356dff 0%, #1d51a5ff 100%)',
// //     dark: 'linear-gradient(135deg, #292a2cff 0%, #c3cfdcff 100%)',
// //   };

// //   const backgroundGradient = gradients[variant] || gradients.blue;

// //   return (
// //     <Card
// //       sx={{
// //         borderRadius: 3,
// //         color: 'white',
// //         background: backgroundGradient,
// //         boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
// //         minHeight: 120,
// //         display: 'flex',
// //         flexDirection: 'column',
// //         justifyContent: 'center',
// //         flex: 1,
// //         height: '100%', 
// //         minWidth: 260,       // ensures cards don’t shrink too small
// //         maxWidth: 280,       // keeps them balanced
// //         margin: 1,           // small gap between cards
// //       }}
// //     >
// //       <CardContent>
// //         <Typography 
// //           variant="subtitle1" 
// //           sx={{ opacity: 0.9, fontWeight: 500, lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}
// //         >
// //           {title}
// //         </Typography>
// //         <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1.5 }}>
// //           <Typography variant="h4" fontWeight={700} sx={{ fontFamily: 'Inter, sans-serif' }}>
// //             {value}
// //           </Typography>
// //           {change && (
// //             <Box
// //               sx={{
// //                 display: 'flex',
// //                 alignItems: 'center',
// //                 backgroundColor: 'rgba(255, 255, 255, 0.2)',
// //                 borderRadius: '12px',
// //                 padding: '2px 8px',
// //                 ml: 1.5,
// //               }}
// //             >
// //               {trend === 'up' ? <ArrowUp /> : <ArrowDown />}
// //               <Typography
// //                 variant="body2"
// //                 sx={{ fontWeight: 600, color: 'white', ml: 0.5, fontFamily: 'Inter, sans-serif' }}
// //               >
// //                 {change}
// //               </Typography>
// //             </Box>
// //           )}
// //         </Box>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// import React from 'react';
// import { Grid, Card, CardContent, Typography, Box, useTheme } from '@mui/material';

// // SVG icon for the 'up' trend arrow
// const ArrowUp = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 4L3 15H9V20H15V15H21L12 4Z" />
//   </svg>
// );

// // SVG icon for the 'down' trend arrow
// const ArrowDown = () => (
//   <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 20L21 9H15V4H9V9H3L12 20Z" />
//   </svg>
// );

// // KPI Component
// function KPI({ title, value, change, trend, variant = 'blue' }) {
//   const theme = useTheme();

//   // Gradient styles
//   const gradients = {
//     blue: 'linear-gradient(135deg, #0f356d 0%, #1d51a5 100%)',
//     dark: 'linear-gradient(135deg, #292a2c 0%, #c3cfdc 100%)',
//     light: 'linear-gradient(135deg, #f5f7fa 0%, #d3dce6 100%)',
//   };

//   const backgroundGradient = gradients[variant] || gradients.blue;
//   const textColor = variant === 'light' ? theme.palette.text.primary : 'white';
//   const changeBgColor = variant === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';

//   return (
//     <Card
//       sx={{
//         borderRadius: 3,
//         background: backgroundGradient,
//         boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
//         minHeight: 120,
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         flex: 1, // Fill available width
//         height: '100%', // Ensure consistent height
//         color: textColor,
//       }}
//     >
//       <CardContent sx={{ p: 2, flexGrow: 1 }}>
//         <Typography
//           variant="subtitle1"
//           sx={{
//             opacity: 0.9,
//             fontWeight: 500,
//             lineHeight: 1.2,
//             fontFamily: 'Inter, sans-serif',
//           }}
//         >
//           {title || 'N/A'}
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1.5 }}>
//           <Typography
//             variant="h4"
//             fontWeight={700}
//             sx={{ fontFamily: 'Inter, sans-serif' }}
//           >
//             {value || 'N/A'}
//           </Typography>
//           {change && (
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: changeBgColor,
//                 borderRadius: '12px',
//                 padding: '2px 8px',
//                 ml: 1.5,
//               }}
//             >
//               {trend === 'up' ? <ArrowUp /> : <ArrowDown />}
//               <Typography
//                 variant="body2"
//                 sx={{
//                   fontWeight: 600,
//                   color: textColor,
//                   ml: 0.5,
//                   fontFamily: 'Inter, sans-serif',
//                 }}
//               >
//                 {change}
//               </Typography>
//             </Box>
//           )}
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// // KPI Container Component
// export default function KPIContainer({ kpiData }) {
//   const theme = useTheme();

//   // Handle empty or invalid kpiData
//   if (!kpiData || !Array.isArray(kpiData) || kpiData.length === 0) {
//     return (
//       <Box sx={{ p: 2, textAlign: 'center' }}>
//         <Typography variant="body1" color="text.secondary">
//           No KPI data available
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Grid
//       container
//       spacing={2}
//       sx={{
//         mb: 3,
//         justifyContent: kpiData.length === 1 ? 'center' : 'space-between', // Center single card
//         alignItems: 'stretch', // Ensure equal height
//         width: '100%', // Full width of parent
//       }}
//     >
//       {kpiData.map((item, idx) => (
//         <Grid
//           item
//           xs={12} // Full width on extra small screens
//           sm={6} // 2 items per row on small screens
//           md={12 / Math.min(kpiData.length, 4)} // Max 4 items per row
//           key={item.id || idx} // Prefer item.id
//           sx={{
//             display: 'flex', // Stretch card to fill item
//             minWidth: { md: 200 }, // Prevent cards from being too narrow
//           }}
//         >
//           <KPI
//             {...item}
//             variant={idx % 2 === 0 ? 'blue' : theme.palette.mode === 'dark' ? 'dark' : 'light'}
//           />
//         </Grid>
//       ))}
//     </Grid>
//   );
// }
// KPI.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

// SVG icon for the 'up' trend arrow
const ArrowUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L3 15H9V20H15V15H21L12 4Z" />
  </svg>
);

// SVG icon for the 'down' trend arrow
const ArrowDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20L21 9H15V4H9V9H3L12 20Z" />
  </svg>
);

export default function KPI({ title, value, change, trend, variant = 'blue' }) {
  const theme = useTheme();

  // Gradient styles
  const gradients = {
    blue: 'linear-gradient(135deg, #0f356d 0%, #1d51a5 100%)',
    dark: 'linear-gradient(135deg, #292a2c 0%, #c3cfdc 100%)',
    light: 'linear-gradient(135deg, #f5f7fa 0%, #3b3939 100%)',
  };

  const backgroundGradient = gradients[variant] || gradients.blue;
  const textColor = variant === 'light' ? theme.palette.text.primary : 'white';
  const changeBgColor = variant === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)';

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: backgroundGradient,
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.2)',
        minHeight: 120,
        minWidth :220,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
        color: textColor,
      }}
    >
      <CardContent sx={{ p: 2, flexGrow: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            opacity: 0.9,
            fontWeight: 500,
            lineHeight: 1.2,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {title || 'N/A'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 1.5 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ fontFamily: 'Inter, sans-serif' }}
          >
            {value || 'N/A'}
          </Typography>
          {change && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: changeBgColor,
                borderRadius: '12px',
                padding: '2px 8px',
                ml: 1.5,
              }}
            >
              {trend === 'up' ? <ArrowUp /> : <ArrowDown />}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: textColor,
                  ml: 0.5,
                  fontFamily: 'Inter, sans-serif',
                }}
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