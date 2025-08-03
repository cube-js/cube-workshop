import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { ChartData } from '../types/cube';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface RegionChartProps {
  title: string;
  data: ChartData | null;
  height?: number;
  isLoading?: boolean;
}

const RegionChart: React.FC<RegionChartProps> = ({ 
  title, 
  data, 
  height = 400,
  isLoading = false 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            // Format currency values
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(value);
            
            return `${context.label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
  };

  const regionColors = [
    '#FF6384', // Pink/Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40', // Orange
    '#FF6B6B', // Light Red
    '#4ECDC4', // Light Teal
  ];

  const enhancedData = data ? {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: regionColors.slice(0, data.labels.length),
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverBorderWidth: 3,
    }))
  } : null;

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box height={height}>
            <Skeleton variant="circular" width="60%" height="60%" sx={{ mx: 'auto' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.datasets.length) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Box 
            height={height} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bgcolor="grey.50"
            borderRadius={1}
          >
            <Typography variant="body2" color="text.secondary">
              No data available
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box height={height} display="flex" alignItems="center" justifyContent="center">
          <Doughnut data={enhancedData!} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default RegionChart;