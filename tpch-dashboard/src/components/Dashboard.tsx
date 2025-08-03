import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Grid,
  Typography,
  Alert,
  Box,
  Paper,
  Tab,
  Tabs,
  Button,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import cubeApi from '../services/cubeApi';
import FilterBar from './FilterBar';
import KPICards from './KPICards';
import SalesChart from './SalesChart';
import RegionChart from './RegionChart';
import { CubeQueryResponse, CubeFilter, ChartData } from '../types/cube';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CubeFilter[]>([]);
  
  // State for different data sets
  const [salesOverTime, setSalesOverTime] = useState<ChartData | null>(null);
  const [salesByRegion, setSalesByRegion] = useState<ChartData | null>(null);
  const [customerSegments, setCustomerSegments] = useState<ChartData | null>(null);
  const [orderSizeDistribution, setOrderSizeDistribution] = useState<ChartData | null>(null);
  const [topBrands, setTopBrands] = useState<ChartData | null>(null);
  const [orderStatus, setOrderStatus] = useState<ChartData | null>(null);
  
  // Track if we're already loading to prevent duplicate requests
  const loadingRef = useRef(false);

  const loadDashboardData = async () => {
    // Prevent multiple simultaneous requests
    if (loadingRef.current) {
      console.log('🚫 Skipping duplicate request - already loading');
      return;
    }
    if (!cubeApi.isConfigured()) {
      setError('Please configure your Cube API endpoint and token in the .env file.');
      setLoading(false);
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      console.log('📊 Loading dashboard data with filters:', filters);

      // Load all data in parallel
      const [
        salesOverTimeResponse,
        salesByRegionResponse,
        customerSegmentsResponse,
        orderSizeResponse,
        topBrandsResponse,
        orderStatusResponse,
      ] = await Promise.all([
        cubeApi.getSalesOverTime(filters),
        cubeApi.getSalesByRegion(filters),
        cubeApi.getCustomerSegmentRevenue(filters),
        cubeApi.getOrderSizeDistribution(filters),
        cubeApi.getTopBrands(filters, 10),
        cubeApi.getOrderStatusBreakdown(filters),
      ]);

      console.log('✅ All queries successful!');

      // Process all data
      setSalesOverTime(processSalesOverTimeData(salesOverTimeResponse));
      setSalesByRegion(processSalesByRegionData(salesByRegionResponse));
      setCustomerSegments(processCustomerSegmentsData(customerSegmentsResponse));
      setOrderSizeDistribution(processOrderSizeData(orderSizeResponse));
      setTopBrands(processTopBrandsData(topBrandsResponse));
      setOrderStatus(processOrderStatusData(orderStatusResponse));

    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const processSalesOverTimeData = (response: CubeQueryResponse): ChartData => {
    if (!response.data || !response.data.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          borderWidth: 2,
        }]
      };
    }

    const labels = response.data.map(row => {
      const dateStr = row['customer_behavior.order_date.month'] as string;
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });
    
    const data = response.data.map(row => 
      parseFloat(String(row['customer_behavior.total_revenue'])) || 0
    );

    return {
      labels,
      datasets: [{
        label: 'Revenue',
        data,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
      }]
    };
  };

  const processSalesByRegionData = (response: CubeQueryResponse): ChartData => {
    if (!response.data || !response.data.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue by Region (LTM)',
          data: [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      };
    }

    // Group by region and sum up LTM data
    const regionTotals: { [key: string]: number } = {};
    
    response.data.forEach(row => {
      const region = row['customer_behavior.region'] as string;
      const amount = parseFloat(String(row['customer_behavior.total_revenue'])) || 0;
      
      if (regionTotals[region]) {
        regionTotals[region] += amount;
      } else {
        regionTotals[region] = amount;
      }
    });

    const labels = Object.keys(regionTotals);
    const data = Object.values(regionTotals);

    return {
      labels,
      datasets: [{
        label: 'Revenue by Region (LTM)',
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  };

  const processCustomerSegmentsData = (response: CubeQueryResponse): ChartData => {
    if (!response.data || !response.data.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue by Segment',
          data: [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      };
    }

    const labels = response.data.map(row => row['customer_behavior.customers_segment'] as string);
    const data = response.data.map(row => 
      parseFloat(String(row['customer_behavior.total_revenue'])) || 0
    );

    return {
      labels,
      datasets: [{
        label: 'Revenue by Segment',
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
    };
  };

  const processOrderSizeData = (response: CubeQueryResponse): ChartData => {
    if (!response.data || !response.data.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Order Count',
          data: [],
          backgroundColor: '#36A2EB',
        }]
      };
    }

    const labels = response.data.map(row => row['customer_behavior.order_size_category'] as string);
    const orderData = response.data.map(row => 
      parseFloat(String(row['customer_behavior.count'])) || 0
    );

    return {
      labels,
      datasets: [{
        label: 'Order Count',
        data: orderData,
        backgroundColor: '#36A2EB',
      }]
    };
  };

  const processTopBrandsData = (response: CubeQueryResponse): ChartData => {
    if (!response.data || !response.data.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue by Brand',
          data: [],
          backgroundColor: '#4BC0C0',
        }]
      };
    }

    const labels = response.data.map(row => row['sales.parts_brand'] as string);
    const data = response.data.map(row => 
      parseFloat(row['sales.total_sales_amount'] as string) || 0
    );

    return {
      labels,
      datasets: [{
        label: 'Revenue by Brand',
        data,
        backgroundColor: '#4BC0C0',
      }]
    };
  };

  const processOrderStatusData = (response: CubeQueryResponse): ChartData => {
    if (!response.data || !response.data.length) {
      return {
        labels: [],
        datasets: [{
          label: 'Orders by Status',
          data: [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      };
    }

    const labels = response.data.map(row => row['customer_behavior.status'] as string);
    const data = response.data.map(row => 
      parseFloat(String(row['customer_behavior.count'])) || 0
    );

    return {
      labels,
      datasets: [{
        label: 'Orders by Status',
        data,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }]
    };
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered, filters:', filters);
    loadDashboardData();
  }, [filters]); // Only depend on filters, not the function itself

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFiltersChange = (newFilters: CubeFilter[]) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Dashboard Error
          </Typography>
          {error}
          <br /><br />
          <Typography variant="body2">
            To configure the dashboard:
            <br />
            1. Check your .env file in the project root
            <br />
            2. Ensure REACT_APP_CUBE_API_URL and REACT_APP_CUBE_API_TOKEN are set
            <br />
            3. Restart the development server: npm start
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          TPC-H Analytics Dashboard (LTM)
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardData}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Global Filters */}
      <FilterBar onFiltersChange={handleFiltersChange} disabled={loading} />

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Sales Analysis" />
          <Tab label="Customer Insights" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <KPICards filters={filters} />
            </Grid>
          </Grid>

          {/* Main Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <SalesChart
                title="Revenue Over Time"
                data={salesOverTime}
                type="line"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <RegionChart
                title="Revenue by Region (LTM)"
                data={salesByRegion}
                isLoading={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <SalesChart
                title="Revenue by Region"
                data={salesByRegion}
                type="bar"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SalesChart
                title="Order Size Distribution"
                data={orderSizeDistribution}
                type="bar"
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <SalesChart
                title="Top Brands by Revenue"
                data={topBrands}
                type="bar"
                height={400}
                isLoading={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RegionChart
                title="Customer Segments"
                data={customerSegments}
                isLoading={loading}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RegionChart
                title="Orders by Status"
                data={orderStatus}
                isLoading={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Dashboard;