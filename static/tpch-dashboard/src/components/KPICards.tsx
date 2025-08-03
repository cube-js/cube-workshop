import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { cubeApi } from '../services/cubeApi';
import { CubeFilter, MetricCardData } from '../types/cube';
import MetricsCard from './MetricsCard';

interface KPICardsProps {
  filters?: CubeFilter[];
}

const KPICards: React.FC<KPICardsProps> = ({ filters = [] }) => {
  const [data, setData] = useState<MetricCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchKPIs();
  }, [filters]);

  const fetchKPIs = async () => {
    try {
      setLoading(true);
      const response = await cubeApi.query({
        measures: [
          'customer_behavior.count',
          'customer_behavior.total_revenue',
          'customer_behavior.average_order_value'
        ],
        timeDimensions: [{
          dimension: 'customer_behavior.order_date',
          dateRange: 'last 12 months'
        }],
        filters
      });

      // Extract data from the single result row
      // Cube automatically rolls up the data when no granularity is specified
      const resultData = response.data[0] || {};
      
      setData([
        {
          title: 'Order Count (LTM)',
          value: parseInt(String(resultData['customer_behavior.count'] || '0')),
          format: 'number',
        },
        {
          title: 'Revenue (LTM)',
          value: parseFloat(String(resultData['customer_behavior.total_revenue'] || '0')),
          format: 'currency',
        },
        {
          title: 'Avg Order Value (LTM)',
          value: parseFloat(String(resultData['customer_behavior.average_order_value'] || '0')),
          format: 'currency',
        },
      ]);
    } catch (err) {
      setError('Failed to load KPIs');
      console.error('Error fetching KPIs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((index) => (
          <Grid item xs={12} sm={4} md={4} key={index}>
            <MetricsCard data={{ title: '', value: 0, isLoading: true }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {data.map((metric, index) => (
        <Grid item xs={12} sm={4} md={4} key={index}>
          <MetricsCard data={metric} />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards;