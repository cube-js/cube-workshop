import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { ChartData } from '../types/cube';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  title: string;
  data: ChartData | null;
  type?: 'line' | 'bar';
  height?: number;
  isLoading?: boolean;
}

const SalesChart: React.FC<SalesChartProps> = ({ 
  title, 
  data, 
  type = 'line', 
  height = 400,
  isLoading = false 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            
            // Format currency values
            if (context.dataset.label?.toLowerCase().includes('sales') || 
                context.dataset.label?.toLowerCase().includes('revenue')) {
              return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value)}`;
            }
            
            // Format percentage values
            if (context.dataset.label?.toLowerCase().includes('rate') || 
                context.dataset.label?.toLowerCase().includes('percent')) {
              return `${context.dataset.label}: ${(value * 100).toFixed(1)}%`;
            }
            
            // Default number formatting
            return `${context.dataset.label}: ${new Intl.NumberFormat('en-US').format(value)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            // Format Y-axis labels for currency
            if (title.toLowerCase().includes('sales') || 
                title.toLowerCase().includes('revenue')) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(value);
            }
            
            // Format Y-axis labels for large numbers
            return new Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value);
          }
        }
      }
    }
  };

  const chartColors = {
    primary: '#1976d2',
    secondary: '#dc004e',
    success: '#388e3c',
    warning: '#f57c00',
    info: '#0288d1',
    gradient: 'rgba(25, 118, 210, 0.1)'
  };

  const enhancedData = data ? {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || 
        (type === 'line' ? chartColors.gradient : 
         Array.isArray(dataset.data) 
           ? dataset.data.map((_, i) => 
               Object.values(chartColors)[i % Object.values(chartColors).length])
           : chartColors.primary),
      borderColor: dataset.borderColor || chartColors.primary,
      borderWidth: dataset.borderWidth || (type === 'line' ? 2 : 1),
      fill: type === 'line' ? true : false,
      tension: type === 'line' ? 0.4 : undefined,
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
            <Skeleton variant="rectangular" width="100%" height="100%" />
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
        <Box height={height}>
          {type === 'line' ? (
            <Line data={enhancedData!} options={options} />
          ) : (
            <Bar data={enhancedData!} options={options} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart;