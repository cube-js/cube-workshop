import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { MetricCardData } from '../types/cube';

interface MetricsCardProps {
  data: MetricCardData;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  const formatValue = (value: string | number, format?: string): string => {
    if (typeof value === 'string') return value;
    
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    if (format === 'percent') {
      return `${(value * 100).toFixed(1)}%`;
    }
    
    // Default number formatting
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getTrendIcon = (change?: number): React.ReactElement | undefined => {
    if (change === undefined) return undefined;
    
    if (change > 0) {
      return <TrendingUp sx={{ color: 'success.main', fontSize: 16 }} />;
    } else if (change < 0) {
      return <TrendingDown sx={{ color: 'error.main', fontSize: 16 }} />;
    }
    return undefined;
  };

  const getTrendColor = (change?: number) => {
    if (change === undefined) return 'default';
    return change > 0 ? 'success' : change < 0 ? 'error' : 'default';
  };

  if (data.isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={40} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {data.title}
        </Typography>
        
        <Box display="flex" alignItems="baseline" gap={1} mb={1}>
          <Typography variant="h4" component="div" color="text.primary">
            {formatValue(data.value, data.format)}
          </Typography>
        </Box>
        
        {data.change !== undefined && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <Chip
              icon={getTrendIcon(data.change)}
              label={`${data.change > 0 ? '+' : ''}${data.change.toFixed(1)}%`}
              size="small"
              color={getTrendColor(data.change) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary">
              vs last period
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricsCard;